module.exports = (sequelize, type) => {
  return sequelize.define('offsite', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    label: type.STRING,                       // What is in the detection cropped image
    file_name: type.STRING,                   // Original file name
    file_create_date: type.DATE,              // Original file create date time
    file_name_cropped: type.STRING,           // Cropped small label image file name

    // Fields for lower level detection processes (alpr, person etc)
    detection_completed: {
      type: type.INTEGER, defaultValue: 0
    },
    detection_result: type.STRING, // License plate, person etc.

    labeled_for_training: {                     // Is image labeled for training
      type: type.INTEGER, defaultValue: 0
    },
    labeling_image_x: {
      type: type.INTEGER, defaultValue: 0
    },
    labeling_image_y: {
      type: type.INTEGER, defaultValue: 0
    },
    labeling_image_x2: {
      type: type.INTEGER, defaultValue: 0
    },
    labeling_image_y2: {
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
