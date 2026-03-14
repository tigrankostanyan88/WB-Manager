const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');

// Get all payments
router.get('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.payment.getPayments);

// Get payment by ID
router.get('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.payment.getPaymentById);

// Create new payment
router.post('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.payment.createPayment);

// Verify payment
router.post('/:orderId/verify', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.payment.verifyPayment);

// Delete payment
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.payment.deletePayment);

// Update payment status (admin toggle)
router.patch('/:id/status', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.payment.updatePaymentStatus);

module.exports = router;
