module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thumbnail_time: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        discount: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0
        },
        whatToLearn: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            get() {
                const raw = this.getDataValue('whatToLearn');
                if (!raw) return [];
                try {
                    const parsed = JSON.parse(raw);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            },
            set(value) {
                const arr = Array.isArray(value) ? value : [];
                const cleaned = arr
                    .map(v => String(v || '').trim())
                    .filter(Boolean);
                this.setDataValue('whatToLearn', JSON.stringify(cleaned));
            }
        },
        prerequisites: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            get() {
                const raw = this.getDataValue('prerequisites');
                if (!raw) return [];
                try {
                    const parsed = JSON.parse(raw);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            },
            set(value) {
                const arr = Array.isArray(value) ? value : [];
                const cleaned = arr
                    .map(v => String(v || '').trim())
                    .filter(Boolean);
                this.setDataValue('prerequisites', JSON.stringify(cleaned));
            }
        }
    }, {
        tableName: 'courses'
    });

    return Course;
};
