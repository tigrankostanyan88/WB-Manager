const DB = require('../models');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const { HeroContent, File } = DB.models;

class HeroContentRepository {
    constructor() {
        this.model = HeroContent;
        this.fileModel = File;
    }

 
    async get() {
        const content = await this.model.findOne({
            include: [{
                model: this.fileModel,
                as: 'videoFile'
            }]
        });
        return content;
    }

    async upsert(data) {
        const { title, name, text, videoFile } = data;
        
        let content = await this.model.findOne();
        
        if (content) {
            // Update existing content
            await content.update({
                title: title !== undefined ? title : content.title,
                name: name !== undefined ? name : content.name,
                text: text !== undefined ? text : content.text
            });
        } else {
            // Create new content
            content = await this.model.create({
                title,
                name,
                text
            });
        }

        // Handle video file upload/replacement
        if (videoFile) {
            await this._handleVideoFileReplacement(content, videoFile);
        }

        // Reload with video file
        return await this.model.findByPk(content.id, {
            include: [{
                model: this.fileModel,
                as: 'videoFile'
            }]
        });
    }

    async _handleVideoFileReplacement(content, videoFile) {
        const oldFileId = content.video_file_id;
        
        // 1. Remove old file from filesystem and database if exists
        if (oldFileId) {
            const oldFile = await this.fileModel.findByPk(oldFileId);
            if (oldFile) {
                // Delete from filesystem
                const filePath = path.join(__dirname, '../../public/files', `${oldFile.name}.${oldFile.ext}`);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                // Delete from database
                await oldFile.destroy();
            }
        }

        // 2. Create and save new file record
        const newFile = await this.fileModel.create({
            table_name: 'hero_content',
            row_id: content.id,
            col_name: 'video',
            title: videoFile.originalname || videoFile.name,
            name_original: videoFile.originalname || videoFile.name,
            name_used: 'video',
            name: videoFile.filename || uuidv4(),
            ext: path.extname(videoFile.originalname || videoFile.name).replace('.', '') || 'mp4',
            type: videoFile.mimetype || 'video/mp4',
            sizes: {}, // No sizes for video files
            sort: 0
        });

        // 3. Update hero content with new file reference
        await content.update({ video_file_id: newFile.id });
    }

    async delete() {
        const content = await this.model.findOne();
        
        if (!content) {
            return false;
        }

        // Delete video file if exists
        if (content.video_file_id) {
            const file = await this.fileModel.findByPk(content.video_file_id);
            if (file) {
                const filePath = path.join(__dirname, '../../public/files', `${file.name}.${file.ext}`);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                await file.destroy();
            }
        }

        await content.destroy();
        return true;
    }
}

module.exports = HeroContentRepository;
