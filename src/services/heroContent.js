const AppError = require('../utils/appError');
const Files = require('../controllers/File');
const repo = require('../repositories/heroContent');

module.exports = {
  get: async () => {
    await repo.sync();
    const content = await repo.findOne({ includeFiles: true });
    return content;
  },

  upsert: async (body, files) => {
    await repo.sync();
    
    const { title, name, text, thumbnail_time } = body;
    
    let content = await repo.findOne({ includeFiles: true });
    let wasCreated = false;

    if (!content) {
      content = await repo.create({ title, name, text, thumbnail_time });
      wasCreated = true;
    } else {
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (name !== undefined) updateData.name = name;
      if (text !== undefined) updateData.text = text;
      if (thumbnail_time !== undefined) updateData.thumbnail_time = thumbnail_time;
      
      await repo.update(content, updateData);
    }

    const filePayload = files?.hero_video;
    
    if (filePayload) {
      const existingFile = await repo.findFile(content.id, 'hero_content');

      const modelForFiles = {
        constructor: { name: 'hero_content' },
        id: content.id,
        files: existingFile ? [existingFile] : []
      };

      const video = await new Files(modelForFiles, filePayload).replace('hero_video');

      if (video.status !== 'success') {
        throw new AppError(Object.values(video.message || {}).join(' ') || 'Վիդեոյի պահպանման սխալ', 400);
      }

      await repo.createFile(video.table);
    }

    content = await repo.findOne({ includeFiles: true });
    
    return {
      content,
      wasCreated
    };
  },

  delete: async () => {
    await repo.sync();
    
    const content = await repo.findOne({ includeFiles: true });
    
    if (!content) {
      return false;
    }

    const existingFile = await repo.findFile(content.id, 'hero_content');
    
    if (existingFile) {
      await repo.destroyFile(existingFile);
    }

    await repo.destroy(content);
    return true;
  }
};
