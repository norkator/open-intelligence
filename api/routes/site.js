const moment = require('moment');
const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const os = require('os-utils');


async function Site(router, sequelizeObjects) {


  /**
   * Get intelligence
   */
  router.post('/get/intelligence', async (req, res) => {

    // Day selection from web interface, default today
    const selectedDate = req.body.selectedDate;

    const performance = {
      loadAvg: String(os.loadavg(5) + '%'),
      memUse: String(100 - Math.floor(os.freemem() / os.totalmem() * 100)) + '%',
      storageUse: 'N/A GB',
      instanceCount: 'N/A',
    };

    // Data is array of { h: '2006', a: 100 }, objects
    let activityData = {'data': [], 'xkey': 'h', 'ykeys': ['a'], 'labels': ['Activity']};
    let donutData = [];

    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'label',
        'file_name',
        'file_create_date',
        'detection_result',
        'file_name_cropped',
      ],
      where: {
        file_create_date: {
          [Op.gt]: moment(selectedDate).startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment(selectedDate).endOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

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
      donutData = utils.GetLabelCounts(rows);
    }

    const instances = await utils.GetInstances(sequelizeObjects);

    performance.instanceCount = instances.length;
    utils.GetStorageUsage().then(storageUsage => {
      performance.storageUse = storageUsage;
      // Return results
      res.json({
        performance: performance,
        activity: activityData,
        donut: donutData,
      });
    });


  });


  /**
   * Get weekly intelligence
   */
  router.get('/get/weekly/intelligence', async (req, res) => {
    let activityDataWeek = {'data': [], 'xkey': 'h', 'ykeys': ['a'], 'labels': ['Activity']};
    const startDay = moment().startOf('day').subtract(7, 'days').utc(true);
    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'file_create_date'
      ],
      where: {
        file_create_date: {
          [Op.gt]: startDay.toISOString(true),
          [Op.lt]: moment().startOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

    if (rows.length > 0) {
      // Create week activity chart data
      for (let d = 0; d < 7; d++) {
        const parseDay = moment(startDay).add(d, 'days').format('DD');
        // console.log('parse day: ' + parseDay);
        for (let h = 0; h < 24; h++) {
          const activityHourStr = utils.AddLeadingZeros(String(h), 2);
          const dayActivityHour = parseDay + '-' + activityHourStr;
          const activity = rows.filter(function (row) {
            let momentDay = moment(row.file_create_date).utc(true).format('DD');
            let momentHour = moment(row.file_create_date).utc(true).format('HH');
            return momentDay === parseDay && momentHour === activityHourStr
          }).length;
          activityDataWeek.data.push({h: dayActivityHour, a: activity});
        }
      }
    }

    // Return results
    res.json({
      activityWeek: activityDataWeek,
    });

  });


  /**
   * Return latest detected object detection image
   * Folder: /output/object_detection/
   * base64 image data output
   */
  router.get('/get/latest/object/detection/image', async (req, res) => {
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
            } else {
              res.json({
                'data': 'data:image/png;base64,' + Buffer.from(data).toString('base64')
              });
            }
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
  router.post('/get/label/images', async (req, res) => {
      // Day selection from web interface, default today
      const selectedDate = req.body.selectedDate;

      let outputData = {images: []};
      const label = req.body.label;
      const filePath = path.join(__dirname + '../../../' + 'output/' + label + '/');

      try {
        const rows = await sequelizeObjects.Data.findAll({
          attributes: [
            'id',
            'file_name',
            'file_name_cropped',
            'file_create_date',
          ],
          where: {
            label: label,
            file_create_date: {
              [Op.gt]: moment(selectedDate).startOf('day').utc(true).toISOString(true),
              [Op.lt]: moment(selectedDate).endOf('day').utc(true).toISOString(true),
            }
          },
          order: [
            ['file_create_date', 'asc']
          ]
        });

        // Read file data
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
            console.log('Loading label: ' + rows[t].file_name_cropped);
            outputData.images.push(await task(rows[t].file_name_cropped, rows[t].file_create_date));
            t++;
            if (t === taskLength) {
              res.json(outputData); // All tasks completed, return
            }
          }
        }

        function processImage(file_name_cropped, file_create_date) {
          return new Promise(resolve => {
            fs.readFile(filePath + file_name_cropped, function (err, data) {
              if (!err) {
                const datetime = moment(file_create_date).format(process.env.DATE_TIME_FORMAT);
                resolve({
                  title: datetime,
                  file: file_name_cropped,
                  image: 'data:image/png;base64,' + Buffer.from(data).toString('base64')
                });
              } else {
                console.log(err);
                resolve('data:image/png;base64,');
              }
            });
          });
        }

      } catch (e) {
        res.status(500);
        res.send('Could not load / find database records with label.')
      }
    }
  );


  /**
   * Loads sr image
   * if sr not found, load normal image
   */
  router.post('/get/super/resolution/image', async (req, res) => {
    const label = req.body.label;
    const image_file_name = req.body.imageFile;
    const filePath = path.join(__dirname + '../../../' + 'output/' + label + '/super_resolution/');
    const stockFilePath = path.join(__dirname + '../../../' + 'output/' + label + '/');

    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'id',
        'file_name',
        'detection_result',
        'color',
        'file_create_date',
      ],
      where: {
        file_name_cropped: image_file_name
      }
    });
    if (rows.length === 1) {
      const row = rows[0];
      const detection_result = row.detection_result === null ? '' : row.detection_result;
      fs.readFile(filePath + image_file_name, function (err, data) {
        if (err) {
          fs.readFile(stockFilePath + image_file_name, function (err, data) {
            if (err) {
              res.status(500);
              res.send(err);
            } else {
              res.json({
                'srImage': false,
                'data': 'data:image/png;base64,' + Buffer.from(data).toString('base64'),
                'detectionResult': detection_result,
                'color': row.color,
                'file_create_date': row.file_create_date,
              });
            }
          });
        } else {
          res.json({
            'srImage': true,
            'data': 'data:image/png;base64,' + Buffer.from(data).toString('base64'),
            'detectionResult': detection_result,
            'color': row.color,
            'file_create_date': row.file_create_date,
          });
        }
      });
    } else {
      res.status(500);
      res.send('Error on loading image file.');
    }
  });


  /**
   * Get voice intelligence
   */
  router.get('/get/voice/intelligence', async (req, res) => {
    let output = {message: ''};

    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'name', 'label', 'file_create_date', 'name', 'detection_result',
      ],
      where: {
        voice_completed: 0,
        file_create_date: {
          [Op.gt]: moment().startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment().endOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

    if (rows.length > 0) {

      // Too much data
      if (rows.length > 10) {
        output.message += 'I have seen ';
      }

      // Labels
      let labelCounts = utils.GetLabelCounts(rows);
      labelCounts.forEach(labelObj => {
        const count = labelObj.value;
        output.message += String(labelObj.value) + ' ' + labelObj.label + (count > 1 ? 's' : '') + ', '
      });

      // Detection results
      const detection_results_count = rows.filter(function (row) {
        return row.detection_result !== ''
      }).length;
      output.message += (detection_results_count > 10 ? '' + String(detection_results_count) + ' new detection results.'
        : '') + ' ';

      // Latest object detection image recorded
      const latestRow = rows[rows.length - 1];
      output.message += '' + latestRow.label + ' at ' + latestRow.name + ' at '
        + moment(latestRow.file_create_date).utc(true).format('HH:mm') + '. ';

      // Mark detections as talked over voice to not say them again
      sequelizeObjects.Data.update(
        {
          voice_completed: 1
        },
        {
          where: {
            voice_completed: 0,
            file_create_date: {
              [Op.gt]: moment().startOf('day').utc(true).toISOString(true),
              [Op.lt]: moment().endOf('day').utc(true).toISOString(true),
            }
          }
        }).then(() => {
        res.json(output);
      }).catch(() => {
        res.json(output);
      });
    } else {
      res.json(output);
    }


  });


  /**
   * Get license plate detection results
   */
  router.post('/get/license/plate/detections', async (req, res) => {

    // Variables
    const filePath = path.join(__dirname + '../../../' + 'output/');
    let licensePlates = [];

    // Parameters from front end
    const resultOption = req.body.resultOption;
    const selectedDate = req.body.selectedDate;
    const selectedDateStart = req.body.selectedDateStart;
    const selectedDateEnd = req.body.selectedDateEnd;

    // Get all detections
    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'id',
        'label',
        'file_name',
        'file_create_date',
        'detection_result',
        'file_name_cropped',
      ],
      where: {
        file_create_date: {
          [Op.gt]: moment(selectedDate === '' ? selectedDateStart : selectedDate).startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment(selectedDate === '' ? selectedDateEnd : selectedDate).endOf('day').utc(true).toISOString(true),
        },
        detection_result: {
          [Op.gt]: '',
        },
        [Op.or]: [
          {label: 'car'}, {label: 'truck'}, {label: 'bus'}
        ],
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

    if (rows.length > 0) {

      // Load known plates
      utils.GetLicensePlates(sequelizeObjects).then(plates => {

        // Fetch data here before loading images
        rows.forEach(row => {
          const datetime = moment(row.file_create_date).format(process.env.DATE_TIME_FORMAT);
          const detectionResult = utils.NoRead(row.detection_result);
          const vehicleDetails = utils.GetVehicleDetails(plates, detectionResult);
          licensePlates.push({
            id: row.id,
            objectDetectionFileName: row.file_name,
            title: datetime,
            label: row.label,
            file: row.file_name_cropped,
            detectionResult: detectionResult,
            detectionCorrected: vehicleDetails.plate,
            ownerName: vehicleDetails.owner_name,
          })
        });

        // Filter data before image loading
        if (resultOption === 'limited_known') {
          // Must have owner detail
          licensePlates = licensePlates.filter(plate => {
            return String(plate.ownerName).length > 0
          });
          // Limit count
          let tempValues = [];
          licensePlates.forEach(plate => {
            if (tempValues.filter(a => {
              return a.detectionCorrected === plate.detectionCorrected;
            }).length <= 3) { // Only few of each seen
              tempValues.push(plate);
            }
          });
          licensePlates = tempValues;
        } else if (resultOption === 'distinct_detection') {
          // Filter corrected empty ones
          licensePlates = licensePlates.filter(plate => {
            return String(plate.detectionCorrected).length > 0
          });
          // Load with distinct detection corrected, one of each
          let tempValues = [];
          licensePlates.forEach(plate => {
            if (tempValues.filter(a => {
              return a.detectionCorrected === plate.detectionCorrected;
            }).length === 0) {
              tempValues.push(plate);
            }
          });
          licensePlates = tempValues;
        } else if (resultOption === 'owner_detail_needed') {
          // No owner name
          licensePlates = licensePlates.filter(plate => {
            return String(plate.ownerName).length === 0
          });
          // Distinct non corrected plate
          let tempValues = [];
          licensePlates.forEach(plate => {
            if (tempValues.filter(a => {
              return a.detectionResult === plate.detectionResult;
            }).length === 0) {
              tempValues.push(plate);
            }
          });
          licensePlates = tempValues;
        }

        // noinspection JSIgnoredPromiseFromCall
        processImagesSequentially(licensePlates.length).catch(error => {
          console.error(error);
        });

        async function processImagesSequentially(taskLength) {
          // Specify tasks
          const promiseTasks = [];
          for (let i = 0; i < taskLength; i++) {
            promiseTasks.push(processImage);
          }
          // Execute tasks
          let t = 0;
          for (const task of promiseTasks) {
            licensePlates[t] = await task(licensePlates[t]);
            t++;
            if (t === taskLength) {
              res.json({
                licensePlates: licensePlates,
              });
            }
          }
        }

        function processImage(lpObj) {
          return new Promise(resolve_ => {
            fs.readFile(filePath + lpObj.label + '/' + lpObj.file, function (err, data) {
              if (!err) {
                lpObj.image = 'data:image/png;base64,' + Buffer.from(data).toString('base64');
                resolve_(lpObj);
              } else {
                resolve_(null);
              }
            });
          });
        }
      }).catch(error => {
        res.status(500);
        res.send(error);
      });
    } else {
      res.status(200);
      res.json({licensePlates: licensePlates});
    }

  });


  /**
   * Get faces
   */
  router.post('/get/faces', async (req, res) => {
    let faces = [];
    // Day selection from web interface, default today
    const selectedDate = req.body.selectedDate;
    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'id',
        'label',
        'file_name',
        'file_create_date',
        'detection_result',
        'file_name_cropped',
      ],
      where: {
        file_create_date: {
          [Op.gt]: moment(selectedDate).startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment(selectedDate).endOf('day').utc(true).toISOString(true),
        },
        detection_result: {
          [Op.gt]: '',
        },
        label: 'person',
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

    if (rows.length > 0) {
      const filePath = path.join(__dirname + '../../../' + 'output/');
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
          faces.push(
            await task(
              rows[t].id,
              rows[t].file_name_cropped,
              rows[t].label,
              rows[t].file_create_date,
              rows[t].detection_result
            )
          );
          t++;
          if (t === taskLength) {
            // Return results
            res.json({
              faces: faces,
            });
          }
        }
      }

      function processImage(id, file, label, file_create_date, detection_result) {
        return new Promise(resolve_ => {
          fs.readFile(filePath + label + '/' + file, function (err, data) {
            if (!err) {
              const datetime = moment(file_create_date).format(process.env.DATE_TIME_FORMAT);
              resolve_({
                id: id,
                title: datetime,
                file: file,
                detectionResult: detection_result,
                image: 'data:image/png;base64,' + Buffer.from(data).toString('base64')
              });
            } else {
              console.log(err);
              resolve_({
                id: 0,
                title: '',
                file: file,
                detectionResult: detection_result,
                image: 'data:image/png;base64'
              });
            }
          });
        });
      }
    } else {
      res.status(200);
      res.json({faces: faces});
    }

  });


  /**
   * Load non grouped face grouping images
   * also loads person name folders
   */
  router.get('/get/face/grouping/images', async (req, res) => {
    let outputData = {names: [], images: []};
    const filePath = path.join(__dirname + '../../../' + 'output/faces_dataset/');
    fs.readdir(filePath, function (err, files) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        let filesList = [];
        for (let file of files) {
          if (!file.includes('Thumbs.db')) {
            const stat = fs.statSync(filePath + '/' + file);
            if (stat && stat.isDirectory()) {
              const split = file.split('/');
              const splitStr = split[split.length - 1];
              if (splitStr !== 'box_images') {
                outputData.names.push(splitStr);
              }
            } else {
              if (file.includes('RECT_')) { // We want only images having rectangle to front end ui
                filesList.push({"file": file, "mtime": stat.mtime.getTime()});
              }
            }
          }
        }
        // Read file data
        // noinspection JSIgnoredPromiseFromCall
        processImagesSequentially(filesList.length > 30 ? 30 : filesList.length);

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
          if (promiseTasks.length === 0) {
            res.json(outputData);
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


  /**
   * Move face grouping image to selected folder
   */
  router.post('/move/face/grouping/image', async (req, res) => {
    const filePath = path.join(__dirname + '../../../' + 'output/faces_dataset/');
    const name = req.body.name;
    const rectFileName = req.body.rectFileName;
    const originalFileName = String(rectFileName).replace('RECT_', '');
    if (String(name) === 'delete') {
      fs.unlinkSync(filePath + rectFileName);
      fs.unlinkSync(filePath + originalFileName);
      res.status(200);
      res.send('Deleted files.');
    } else {
      utils.MoveFile(filePath + originalFileName, filePath + name + '/' + originalFileName).then(() => {
        try {
          fs.unlinkSync(filePath + rectFileName);
          res.status(200);
          res.send('Moving file succeeded!');
        } catch (err) {
          res.status(500);
          res.send(err);
        }
      }).catch(() => {
        res.status(500);
        res.send('Moving file failed!');
      })
    }
  });


  /**
   * Insert train face model using to stack
   * then python will run training script at 'App' at some point of time
   */
  router.get('/train/face/model', async (req, res) => {
    sequelizeObjects.App.create({
      action_name: 'train_face_model'
    }).then(result => {
      res.status(200);
      res.send('Training command processed.');
    }).catch(() => {
      res.status(500);
      res.send('Error at fetching training command.');
    });
  });


  /**
   * Updates data row that face detection is tried again
   */
  router.post('/try/face/detection/again', async (req, res) => {
    const id = Number(req.body.id);
    sequelizeObjects.Data.update({
        detection_result: null,
        detection_completed: 0,
        sr_image_computed: 0
      }, {where: {id: id,}}
    ).then(() => {
      res.status(200);
      res.send('Updated to be re valuated.');
    }).catch(() => {
      res.status(500);
      res.send('Error updating row.');
    });
  });


  /**
   * Get licence plates
   */
  router.get('/get/licence/plates', async (req, res) => {
    utils.GetLicensePlates(sequelizeObjects).then(plates => {
      res.json({plates: plates});
    });
  });

  /**
   * Create license plate
   * Todo, refactor this is terrible
   */
  router.post('/manage/licence/plates', async (req, res) => {
    const licensePlate = req.body.licence_plate;
    const dataId = req.body.data_id || 0;
    sequelizeObjects.Plate.findAll({
      attributes: ['id',],
      where: {licence_plate: licensePlate},
    }).then(rows => {
      if (rows.length > 0) {
        sequelizeObjects.Data.update({
            detection_result: licensePlate,
          }, {where: {id: dataId}}
        ).then(() => {
          res.status(409);
          res.send('Plate already exists in records');
        }).catch(() => {
          res.status(409);
          res.send('Plate already exists in records');
        });
      } else {
        sequelizeObjects.Plate.create({
          licence_plate: req.body.licence_plate, owner_name: req.body.owner_name, enabled: 1
        }).then(result => {
          res.status(200);
          res.send('New licence plate added.');
        }).catch(error => {
          res.status(500);
          res.send('Error adding licence plate. ' + error);
        });
      }
    }).catch(error => {
      res.status(500);
      res.send(error);
    });
  });

  /**
   * Delete license plate
   */
  router.delete('/manage/licence/plates/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (id > 0) {
      sequelizeObjects.Plate.destroy({
        where: {id: id},
      }).then(result => {
        if (result === 1) {
          res.status(200);
          res.send('Removed licence plate.');
        } else {
          res.status(500);
          res.send('Error removing licence plate. ');
        }
      });
    } else {
      res.status(500);
      res.send('No proper :id parameter provided for delete.');
    }
  });

  /**
   * Update license plate
   */
  router.put('/manage/licence/plates', async (req, res) => {
    sequelizeObjects.Plate.update({
      licence_plate: req.body.licence_plate,
      owner_name: req.body.owner_name,
      enabled: 1
    }, {
      where: {
        id: req.body.id
      }
    }).then(() => {
      res.status(200);
      res.send('Saved changes.');
    }).catch(error => {
      console.log(error);
      res.status(500);
      res.send(error);
    });
  });


  /**
   * Load object_detection folder image file with given name
   */
  router.post('/get/object/detection/image', async (req, res) => {
    const object_detection_image_file_name = String(req.body.objectDetectionImageFileName)
      .replace('.jpg', '.jpg.jpg').replace('.png', '.png.png'); // TODO: Not good, re-think later.
    const filePath = path.join(__dirname + '../../../' + 'output/object_detection/');
    fs.readFile(filePath + object_detection_image_file_name, function (err, data) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send('Error on loading image file.');
      } else {
        res.json({
          'data': 'data:image/png;base64,' + Buffer.from(data).toString('base64')
        });
      }
    });
  });


  /**
   * Get object detection image file name for cropped image
   */
  router.post('/get/object/detection/image/for/cropped/image', async (req, res) => {
    const croppedImageName = req.body.croppedImageName;
    sequelizeObjects.Data.findAll({
      attributes: [
        'id',
        'file_name',
      ],
      where: {
        file_name_cropped: croppedImageName
      }
    }).then(rows => {
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(500);
        res.send('Error on loading image file.');
      }
    });
  });


  /**
   * Load object_detection folder image file with given name
   */
  router.post('/download/image', async (req, res) => {
    const image_file_type = String(req.body.imageFileType);
    const label = String(req.body.label);
    const image_file_name = String(req.body.imageFileName);

    const filePath = path.join(__dirname + '../../../' + 'output/');
    const fullPath = filePath + label + '/' + (image_file_type === 'super_resolution' ? 'super_resolution' : '') + '/' + image_file_name;

    fs.readFile(fullPath, function (err, data) {
      if (err) {
        console.log(err);
        res.status(500);
        res.send('Error on loading image file.');
      } else {
        console.info('Sending requested image data');
        res.json({
          'data': 'data:image/png;base64,' + Buffer.from(data).toString('base64')
        });
      }
    });
  });


  /**
   * Get instance status details
   */
  router.get('/get/instance/details', async (req, res) => {
    utils.GetInstances(sequelizeObjects).then(instances => {
      res.json(instances);
    }).catch(error => {
      res.status(500);
      res.send('Error loading instance details.');
    })
  });


}

exports.Site = Site;
