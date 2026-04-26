const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/app.config');

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
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, 
            validate: {
                min: config.PASSWORD.MIN_LENGTH
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
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, config.PASSWORD.BCRYPT_ROUNDS);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, config.PASSWORD.BCRYPT_ROUNDS);
                    user.passwordChangedAt = new Date(Date.now() - 1000);
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
        this.passwordResetExpires = Date.now() + config.PASSWORD_RESET.TOKEN_EXPIRES_MS;
        return resetToken;
    };

    User.prototype.changedPasswordAfter = function(JWTTimestamp) {
        if (this.passwordChangedAt) {
            let changedTimestamp;
            if (this.passwordChangedAt instanceof Date) {
                changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
            } else if (typeof this.passwordChangedAt === 'number') {
                changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);
            } else if (typeof this.passwordChangedAt === 'string') {
                changedTimestamp = parseInt(new Date(this.passwordChangedAt).getTime() / 1000, 10);
            }
            return JWTTimestamp < changedTimestamp;
        }
        // False means NOT changed
        return false;
    };
    return User;
};
