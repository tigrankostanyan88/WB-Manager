const catchAsync = require('../utils/catchAsync');
const DB = require('../models');
const service = require('../services/modules');

module.exports = {
  // CREATE
  addModule: catchAsync(async (req, res, next) => {
    const newModule = await service.addModule(req.body, DB);

    res.status(201).json({
      status: 'success',
      data: newModule
    });
  }),

  // GET ALL (by Course ID)
  getModules: catchAsync(async (req, res, next) => {
    const result = await service.getModules(req.query);

    res.status(200).json({
      status: 'success',
      count: result.count,
      data: result.modules
    });
  }),

  // GET ONE
  getModule: catchAsync(async (req, res, next) => {
    const module = await service.getModule(req.params.id);

    res.status(200).json({
      status: 'success',
      data: module
    });
  }),

  // UPDATE
  updateModule: catchAsync(async (req, res, next) => {
    const module = await service.updateModule(req.params.id, req.body, DB);

    res.status(200).json({
      status: 'success',
      data: module
    });
  }),

  // DELETE
  deleteModule: catchAsync(async (req, res, next) => {
    await service.deleteModule(req.params.id, DB);

    res.status(200).json({
      status: 'success',
      message: 'Module deleted successfully'
    });
  }),

  // UPLOAD VIDEO
  uploadVideo: catchAsync(async (req, res, next) => {
    const updatedModule = await service.uploadVideo(req.params.id, req.files, DB);

    res.status(200).json({
      status: 'success',
      message: 'Video uploaded successfully',
      data: updatedModule
    });
  }),

  // REORDER VIDEOS
  reorderVideos: catchAsync(async (req, res, next) => {
    const updatedModule = await service.reorderVideos(req.params.id, req.body.videoIds);

    res.status(200).json({
      status: 'success',
      message: 'Video order updated successfully',
      data: updatedModule
    });
  })
};
