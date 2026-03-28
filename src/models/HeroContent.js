module.exports = (con, DataTypes) => {
    const HeroContent = con.define('hero_content', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        video_file_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'files',
                key: 'id'
            }
        },
        thumbnail_time: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: con.literal("CURRENT_TIMESTAMP"),
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: con.literal("CURRENT_TIMESTAMP"),
            allowNull: false
        }
    });

    HeroContent.associate = (models) => {
        HeroContent.belongsTo(models.File, {
            foreignKey: 'video_file_id',
            as: 'videoFile'
        });
    };

    return HeroContent;
};
