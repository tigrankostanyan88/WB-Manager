module.exports = (sequelize, DataTypes) => {
    const StudentCourse = sequelize.define('StudentCourse', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'expired'),
            defaultValue: 'active'
        },
        purchased_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        price_paid: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true
        },
        payment_method: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'student_courses',
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'course_id']
            }
        ]
    });

    return StudentCourse;
};
