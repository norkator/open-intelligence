const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const path = require('path');
const fs = require('fs');
const dotEnv = require('dotenv');
dotEnv.config();


function Training(router, sequelizeObjects) {


  router.post('/training/get/images/for/labeling', function (req, res) {
    let outputData = {images: []};
    const filePath = path.join(__dirname + '../../../' + 'output/');

    sequelizeObjects.Data.findAll({
      attributes: [
        'id',
        'label',
        'file_name_cropped',
      ],
      where: {
        detection_result: {
          [Op.gt]: '',
        },
        [Op.or]: [
          {label: 'car'}, {label: 'truck'}, {label: 'bus'}
        ],
      },
      order: [
        ['file_create_date', 'asc']
      ],
      limit: 24,
    }).then(rows => {
      // noinspection JSIgnoredPromiseFromCall
      processImagesSequentially(rows.length);

      async function processImagesSequentially(taskLength) {
        // Specify tasks
        const promiseTasks = [];
        for (let i = 0; i < taskLength; i++) {
          promiseTasks.push(processImage);
        }
        // Execute tasks
        let t = 0;
        for (const task of promiseTasks) {
          outputData.images.push(
            await task(
              rows[t].id,
              rows[t].label,
              rows[t].file_name_cropped
            )
          );
          t++;
          if (t === taskLength) {
            outputData.images = outputData.images.filter(a => {
              return a !== null;
            });
            res.json(outputData);
          }
        }
      }

      function processImage(id, label, file_name_cropped) {
        return new Promise(resolve_ => {
          fs.readFile(filePath + label + '/' + file_name_cropped, function (err, data) {
            if (!err) {
              resolve_({
                id: id,
                file: file_name_cropped,
                image: 'data:image/png;base64,' + Buffer.from(data).toString('base64')
              });
            } else {
              resolve_(null);
            }
          });
        });
      }
    });
  });


  router.post('/training/sort/image', function (req, res) {
    const imageId = req.body.image_id;
    const imageX = req.body.image_x;
    const imageY = req.body.image_y;
    const imageX2 = req.body.image_x2;
    const imageY2 = req.body.image_y2;

    sequelizeObjects.Data.update(
      {
        labeled_for_training: 1,
        labeling_image_x: imageX,
        labeling_image_y: imageY,
        labeling_image_x2: imageX2,
        labeling_image_y2: imageY2,
      },
      {
        where: {
          id: imageId,
        }
      }).then(() => {
      res.status(200);
      res.send('x:' + imageX, ' y:' + imageY, ' x2:' + imageX2, ' y2:' + imageY2);
    }).catch(error => {
      res.status(500);
      res.send(error);
    });
  });


  router.post('/training/reject/image', function (req, res) {
    const imageId = req.body.image_id;
    sequelizeObjects.Data.update(
      {
        labeled_for_training: 1
      },
      {
        where: {
          id: imageId,
        }
      }).then(() => {
      res.status(200);
      res.send('Ok');
    }).catch(error => {
      res.status(500);
      res.send(error);
    });
  });


}

exports.Training = Training;
