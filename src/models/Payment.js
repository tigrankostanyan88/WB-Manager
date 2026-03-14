module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'success', 'failed'),
            defaultValue: 'pending'
        },
        payment_method: {
            type: DataTypes.ENUM('idram', 'ameria', 'acba'),
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        callback_raw: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        paid_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'payments',
        indexes: [
            { fields: ['user_id'] },
            { fields: ['course_id'] },
            { fields: ['status'] },
            { fields: ['order_id'], unique: true }
        ]
    });

    return Payment;
};