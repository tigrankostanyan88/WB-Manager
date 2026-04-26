const AppError = require('../utils/appError');
const Files = require('../controllers/File');
const repo = require('../repositories/heroContent');
const DB = require('../models');
const cache = require('../utils/cache');

const CACHE_KEY = 'hero:content';
const CACHE_TTL = 600; // 10 minutes

module.exports = {
  get: async () => {
    // Try cache first
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    const content = await repo.findOne({ includeFiles: true });
    
    // Construct video_url from file data if available
    if (content && content.file) {
      content.video_url = `/files/hero_content/${content.file.name}`;
    }
    
    // Cache the result
    cache.set(CACHE_KEY, content?.toJSON ? content.toJSON() : content, CACHE_TTL);
    
    return content;
  },

  upsert: async (body, files) => {
    const { title, name, text, thumbnail_time } = body;
    
    const transaction = await DB.con.transaction();
    
    try {
      let content = await repo.findOne({ includeFiles: false });
      let wasCreated = false;

      if (!content) {
        content = await repo.create({ title, name, text, thumbnail_time }, transaction);
        wasCreated = true;
      } else {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (name !== undefined) updateData.name = name;
        if (text !== undefined) updateData.text = text;
        if (thumbnail_time !== undefined) updateData.thumbnail_time = thumbnail_time;
        
        await repo.update(content, updateData, transaction);
      }

      const filePayload = files?.hero_video;
      
      if (filePayload) {
        const existingFile = await repo.findFile(content.id, 'hero_content', transaction);

        const modelForFiles = {
          constructor: { name: 'hero_content' },
          id: content.id,
          files: existingFile ? [existingFile] : []
        };

        const video = await new Files(modelForFiles, filePayload).replace('hero_video');

        if (video.status !== 'success') {
          throw new AppError(Object.values(video.message || {}).join(' ') || 'Վիդեոյի պահպանման սխալ', 400);
        }

        await repo.createFile(video.table, transaction);
      }

      await transaction.commit();
      
      // Invalidate cache
      cache.del(CACHE_KEY);
      
      // Return final data (single query after transaction)
      const finalContent = await repo.findOne({ includeFiles: true });
      
      return {
        content: finalContent,
        wasCreated
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  delete: async () => {
    const transaction = await DB.con.transaction();
    
    try {
      const content = await repo.findOne({ includeFiles: false });
      
      if (!content) {
        await transaction.commit();
        return false;
      }

      const existingFile = await repo.findFile(content.id, 'hero_content', transaction);
      
      if (existingFile) {
        await repo.destroyFile(existingFile, transaction);
      }

      await repo.destroy(content, transaction);
      await transaction.commit();
      
      // Invalidate cache
      cache.del(CACHE_KEY);
      
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
