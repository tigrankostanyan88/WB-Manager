const fs = require('fs');
const path = require('path');
const fileService = require('../services/file');

const getFiles = async (req, res, next) => {
  try {
    const { table_name, row_id, name_used } = req.query;
    const files = await fileService.getAllFiles({ table_name, row_id, name_used });
    res.status(200).json({
      status: 'success',
      results: files.length,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

const getFileById = async (req, res, next) => {
  try {
    const file = await fileService.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({
        status: 'fail',
        message: 'File not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: file
    });
  } catch (error) {
    next(error);
  }
};

const updateFile = async (req, res, next) => {
  try {
    const { title, sort } = req.body;
    const existingFile = await fileService.getFileById(req.params.id);
    if (!existingFile) {
      return res.status(404).json({
        status: 'fail',
        message: 'File not found'
      });
    }
    const file = await fileService.updateFile(req.params.id, {
      title: title !== undefined ? title : existingFile.title,
      sort: sort !== undefined ? sort : existingFile.sort
    });
    res.status(200).json({
      status: 'success',
      data: file
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const existingFile = await fileService.getFileById(req.params.id);
    if (!existingFile) {
      return res.status(404).json({
        status: 'fail',
        message: 'File not found'
      });
    }
    await fileService.deleteFile(existingFile);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFiles,
  getFileById,
  updateFile,
  deleteFile
};
