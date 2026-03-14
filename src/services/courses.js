const fs = require('fs');
const path = require('path');
const AppError = require('../utils/Error');
const Files = require('../controllers/File');
const repo = require('../repositories/courses');

// Validation helpers
const parseDecimal = (value, label) => {
  const raw = String(value ?? '').trim();
  if (!raw) throw new AppError(`${label}-ը պարտադիր է`, 400);
  const normalized = raw.replace(/[^\d.,-]/g, '').replace(/,/g, '');
  const num = Number(normalized);
  if (!Number.isFinite(num)) throw new AppError(`${label}-ը պետք է լինի թիվ`, 400);
  return num;
};

const requireString = (value, label) => {
  const v = String(value ?? '').trim();
  if (!v) throw new AppError(`${label}-ը պարտադիր է`, 400);
  return v;
};

const normalizeWhatToLearn = (value) => {
  let arr = value;
  // If it's a string (from FormData), try to parse as JSON
  if (typeof arr === 'string') {
    try {
      arr = JSON.parse(arr);
    } catch {
      throw new AppError('"whatToLearn" պետք է լինի զանգված', 400);
    }
  }
  if (!Array.isArray(arr)) throw new AppError('"whatToLearn" պետք է լինի զանգված', 400);
  const result = arr.map(v => String(v || '').trim()).filter(Boolean);
  // Allow empty array
  return result;
};

module.exports = {
  // Create new course
  addCourse: async (body, files, db) => {
    const title = requireString(body.title, 'Վերնագիր');
    const category = requireString(body.category, 'Կատեգորիա');
    const description = requireString(body.description, 'Նկարագրություն');
    const price = parseDecimal(body.price, 'Գին');
    
    // Discount is optional - default to 0
    let discount = 0;
    if (body.discount !== undefined && body.discount !== '' && body.discount !== null) {
      discount = parseDecimal(body.discount, 'Զեղչ');
    }
    
    // whatToLearn is optional - default to empty array
    let whatToLearn = [];
    if (body.whatToLearn !== undefined && body.whatToLearn !== '' && body.whatToLearn !== null) {
      whatToLearn = normalizeWhatToLearn(body.whatToLearn);
    }
    
    // prerequisites is optional - default to empty array
    let prerequisites = [];
    if (body.prerequisites !== undefined && body.prerequisites !== '' && body.prerequisites !== null) {
      if (typeof body.prerequisites === 'string') {
        try {
          prerequisites = JSON.parse(body.prerequisites);
        } catch {
          throw new AppError('"prerequisites" պետք է լինի զանգված', 400);
        }
      } else if (Array.isArray(body.prerequisites)) {
        prerequisites = body.prerequisites;
      }
    }
    
    const language = body.language !== undefined ? String(body.language ?? '').trim() || null : null;

    const t = await db.con.transaction();
    try {
      const course = await repo.create(
        { title, category, description, price, discount, whatToLearn, prerequisites, language },
        t
      );

      // Handle course image upload (accept course_img | image | cover)
      const filePayload = files?.course_img || files?.image || files?.cover;
      if (filePayload && filePayload.name && filePayload.mimetype) {
        const modelForFiles = {
          id: course.id,
          files: [],
          constructor: { name: 'courses' }
        };
        const img = await new Files(modelForFiles, filePayload).replace('course_img');
        if (img.status !== 'success') {
          const msg = typeof img.message === 'object' ? Object.values(img.message).join(' ') : img.message;
          throw new AppError(msg, 400);
        }
        await repo.createFile(img.table, t);
      }

      await t.commit();
      return course;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Get all courses with pagination
  getCourses: async (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || 10);
    const offset = (page - 1) * limit;

    const { count, rows } = await repo.findAndCountAll({ limit, offset });

    return {
      courses: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  },

  // Get single course by ID
  getCourse: async (id) => {
    const course = await repo.findByIdWithModules(id);
    if (!course) throw new AppError('Դասընթացը չի գտնվել', 404);
    return course;
  },

  // Update course
  updateCourse: async (id, body, files, db) => {
    const { title, description, price, discount, category, whatToLearn, language } = body;

    const course = await repo.findById(id);
    if (!course) throw new AppError('Course not found', 404);

    const update = {};
    if (title !== undefined) update.title = requireString(title, 'Վերնագիր');
    if (description !== undefined) update.description = requireString(description, 'Նկարագրություն');
    if (price !== undefined) update.price = parseDecimal(price, 'Գին');
    if (discount !== undefined) update.discount = parseDecimal(discount, 'Զեղչ');
    if (category !== undefined) update.category = requireString(category, 'Կատեգորիա');
    if (whatToLearn !== undefined) update.whatToLearn = normalizeWhatToLearn(whatToLearn);
    if (language !== undefined) update.language = String(language ?? '').trim() || null;

    const t = await db.con.transaction();
    try {
      await repo.update(course, update, t);
      await t.commit();
      return course;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Delete course and associated files, modules, and lessons
  deleteCourse: async (id, db) => {
    const course = await repo.findById(id);
    if (!course) throw new AppError('Course not found', 404);

    const t = await db.con.transaction();
    try {
      // 1. Find all modules for this course
      const modules = await db.models.Module.findAll({
        where: { course_id: id },
        transaction: t
      });

      // 2. For each module, delete its lessons and files
      for (const module of modules) {
        // Delete module files from disk and DB
        const moduleFiles = await repo.findFiles(module.id, 'modules', t);
        for (const file of moduleFiles) {
          const sizes = ['small', 'large'];
          for (const size of sizes) {
            const filePath = path.join(__dirname, `../../public/images/modules/${size}/${file.name}.${file.ext}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          await repo.destroyFile(file, t);
        }

        // Delete module's lessons
        await db.models.Lesson.destroy({
          where: { module_id: module.id },
          transaction: t
        });

        // Delete the module
        await module.destroy({ transaction: t });
      }

      // 3. Delete student course enrollments for this course
      await db.models.StudentCourse.destroy({
        where: { course_id: id },
        transaction: t
      });

      // 4. Delete course files
      const files = await repo.findFiles(id, 'courses', t);
      for (const file of files) {
        const sizes = ['small', 'large'];
        for (const size of sizes) {
          const filePath = path.join(__dirname, `../../public/images/courses/${size}/${file.name}.${file.ext}`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await repo.destroyFile(file, t);
      }

      // 5. Finally delete the course
      await repo.destroy(course, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
