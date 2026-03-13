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
  if (result.length === 0) throw new AppError('"whatToLearn" չի կարող դատարկ լինել', 400);
  return result;
};

module.exports = {
  // Create new course
  addCourse: async (body, files, db) => {
    const title = requireString(body.title, 'Վերնագիր');
    const category = requireString(body.category, 'Կատեգորիա');
    const description = requireString(body.description, 'Նկարագրություն');
    const price = parseDecimal(body.price, 'Գին');
    const discount = parseDecimal(body.discount, 'Զեղչ');
    const whatToLearn = normalizeWhatToLearn(body.whatToLearn);
    const language = body.language !== undefined ? String(body.language ?? '').trim() || null : null;

    const t = await db.con.transaction();
    try {
      const course = await repo.create(
        { title, category, description, price, discount, whatToLearn, language },
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

  // Delete course and associated files
  deleteCourse: async (id, db) => {
    const course = await repo.findById(id);
    if (!course) throw new AppError('Course not found', 404);

    const t = await db.con.transaction();
    try {
      const files = await repo.findFiles(id, 'courses', t);

      for (const file of files) {
        // Delete files from disk
        const sizes = ['small', 'large'];
        for (const size of sizes) {
          const filePath = path.join(__dirname, `../../public/images/courses/${size}/${file.name}.${file.ext}`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        // Delete from DB
        await repo.destroyFile(file, t);
      }

      await repo.destroy(course, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
