'use strict';
const imageUtils = require('../module/imageUtils');
const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();


async function Wall(router, sequelizeObjects) {


  /**
   * Get image wall images
   */
  router.post('/get/images', async (req, res) => {
    const myImages = JSON.parse(req.body.images);
    const basePath = path.join(__dirname + '../../../' + 'output/');
    let outputData = {images: []};

    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'label',
        'file_name',
        'file_create_date',
        'detection_result',
        'file_name_cropped',
        'file_create_date',
      ],
      where: {
        file_create_date: {
          [Op.gt]: moment().startOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

    if (rows.length > 0) {

      let filesList = [];

      for (let i = (rows.length > 80 ? rows.length - 80 : 0); i < rows.length; i++) {
        let row = rows[i];
        if (utils.ImageNotInImages(row.file_name_cropped, myImages)) {
          filesList.push({
            "path": basePath,
            "label": row.label + '/',
            "file": row.file_name_cropped,
            "mtime": row.file_create_date
          })
        }
      }

      if (filesList.length === 0) {
        console.log('No new images..');
        res.json(outputData);
      }

      filesList.forEach(file => {
        const datetime = moment(file.mtime).format(process.env.DATE_TIME_FORMAT);
        outputData.images.push({
          title: datetime,
          file: file.file,
          file_name: file.label + file.file
        });
      });
      outputData.images = await imageUtils.LoadImages(basePath, outputData.images);
      res.json(outputData);

    } else {
      res.json(outputData);
    }
  });


}

exports.Wall = Wall;
