const moment = require('moment');
const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


function Site(router, sequelizeObjects) {


  /**
   * Get intelligence
   */
  router.get('/get/intelligence', function (req, res) {

    // Data is array of { h: '2006', a: 100 }, objects
    let activityData = {'data': [], 'xkey': 'h', 'ykeys': ['a'], 'labels': ['Activity']};
    let donutData = [];

    sequelizeObjects.Data.findAll({
      attributes: [
        'label',
        'file_name',
        'file_create_date',
      ],
      where: {
        createdAt: {
          [Op.gt]: moment().startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment().endOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['createdAt', 'asc']
      ]
    }).then(rows => {
      if (rows.length > 0) {

        // Create activity chart data
        for (let i = 0; i < 24; i++) {
          const activityHourStr = utils.AddLeadingZeros(String(i), 2);
          const activity = rows.filter(function (row) {
            let momentHour = moment(row.file_create_date).utc(true).format('HH');
            return momentHour === activityHourStr
          }).length;
          activityData.data.push({h: activityHourStr, a: activity});
        }

        // Parse label counts
        rows.forEach(row => {
          const label_ = row.label;
          const labelIndex = donutData.findIndex(function (dataObj) {
            return dataObj.label === label_;
          });
          if (labelIndex === -1) {
            donutData.push({label: label_, value: 1});
          } else {
            donutData[labelIndex].value++;
          }
        });
      }
      // Return results
      res.json({
        activity: activityData,
        donut: donutData,
      });
    }).catch(error => {
      res.status(500);
      res.send(error);
    })
  });


  /**
   * Get weekly intelligence
   */
  router.get('/get/weekly/intelligence', function (req, res) {
    let activityDataWeek = {'data': [], 'xkey': 'h', 'ykeys': ['a'], 'labels': ['Activity']};
    const startDay = moment().startOf('day').subtract(7, 'days').utc(true);
    sequelizeObjects.Data.findAll({
      attributes: [
        'file_create_date'
      ],
      where: {
        createdAt: {
          [Op.gt]: startDay.toISOString(true),
          [Op.lt]: moment().startOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['createdAt', 'asc']
      ]
    }).then(rows => {
      if (rows.length > 0) {
        // Create week activity chart data
        for (let d = 0; d < 7; d++) {
          const parseDay = moment(startDay).add(d, 'days').format('DD');
          // console.log('parse day: ' + parseDay);
          for (let h = 0; h < 24; h++) {
            const activityHourStr = utils.AddLeadingZeros(String(h), 2);
            const activity = rows.filter(function (row) {
              let momentDay = moment(row.file_create_date).utc(true).format('DD');
              let momentHour = moment(row.file_create_date).utc(true).format('HH');
              return momentDay === parseDay && momentHour === activityHourStr
            }).length;
            activityDataWeek.data.push({h: activityHourStr, a: activity});
          }
        }
      }

      // Return results
      res.json({
        activityWeek: activityDataWeek,
      });
    });
  });


  /**
   * Return latest detected object detection image
   * Folder: /output/object_detection/
   * base64 image data output
   */
  router.get('/get/latest/object/detection/image', function (req, res) {
    const filePath = path.join(__dirname + '../../../' + 'output/object_detection/');
    fs.readdir(filePath, function (err, files) {
      if (err) {
        res.status(500);
        res.send(err);
      }
      let objectDetectionFile = utils.GetNewestFile(files, filePath);
      if (files !== undefined) {
        if (files.length > 0) {
          fs.readFile(filePath + objectDetectionFile, function (err, data) {
            if (err) {
              res.status(500);
              res.send(err);
            }
            res.json({
              'data': 'data:image/png;base64,' + Buffer.from(data).toString('base64')
            });
          });
        } else {
          res.status(500);
          res.send('No files available');
        }
      }
    });
  });


  /**
   * Get label images from output /label folder
   * label specified at post body
   */
  router.post('/get/label/images', function (req, res) {
    let outputData = {images: []};
    const label = req.body.label;
    const filePath = path.join(__dirname + '../../../' + 'output/' + label + '/');

    fs.readdir(filePath, function (err, files) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        let filesList = utils.GetFilesNotOlderThan(files, filePath, 1);

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
            console.log('Loading: ' + filesList[t].file);
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
                resolve({title: datetime, image: 'data:image/png;base64,' + Buffer.from(data).toString('base64')});
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

exports.Site = Site;
