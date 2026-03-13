const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const DB = require('../utils/db');
const catchAsync = require('../utils/catchAsync');

// Get all active bank cards (public endpoint)
router.get('/all', catchAsync(async (req, res, next) => {
    const bankCards = await DB.models.BankCard.findAll({
        where: { is_active: true },
        order: [['created_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: bankCards.length,
        data: bankCards
    });
}));

// Admin: Create new bank card
router.post('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(async (req, res, next) => {
    const { bank_name, card_number } = req.body;

    if (!bank_name || !card_number) {
        return res.status(400).json({
            status: 'fail',
            message: 'Bank name and card number are required'
        });
    }

    const bankCard = await DB.models.BankCard.create({
        bank_name,
        card_number,
        is_active: true
    });

    res.status(201).json({
        status: 'success',
        data: bankCard
    });
}));

// Admin: Update bank card
router.patch('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(async (req, res, next) => {
    const { bank_name, card_number, is_active } = req.body;

    const bankCard = await DB.models.BankCard.findByPk(req.params.id);

    if (!bankCard) {
        return res.status(404).json({
            status: 'fail',
            message: 'Bank card not found'
        });
    }

    await bankCard.update({
        bank_name: bank_name || bankCard.bank_name,
        card_number: card_number || bankCard.card_number,
        is_active: is_active !== undefined ? is_active : bankCard.is_active
    });

    res.status(200).json({
        status: 'success',
        data: bankCard
    });
}));

// Admin: Delete bank card
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), catchAsync(async (req, res, next) => {
    const bankCard = await DB.models.BankCard.findByPk(req.params.id);

    if (!bankCard) {
        return res.status(404).json({
            status: 'fail',
            message: 'Bank card not found'
        });
    }

    await bankCard.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });
}));

module.exports = router;
