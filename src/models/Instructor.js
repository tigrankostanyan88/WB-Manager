module.exports = (sequelize, DataTypes) => {
  const Instructor = sequelize.define('Instructor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stats_json: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'instructors',
    underscored: true,
    timestamps: true
  });

  return Instructor;
}
