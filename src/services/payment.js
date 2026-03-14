const paymentRepository = require('../repositories/payment');
const AppError = require('../utils/appError');
// Generate unique order ID
const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
};

class PaymentService {
    async getAllPayments() {
        return await paymentRepository.findAll();
    }

    async getPaymentById(id) {
        return await paymentRepository.findById(id);
    }

    async createPayment(data) {
        
        const { user_id, course_id, amount, payment_method } = data;

        // Validate required fields
        if (!user_id || !course_id || !amount || !payment_method) {
            throw new AppError('Պարտադիր դաշտերը բացակայում են՝ user_id, course_id, amount, payment_method', 403);
        }

        // Check if user exists
        const user = await paymentRepository.findUserById(user_id);
        if (!user) {
            throw new AppError('Օգտատերը չի գտնվել', 404);
        }

        // Check if course exists
        const course = await paymentRepository.findCourseById(course_id);
        if (!course) {
            throw new AppError('Դասընթացը չի գտնվել', 404);
        }

        // Generate unique order ID
        const order_id = generateOrderId();

        // Create payment record
        const payment = await paymentRepository.create({
            user_id,
            course_id,
            order_id,
            amount,
            payment_method,
            status: 'pending'
        });

        return payment;
    }

    async verifyPayment(orderId, data) {
        const { status, transaction_id } = data;

        const payment = await paymentRepository.findByOrderId(orderId);
        if (!payment) {
            throw new AppError('Payment not found');
        }

        // Update payment status
        const updateData = {
            status: status || 'success',
            paid_at: new Date()
        };

        if (transaction_id) {
            updateData.transaction_id = transaction_id;
        }

        await paymentRepository.updateByOrderId(orderId, updateData);

        // Grant course access to user
        if (status === 'success' || !status) {
            const user = await paymentRepository.findUserById(payment.user_id);
            if (user) {
                // Get current groups/courses
                let currentGroups = [];
                try {
                    currentGroups = JSON.parse(user.groups || '[]');
                } catch (e) {
                    currentGroups = [];
                }

                // Add course to user's groups if not already there
                const courseId = payment.course_id.toString();
                if (!currentGroups.includes(courseId)) {
                    currentGroups.push(courseId);
                    await paymentRepository.updateUserGroups(payment.user_id, currentGroups);
                }
            }
        }

        // Return updated payment
        return await paymentRepository.findById(payment.id);
    }

    async deletePayment(id) {
        const payment = await paymentRepository.findById(id);
        if (!payment) {
            throw new AppError('Payment not found');
        }

        const deleted = await paymentRepository.delete(id);
        return deleted;
    }

    async updatePaymentStatus(id, status) {
        const payment = await paymentRepository.findById(id);
        if (!payment) {
            throw new AppError('Payment not found');
        }

        const updateData = {
            status: status
        };

        // If marking as success, also set paid_at and grant access
        if (status === 'success') {
            updateData.paid_at = new Date();
            
            // Grant course access to user
            const user = await paymentRepository.findUserById(payment.user_id);
            if (user) {
                let currentGroups = [];
                try {
                    currentGroups = JSON.parse(user.groups || '[]');
                } catch (e) {
                    currentGroups = [];
                }

                const courseId = payment.course_id.toString();
                if (!currentGroups.includes(courseId)) {
                    currentGroups.push(courseId);
                    await paymentRepository.updateUserGroups(payment.user_id, currentGroups);
                }
            }
        }

        await paymentRepository.update(id, updateData);
        return await paymentRepository.findById(id);
    }
}

module.exports = new PaymentService();
