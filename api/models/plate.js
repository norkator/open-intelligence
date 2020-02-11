module.exports = (sequelize, type) => {
  return sequelize.define('plate', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    licence_plate: type.STRING,
    owner_name: type.STRING,

    enabled: {
      type: type.INTEGER, defaultValue: 1
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
