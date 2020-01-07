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
    /* Sequelize makes createdAt and updatedAt field automatically */
  })
};
