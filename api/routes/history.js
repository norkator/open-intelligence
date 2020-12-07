const utils = require('../module/utils');
const moment = require('moment');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const os = require('os-utils');


async function History(router, sequelizeObjects) {

  router.get('/get/history/camera/names', async (req, res) => {
    const queryResult = await sequelizeObjects.sequelize.query('SELECT DISTINCT name FROM data;', null, { raw: false });
    const result = [];
    if (queryResult[0].length > 0) {
      queryResult[0].forEach(q => {
        result.push(q.name);
      });
    }
    res.json(result);
  });

  /*
  router.post('/get/faces/for/day', async (req, res) => {
    let outputData = {images: []};
    const selectedDate = req.body.selectedDate;
    const filePath = path.join(__dirname + '../../../' + 'output/insightface/faces/');

    const rows = await sequelizeObjects.Data.findAll({
      attributes: [
        'id',
        'label',
        'file_create_date',
        'file_name_cropped',
      ],
      where: {
        file_create_date: {
          [Op.gt]: moment(selectedDate).startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment(selectedDate).endOf('day').utc(true).toISOString(true),
        },
        label: 'person',
      },
      order: [
        ['file_create_date', 'asc']
      ]
    });

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
              rows[t].file_create_date,
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

      function processImage(id, label, file_create_date, file_name_cropped) {
        return new Promise(resolve_ => {
          fs.readFile(filePath + file_name_cropped, function (err, data) {
            if (!err) {
              const datetime = moment(file_create_date).format(process.env.DATE_TIME_FORMAT);
              resolve_({
                title: datetime,
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
   */


}

exports.History = History;
