const fs = require('fs');
const path = require('path');
const AppError = require('../utils/Error');
const Files = require('../controllers/File');
const { getVideoDurationInSeconds } = require('get-video-duration');
const repo = require('../repositories/modules');

// Helper to format seconds to HH:MM:SS
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Validation helper
const requireString = (value, label) => {
  const v = String(value ?? '').trim();
  if (!v) throw new AppError(`${label}-ը պարտադիր է`, 400);
  return v;
};

module.exports = {
  // Create new module
  addModule: async (body, db) => {
    await repo.sync();

    const title = requireString(body.title, 'Վերնագիր');
    const duration = body.duration ? String(body.duration).trim() : null;
    const courseId = body.courseId;

    if (!courseId) throw new AppError('Course ID-ն պարտադիր է', 400);

    const course = await repo.findCourseById(courseId);
    if (!course) throw new AppError('Course not found', 404);

    const t = await db.con.transaction();

    try {
      const maxOrderModule = await repo.findMaxOrder(courseId, t);
      const nextOrder = maxOrderModule ? (maxOrderModule.order + 1) : 0;

      const newModule = await repo.create({
        title,
        duration,
        course_id: courseId,
        order: nextOrder
      }, t);

      await t.commit();
      return newModule;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Get all modules
  getModules: async (query) => {
    const { courseId } = query;
    const modules = await repo.findAll({ courseId });
    return { modules, count: modules.length };
  },

  // Get single module by ID
  getModule: async (id) => {
    const module = await repo.findByIdWithFiles(id);
    if (!module) throw new AppError('Module not found', 404);
    return module;
  },

  // Update module
  updateModule: async (id, body, db) => {
    const { title, duration, order } = body;

    const module = await repo.findById(id);
    if (!module) throw new AppError('Module not found', 404);

    const t = await db.con.transaction();

    try {
      const update = {};
      if (title !== undefined) update.title = requireString(title, 'Վերնագիր');
      if (duration !== undefined) update.duration = String(duration).trim() || null;
      if (order !== undefined) update.order = Number(order);

      await repo.update(module, update, t);
      await t.commit();

      return module;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Delete module and associated files
  deleteModule: async (id, db) => {
    const module = await repo.findById(id);
    if (!module) throw new AppError('Module not found', 404);

    const t = await db.con.transaction();

    try {
      const files = await repo.findFiles(id, 'modules', t);

      for (const file of files) {
        // Delete from disk
        const filePath = path.join(__dirname, `../../public/files/modules/${file.name}${file.ext}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        await repo.destroyFile(file, t);
      }

      await repo.destroy(module, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Upload video to module
  uploadVideo: async (id, files, db) => {
    const module = await repo.findById(id);
    if (!module) throw new AppError('Module not found', 404);

    const file = files && (files.module_video || files.module_video);
    if (!file) throw new AppError('Տեսանյութի ֆայլը պարտադիր է', 400);

    const t = await db.con.transaction();

    try {
      const existingFiles = await repo.findFiles(id, 'modules', t);

      const modelMock = {
        constructor: { name: 'modules' },
        id: module.id,
        files: existingFiles
      };

      const fileHandler = new Files(modelMock, file);
      const result = await fileHandler.add('module_video');

      if (result.status === 'success') {
        // Extract video duration
        let durationSeconds = 0;
        try {
          const tempPath = result.table?.path || file.tempFilePath || file.filepath;
          if (tempPath && fs.existsSync(tempPath)) {
            durationSeconds = await getVideoDurationInSeconds(tempPath);
          }
        } catch (e) {
          console.log('Could not extract video duration:', e.message);
        }

        result.table.duration = Math.round(durationSeconds) || 0;

        // Set sort to next available value
        const maxSort = await repo.getMaxFileSort(id, 'modules', t);
        result.table.sort = (maxSort || 0) + 1;

        await repo.createFile(result.table, t);

        // Calculate and update module total duration
        const allFiles = await repo.findFiles(id, 'modules', t);
        const totalDurationSeconds = allFiles.reduce((sum, f) => sum + (f.duration || 0), 0) + result.table.duration;
        await repo.update(module, { duration: formatDuration(totalDurationSeconds) }, t);
      } else {
        throw new AppError(Object.values(result.message || {}).join(' ') || 'File upload failed', 400);
      }

      await t.commit();

      // Return updated module with files
      return repo.findByIdWithFiles(id);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Reorder videos in module
  reorderVideos: async (id, videoIds) => {
    if (!Array.isArray(videoIds)) {
      throw new AppError('videoIds must be an array', 400);
    }

    const module = await repo.findById(id);
    if (!module) throw new AppError('Module not found', 404);

    // Update sort field for each video file
    for (let i = 0; i < videoIds.length; i++) {
      await repo.updateFileSort(videoIds[i], i + 1, {
        table_name: 'modules',
        row_id: id
      });
    }

    // Return updated module with files
    return repo.findByIdWithFiles(id);
  }
};
