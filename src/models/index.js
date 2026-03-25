const DB = require('../utils/db');

const connect = DB.con;
const Sequelize = DB.Sequelize;

DB.models = {
  User: require('./user')(connect, Sequelize.DataTypes),
  Settings: require('./Settings')(connect, Sequelize.DataTypes),
  File: require('./File')(connect, Sequelize.DataTypes),
  Course: require('./Course')(connect, Sequelize.DataTypes),
  Lesson: require('./Lesson')(connect, Sequelize.DataTypes),
  Module: require('./Module')(connect, Sequelize.DataTypes),
  Review: require('./Review')(connect, Sequelize.DataTypes),
  Faq: require('./faq')(connect, Sequelize.DataTypes),
  Instructor: require('./Instructor')(connect, Sequelize.DataTypes),
  StudentCourse: require('./StudentCourse')(connect, Sequelize.DataTypes),
  BankCard: require('./BankCard')(connect, Sequelize.DataTypes),
  Payment: require('./Payment')(connect, Sequelize.DataTypes),
  CourseRegistration: require('./CourseRegistration')(connect, Sequelize.DataTypes),
  ContactMessage: require('./ContactMessage')(connect, Sequelize.DataTypes),
};

DB.models.User.hasMany(DB.models.File,   { foreignKey: 'row_id', as: 'files', constraints: false, scope: { table_name: 'users' } });
DB.models.File.belongsTo(DB.models.User, { foreignKey: 'row_id', as: 'user',  constraints: false });

DB.models.Settings.hasMany(DB.models.File,   { foreignKey: 'row_id', as: 'files', constraints: false, scope: { table_name: 'settings' } });
DB.models.File.belongsTo(DB.models.Settings, { foreignKey: 'row_id', as: 'settings', constraints: false });

DB.models.Instructor.hasMany(DB.models.File,   { foreignKey: 'row_id', as: 'files', constraints: false, scope: { table_name: 'instructors' } });
DB.models.File.belongsTo(DB.models.Instructor, { foreignKey: 'row_id', as: 'instructor', constraints: false });

DB.models.Module.hasMany(DB.models.Lesson, { as: 'lessons', foreignKey: 'module_id' });
DB.models.Lesson.belongsTo(DB.models.Module, { as: 'module', foreignKey: 'module_id' });

DB.models.Course.hasMany(DB.models.Module, { as: 'modules', foreignKey: 'course_id' });
DB.models.Module.belongsTo(DB.models.Course, { as: 'course', foreignKey: 'course_id' });


DB.models.Module.hasMany(DB.models.File, {
  foreignKey: 'row_id',
  as: 'files',
  constraints: false,
  scope: { table_name: 'modules' }
});
DB.models.File.belongsTo(DB.models.Module, {
  foreignKey: 'row_id',
  as: 'module',
  constraints: false
});

DB.models.Course.hasMany(DB.models.File, {
  foreignKey: 'row_id',
  as: 'files',
  constraints: false,
  scope: { table_name: 'courses' }
});

DB.models.File.belongsTo(DB.models.Course, {
  foreignKey: 'row_id',
  as: 'course',
  constraints: false
});


// StudentCourse relationships
if (DB.models.StudentCourse) {
  DB.models.User.hasMany(DB.models.StudentCourse, { as: 'studentCourses', foreignKey: 'user_id' });
  DB.models.StudentCourse.belongsTo(DB.models.User, { as: 'student', foreignKey: 'user_id' });
  
  DB.models.Course.hasMany(DB.models.StudentCourse, { as: 'studentCourses', foreignKey: 'course_id' });
  DB.models.StudentCourse.belongsTo(DB.models.Course, { as: 'course', foreignKey: 'course_id' });
}

// Payment relationships
if (DB.models.Payment) {
  DB.models.User.hasMany(DB.models.Payment, { as: 'payments', foreignKey: 'user_id' });
  DB.models.Payment.belongsTo(DB.models.User, { as: 'user', foreignKey: 'user_id' });
  
  DB.models.Course.hasMany(DB.models.Payment, { as: 'payments', foreignKey: 'course_id' });
  DB.models.Payment.belongsTo(DB.models.Course, { as: 'course', foreignKey: 'course_id' });
}

// CourseRegistration relationships
if (DB.models.CourseRegistration) {
  DB.models.Course.hasMany(DB.models.CourseRegistration, { as: 'courseRegistrations', foreignKey: 'course_id' });
  DB.models.CourseRegistration.belongsTo(DB.models.Course, { as: 'course', foreignKey: 'course_id' });
}

module.exports = DB;

