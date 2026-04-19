const DB = require('../models');
const { CourseRegistration, Course } = DB.models;

module.exports = {
    findAll: async () => {
        return CourseRegistration.findAll({
            include: [{ model: Course, as: 'course', attributes: ['id', 'title'] }]
        });
    },

    findById: async (id) => {
        return CourseRegistration.findByPk(id, {
            include: [{ model: Course, as: 'course', attributes: ['id', 'title'] }]
        });
    },

    create: async (data) => {
        return CourseRegistration.create(data);
    },

    update: async (courseRegistration, data) => {
        return courseRegistration.update(data);
    },

    destroy: async (courseRegistration) => {
        return courseRegistration.destroy();
    },

    markAsViewed: async (id) => {
        return CourseRegistration.update(
            { viewed: true },
            { where: { id } }
        );
    }
};
