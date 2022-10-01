module.exports = (sequelize, type) => {
  return sequelize.define('configuration', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    key: type.STRING,
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
