module.exports = (sequelize, type) => {
  return sequelize.define('instance', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    process_name: type.STRING,

    hardware_info: type.STRING,

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
