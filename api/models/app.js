module.exports = (sequelize, type) => {
  return sequelize.define('app', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    action_name: type.STRING,                   // Action name, determines action to be run
    action_completed: {                         // Is action processed
      type: type.INTEGER, defaultValue: 0
    },

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
