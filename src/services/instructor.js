const AppError = require('../utils/Error');
const Files = require('../controllers/File');
const repo = require('../repositories/instructor');

module.exports = {
  // Get all instructors
  getInstructor: async (startTime) => {
    await repo.sync();
    const instructors = await repo.findAll({ includeFiles: true });

    return {
      instructors,
      time: `${Date.now() - startTime} ms`
    };
  },

  // Update instructor (create if not exists)
  updateInstructor: async (body, files) => {
    await repo.sync();
    
    let instructor = await repo.findOne({ includeFiles: true });
    let wasCreated = false;

    if (!instructor) {
      // Create new instructor if none exists
      instructor = await repo.create(body);
      wasCreated = true;
    } else {
      // Update existing instructor
      await repo.update(instructor, body);
    }

    // Refetch to get fresh data with files
    instructor = await repo.findOne({ includeFiles: true });

    const filePayload = files?.instructor_img || files?.image || files?.avatar;

    if (filePayload && filePayload.name && filePayload.mimetype) {
      const modelForFiles = {
        id: instructor.id,
        files: Array.isArray(instructor.files) ? instructor.files : [],
        constructor: { name: 'instructors' }
      };

      

      const image = await new Files(modelForFiles, filePayload).replace('instructor_img');

      if (image.status !== 'success') {
        const msg = typeof image.message === 'object' ? Object.values(image.message).join(' ') : image.message;
        throw new AppError(msg, 400);
      }

      await instructor.createFile(image.table);
      
      // Construct avatar_url from the saved file path
      // File is saved at: ./public/images/instructors/large/{name}.{ext}
      const avatarUrl = `/images/instructors/large/${image.table.name}.${image.table.ext}`;
      await repo.update(instructor, { avatar_url: avatarUrl });
    }
    return repo.findOne({ includeFiles: true });
  },

  // Delete instructor
  deleteInstructor: async (id) => {
    await repo.sync();
    const instructor = await repo.findById(id);
    if (!instructor) throw new AppError('Instructor not found', 404);

    await repo.destroy(instructor);
  }
};
