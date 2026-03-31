const fs = require('fs');
const path = require('path');
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
  // Delete physical file from disk based on table_name
  let filePath;
  if (file.table_name === 'modules') {
    filePath = path.join(__dirname, `../../public/files/modules/${file.name}${file.ext}`);
  } else if (file.table_name === 'courses') {
    filePath = path.join(__dirname, `../../public/images/courses/large/${file.name}${file.ext}`);
  } else {
    // Default path for other file types
    filePath = path.join(__dirname, `../../public/files/${file.table_name}/${file.name}${file.ext}`);
  }
  
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  // Also try to delete small/large versions if they exist (for images)
  if (file.table_name === 'courses' || file.table_name === 'instructors' || file.table_name === 'users') {
    const smallPath = path.join(__dirname, `../../public/images/${file.table_name}/small/${file.name}${file.ext}`);
    const largePath = path.join(__dirname, `../../public/images/${file.table_name}/large/${file.name}${file.ext}`);
    if (fs.existsSync(smallPath)) fs.unlinkSync(smallPath);
    if (fs.existsSync(largePath)) fs.unlinkSync(largePath);
  }
  
  await fileRepo.destroy(file);
  return true;
};

module.exports = {
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile
};
