module.exports = (sequelize, type) => {
  return sequelize.define('data', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    label: type.STRING,
    file_path: type.STRING,
    file_name: type.STRING,
    file_create_date: type.DATE,

    // Normally sequelize manages these
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
