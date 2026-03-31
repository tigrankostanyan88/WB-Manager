const fileRepo = require('../repositories/file');

const getAllFiles = async (filters = {}) => {
  const files = await fileRepo.findAll(filters);
  return files;
};

const getFileById = async (id) => {
  const file = await fileRepo.findById(id);
  return file;
};

const updateFile = async (id, body) => {
  const file = await fileRepo.update(id, body);
  return file;
};

const deleteFile = async (file) => {
  await fileRepo.destroy(file);
  return true;
};

module.exports = {
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile
};
