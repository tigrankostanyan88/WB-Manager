const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Անունը չի կարող դատարկ լինել' }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Այս էլ․ հասցեն արդեն գրանցված է' },
            validate: {
                isEmail: { msg: 'Սխալ էլ․ հասցե' }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Այս հեռախոսահամարն արդեն գրանցված է' },
            validate: {
                notEmpty: { msg: 'Հեռախոսահամարը պարտադիր է' }
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, 
            validate: {
                min: 6
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        course_ids: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        login_token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        passwordChangedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'users',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                    user.passwordChangedAt = Date.now() - 1000;
                }
            }
        }
    });

    User.prototype.correctPassword = async function(candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    };

    User.prototype.createPasswordResetToken = function() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        return resetToken;
    };

    User.prototype.changedPasswordAfter = function(JWTTimestamp) {
        if (this.passwordChangedAt) {
            const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
            return JWTTimestamp < changedTimestamp;
        }
        // False means NOT changed
        return false;
    };
    return User;
};
