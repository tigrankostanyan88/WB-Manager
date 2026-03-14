const paymentService = require('../services/payment');

// Get all payments with user and course details
exports.getPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json({
            success: true,
            payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Վճարումները չհաջողվեց ստանալ'
        });
    }
};

// Create new payment
exports.createPayment = async (req, res) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json({
            success: true,
            message: 'Վճարումը հաջողությամբ ստեղծվեց',
            payment
        });
    } catch (error) {
        console.error('Վճարման սխալի ստեղծում.', error);
        const statusCode = error.message.includes('not found') ? 404 : 
        error.message.includes('Missing') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Վճարումը չհաջողվեց ստեղծել'
        });
    }
};

// Verify payment (admin manual verification)
exports.verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await paymentService.verifyPayment(orderId, req.body);
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            payment
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to verify payment'
        });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await paymentService.getPaymentById(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch payment'
        });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        await paymentService.deletePayment(id);
        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully'
        });
    } catch (error) {
        console.error('Delete payment error:', error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to delete payment'
        });
    }
};
