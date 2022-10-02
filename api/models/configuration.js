module.exports = (sequelize, type) => {
  return sequelize.define('configuration', {
    key: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    value: type.STRING,

    // Normally Sequelize manages these
    // but for python side we need also default value
    createdAt: {
      type: type.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      type: type.DATE,
      defaultValue: sequelize.fn('NOW')
    },
  })
};
