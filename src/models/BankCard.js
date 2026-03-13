module.exports = (sequelize, DataTypes) => {
    const BankCard = sequelize.define('BankCard', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        card_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'bank_cards',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return BankCard;
};
