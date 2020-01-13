module.exports = (sequelize, type) => {
  return sequelize.define('data', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    label: type.STRING,
    file_path: type.STRING,
    file_name: type.STRING,
    file_create_date: type.DATE,

    // Fields for lower level detection processes (alpr, person etc)
    detection_completed: {
      type: type.INTEGER, defaultValue: 0
    },
    detection_result: type.STRING, // License plate, person etc.

    // For voice output
    voice_completed: {
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
