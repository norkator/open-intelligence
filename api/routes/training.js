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
    const dataMode = req.body.dataMode;
    let filePath = (dataMode === 'OffSite' ?
        path.join(__dirname + '../../../' + 'output/lp_training/offsite_images/') :
        path.join(__dirname + '../../../' + 'output/')
    );

    let where = {
      labeled_for_training: 0,
      [Op.or]: [
        {label: 'car'}, {label: 'truck'}, {label: 'bus'}
      ],
    };
    if (dataMode === 'Data') {
      where['detection_result'] = {
        [Op.gt]: '',
      }
    }
    sequelizeObjects[dataMode].findAll({
      attributes: [
        'id',
        'label',
        'file_name_cropped',
      ],
      where: where,
      order: [
        ['file_create_date', 'asc']
      ],
      limit: 24,
    }).then(rows => {
      if (rows.length > 0) {
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
            fs.readFile(
              filePath + (dataMode === 'OffSite' ? '/' + String(id) : label + '/') + file_name_cropped, function (err, data) {
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
      } else {
        res.json(outputData);
      }
    });

  });


  router.post('/training/sort/image', function (req, res) {
    const dataMode = req.body.dataMode;
    if (dataMode === undefined) {
      const imageId = req.body.image_id;
      const imageX = req.body.image_x;
      const imageY = req.body.image_y;
      const imageX2 = req.body.image_x2;
      const imageY2 = req.body.image_y2;

      sequelizeObjects[dataMode].update(
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
        res.send('x:' + imageX + ' y:' + imageY + ' x2:' + imageX2 + ' y2:' + imageY2);
      }).catch(error => {
        res.status(500);
        res.send(error);
      });
    } else {
      res.status(500);
      res.send('Data mode unspecified!');
    }
  });


  router.post('/training/reject/image', function (req, res) {
    const dataMode = req.body.dataMode;
    if (dataMode === undefined) {
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
    } else {
      res.status(500);
      res.send('Data mode unspecified!');
    }
  });


  router.get('/training/get/labeled/images/count', function (req, res) {
    // Count => total count
    let result = {count: 0, internalCount: 0, offSiteCount: 0};
    sequelizeObjects.Data.findAll({
      attributes: [
        'id',
      ],
      where: {
        labeled_for_training: 1,
        [Op.or]: [
          {label: 'car'}, {label: 'truck'}, {label: 'bus'}
        ],
        labeling_image_x: {[Op.gt]: 0},
        labeling_image_y: {[Op.gt]: 0},
        labeling_image_x2: {[Op.gt]: 0},
        labeling_image_y2: {[Op.gt]: 0},
      },
    }).then(dRows => {
      result.internalCount = dRows.length;
      sequelizeObjects.OffSite.findAll({
        attributes: [
          'id',
        ],
        where: {
          labeled_for_training: 1,
          [Op.or]: [
            {label: 'car'}, {label: 'truck'}, {label: 'bus'}
          ],
          labeling_image_x: {[Op.gt]: 0},
          labeling_image_y: {[Op.gt]: 0},
          labeling_image_x2: {[Op.gt]: 0},
          labeling_image_y2: {[Op.gt]: 0},
        },
      }).then(oRows => {
        result.offSiteCount = oRows.length;
        result.count = (Number(dRows.length) + Number(oRows.length));
        res.json(result);
      });
    });
  });


  router.get('/training/command/export', function (req, res) {
    sequelizeObjects.App.create({
      action_name: 'lp_training_export'
    }).then(result => {
      res.status(200);
      res.send('Export command processed.');
    }).catch(() => {
      res.status(500);
      res.send('Error at fetching command.');
    });
  });


  router.get('/training/command/train', function (req, res) {
    sequelizeObjects.App.create({
      action_name: 'lp_training_train'
    }).then(result => {
      res.status(200);
      res.send('Training command processed.');
    }).catch(() => {
      res.status(500);
      res.send('Error at fetching command.');
    });
  });


}

exports.Training = Training;
