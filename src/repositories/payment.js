const DB = require('../models');
const { Payment, User, Course } = DB.models;

class PaymentRepository {
    async findAll(options = {}) {
        return await Payment.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Course, as: 'course', attributes: ['id', 'title', 'price'] }
            ],
            order: [['createdAt', 'DESC']],
            ...options
        });
    }

    async findById(id, options = {}) {
        return await Payment.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Course, as: 'course', attributes: ['id', 'title', 'price'] }
            ],
            ...options
        });
    }

    async findByOrderId(orderId, options = {}) {
        return await Payment.findOne({
            where: { order_id: orderId },
            ...options
        });
    }

    async create(data) {
        return await Payment.create(data);
    }

    async update(id, data) {
        const payment = await Payment.findByPk(id);
        if (!payment) return null;
        return await payment.update(data);
    }

    async updateByOrderId(orderId, data) {
        const payment = await Payment.findOne({ where: { order_id: orderId } });
        if (!payment) return null;
        return await payment.update(data);
    }

    async delete(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) return false;
        await payment.destroy();
        return true;
    }

    async findUserById(userId) {
        return await User.findByPk(userId);
    }

    async findCourseById(courseId) {
        return await Course.findByPk(courseId);
    }

    async updateUserGroups(userId, groups) {
        const user = await User.findByPk(userId);
        if (!user) return null;
        return await user.update({ groups: JSON.stringify(groups) });
    }
}

module.exports = new PaymentRepository();
