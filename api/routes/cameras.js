const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const os = require('os-utils');


function Cameras(router, sequelizeObjects) {


  /**
   * Get intelligence
   */
  router.post('/get/latest/camera/images', function (req, res) {
    let outputData = {images: []};
    const objectDetectionImagesPath = path.join(__dirname + '../../../' + 'output/object_detection/');
    sequelizeObjects.sequelize.query(
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
    ).then(function (cameraImages) {
      fs.readdir(objectDetectionImagesPath, function (err, files) {
        if (err) {
          res.status(500);
          res.send(err);
        } else {

          // noinspection JSIgnoredPromiseFromCall
          processImagesSequentially(cameraImages.length);

          async function processImagesSequentially(taskLength) {

            // Specify tasks
            const promiseTasks = [];
            for (let i = 0; i < taskLength; i++) {
              promiseTasks.push(processImage);
            }

            // Execute tasks
            let t = 0;
            for (const task of promiseTasks) {
              outputData.images.push(await task(
                cameraImages[t].id, cameraImages[t].name, cameraImages[t].file_name, cameraImages[t].file_create_date
              ));
              t++;
              if (t === taskLength) {
                res.json(outputData); // All tasks completed, return
              }
            }
          }

          function processImage(id, name, file_name, file_create_date) {
            return new Promise(resolve => {
              fs.readFile(objectDetectionImagesPath + file_name
                .replace('.jpg', '.jpg.jpg').replace('.png', '.png.png'), function (err, data) {
                if (!err) {
                  resolve({
                    id: id,
                    name: name,
                    file_name: file_name,
                    file_create_date: file_create_date,
                    image: 'data:image/png;base64,' + Buffer.from(data).toString('base64')
                  });
                } else {
                  console.log(err);
                  resolve('data:image/png;base64,');
                }
              });
            });
          }

        }
      });
    })
  });


}

exports.Cameras = Cameras;
