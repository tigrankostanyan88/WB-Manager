const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const catchAsync = require('../utils/catchAsync');

// Get all active bank cards (public endpoint)
router.get('/all', catchAsync(ctrls.bankCard.getBankCards));

// Admin: Create new bank card
router.post('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(ctrls.bankCard.createBankCard));

// Admin: Update bank card
router.put('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(ctrls.bankCard.updateBankCard));

// Admin: Delete bank card
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(ctrls.bankCard.deleteBankCard));

module.exports = router;
