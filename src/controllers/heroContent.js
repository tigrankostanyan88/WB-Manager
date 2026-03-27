const HeroContentService = require('../services/heroContent');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

class HeroContentController {
    constructor() {
        this.service = new HeroContentService();
    }

    get = catchAsync(async (req, res) => {
        const content = await this.service.get();
        
        if (!content) {
            return res.status(200).json({
                status: 'success',
                data: null,
                message: 'Հերո բովանդակությունը չի գտնվել'
            });
        }

        // Format response with video URL
        const result = this._formatResponse(content);
        res.status(200).json({
            status: 'success',
            data: result
        });
    });

    upsert = catchAsync(async (req, res) => {
        const { title, name, text } = req.body;
        const videoFile = req.files?.hero_video?.[0]; 
        const data = {
            title,
            name,
            text,
            videoFile
        };

        const content = await this.service.upsert(data);
        const result = this._formatResponse(content);
        
        const isNew = !content.created_at || content.created_at === content.updated_at;
        const message = isNew 
            ? 'Հերո բովանդակությունը ստեղծված է' 
            : 'Հերո բովանդակությունը թարմացված է';

        res.status(200).json({
            status: 'success',
            data: result,
            message
        });
    });


    delete = catchAsync(async (req, res) => {
        const deleted = await this.service.delete();
        
        if (!deleted) {
            throw new AppError('Հերո բովանդակությունը չի գտնվել', 404);
        }

        res.status(200).json({
            status: 'success',
            data: null,
            message: 'Հերո բովանդակությունը ջնջված է'
        });
    });

   
    _formatResponse(content) {
        const data = content.toJSON ? content.toJSON() : content;
        
        if (data.videoFile) {
            data.video_url = `/files/${data.videoFile.name}.${data.videoFile.ext}`;
        }

        return data;
    }
}

module.exports = new HeroContentController();
