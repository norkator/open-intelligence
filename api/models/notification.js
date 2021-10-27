module.exports = (sequelize, type) => {
  return sequelize.define('notification', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    text: type.STRING,
    sent: {
      type: type.BOOLEAN, defaultValue: false
    },
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
