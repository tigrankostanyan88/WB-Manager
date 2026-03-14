module.exports = (sequelize, DataTypes) => {
  const Instructor = sequelize.define('Instructor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stats_json: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'instructors',
    underscored: true,
    timestamps: true
  });

  return Instructor;
}
