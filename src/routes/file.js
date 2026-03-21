const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const catchAsync = require('../utils/catchAsync');

// Get all files (with optional filters: table_name, row_id, name_used)
router.get('/', catchAsync(ctrls.file.getFiles));

// Get file by ID
router.get('/:id', catchAsync(ctrls.file.getFileById));

// Update file (title, sort order)
router.patch('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(ctrls.file.updateFile));

// Delete file
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(ctrls.file.deleteFile));

module.exports = router;