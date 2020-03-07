const moment = require('moment');
const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const os = require('os-utils');


function Wall(router, sequelizeObjects) {


  /**
   * Get image wall images
   */
  router.post('/get/images', function (req, res) {
    const myImages = JSON.parse(req.body.images);
    const basePath = path.join(__dirname + '../../../' + 'output/');
    let outputData = {images: []};
    sequelizeObjects.Data.findAll({
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
    }).then(rows => {
      if (rows.length > 0) {

        let filesList = [];

        for (let i = (rows.length > 80 ? rows.length - 80 : 0); i < rows.length; i++) {
          let row = rows[i];
          if (utils.ImageNotInImages(row.file_name_cropped, myImages)) {
            filesList.push({"path": basePath, "label": row.label + '/', "file": row.file_name_cropped, "mtime": row.file_create_date})
          }
        }

        // Read file data
        // noinspection JSIgnoredPromiseFromCall
        processImagesSequentially(filesList.length);

        async function processImagesSequentially(taskLength) {

          // Specify tasks
          const promiseTasks = [];
          for (let i = 0; i < taskLength; i++) {
            promiseTasks.push(processImage);
          }

          // Execute tasks
          let t = 0;
          for (const task of promiseTasks) {
            // console.log('Loading: ' + filesList[t].file);
            outputData.images.push(await task(filesList[t].path, filesList[t].label, filesList[t].file, filesList[t].mtime));
            t++;
            if (t === taskLength) {
              res.json(outputData); // All tasks completed, return
            }
          }
        }

        function processImage(path, label, file, mtime) {
          return new Promise(resolve => {
            fs.readFile(basePath + label + file, function (err, data) {
              if (!err) {
                const datetime = moment(mtime).format(process.env.DATE_TIME_FORMAT);
                resolve({
                  title: datetime,
                  file: file,
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

  });


}

exports.Wall = Wall;
