module.exports = (sequelize, type) => {
  return sequelize.define('recording', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    camera_name: type.STRING, // Camera name, unique

    file_name: type.STRING,   // Recording file name

    start_time: type.DATE,    // Recording start time

    end_time: type.DATE,      // Recording end time

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
