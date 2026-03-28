module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define('Settings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_card: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        map_lat: {
            type: DataTypes.STRING,
            allowNull: true
        },
        map_lng: {
            type: DataTypes.STRING,
            allowNull: true
        },
        facebook: {
            type: DataTypes.STRING,
            allowNull: true
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: true
        },
        telegram: {
            type: DataTypes.STRING,
            allowNull: true
        },
        whatsapp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        workingHours: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        siteName: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Settings;
};
