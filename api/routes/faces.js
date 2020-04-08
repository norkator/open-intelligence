const utils = require('../module/utils');
const moment = require('moment');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const os = require('os-utils');


function Faces(router, sequelizeObjects) {


  router.get('/get/faces/for/day', function (req, res) {
    let outputData = {images: []};
    const filePath = path.join(__dirname + '../../../' + 'output/insightface/faces/');
    fs.readdir(filePath, function (err, files) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        let filesList = utils.GetFilesNotOlderThan(files, filePath);

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
            outputData.images.push(await task(filesList[t].file, filesList[t].mtime));
            t++;
            if (t === taskLength) {
              res.json(outputData); // All tasks completed, return
            }
          }
        }

        function processImage(file, mtime) {
          return new Promise(resolve => {
            fs.readFile(filePath + file, function (err, data) {
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

exports.Faces = Faces;
