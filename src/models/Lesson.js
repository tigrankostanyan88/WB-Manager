module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lesson', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        moduleId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'lessons'
    });

    return Lesson;
};
