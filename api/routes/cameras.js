'use strict';
const imageUtils = require('../module/imageUtils');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();


async function Cameras(router, sequelizeObjects) {


  router.post('/get/latest/camera/images', async (req, res) => {
    let outputData = {images: []};
    const objectDetectionImagesPath = path.join(__dirname + '../../../' + 'output/object_detection/');
    const cameraImages = await sequelizeObjects.sequelize.query(
      "with cte as (" +
      "select " +
      "row_number() over (partition by name order by id desc) as rn, " +
      "id, name, file_name, file_create_date " +
      "from data " +
      ") " +
      "select id, name, file_name, file_create_date " +
      "from cte " +
      "where rn = 1 " +
      "order by name desc"
      , {
        type: sequelizeObjects.sequelize.QueryTypes.SELECT
      }
    );
    cameraImages.forEach(cameraImage => {
      const fileName = String(cameraImage.file_name)
        .replace('.jpg', '.jpg.jpg').replace('.png', '.png.png');
      outputData.images.push({
        id: cameraImage.id,
        name: cameraImage.name,
        file_name: fileName,
        file_create_date: cameraImage.file_create_date
      });
    });
    outputData.images = await imageUtils.LoadImages(objectDetectionImagesPath, outputData.images);
    res.json(outputData);
  });


}

exports.Cameras = Cameras;
