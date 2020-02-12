module.exports = (sequelize, type) => {
  return sequelize.define('data', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,                        // Unique name like camera position
    label: type.STRING,                       // What is in the detection cropped image
    file_path: type.STRING,                   // Where original image was loaded originally
    file_name: type.STRING,                   // Original file name
    file_create_date: type.DATE,              // Original file create date time
    file_name_cropped: type.STRING,           // Cropped small label image file name


    // Fields for lower level detection processes (alpr, person etc)
    detection_completed: {
      type: type.INTEGER, defaultValue: 0
    },
    detection_result: type.STRING, // License plate, person etc.

    color: type.STRING,   // Vehicle color or any other color property for label use

    // For voice output
    voice_completed: {
      type: type.INTEGER, defaultValue: 0
    },

    // For super resolution images
    sr_image_computed: {                        // Is super resolution image processed from cropped image
      type: type.INTEGER, defaultValue: 0
    },
    sr_image_name: type.STRING,                 // If has different name, should save it here
    detection_after_sr_completed: {             // After super resolution image, we may want to try detect things again
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
