const utils = require('../module/utils');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();


async function History(router, sequelizeObjects) {

  router.get('/get/history/camera/names', async (req, res) => {
    const queryResult = await sequelizeObjects.sequelize.query('SELECT DISTINCT name FROM data;', null, {raw: false});
    const result = [];
    if (queryResult[0].length > 0) {
      queryResult[0].forEach(q => {
        result.push(q.name);
      });
    }
    res.json(result);
  });


  router.post('/get/history/camera/images', async (req, res) => {
    let outputData = {images: []};
    const cameraName = req.body.cameraName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const timeOfDate = req.body.timeOfDate;

    const filePath = path.join(__dirname + '../../../' + 'output/object_detection/');

    const query = await sequelizeObjects.sequelize.query(`
        SELECT
            file_name,
            file_create_date
        FROM data
        where id in (
            SELECT min(id)
            FROM data
            WHERE name = '` + cameraName + `'
              AND date(file_create_date) >= '` + startDate + `'
              AND CAST(file_create_date AS TIME) >= '` + timeOfDate + `'
            GROUP BY date(file_create_date)
        )
        ORDER BY file_create_date ASC;`
      , null, {raw: false}
    );

    const rows = query[0];

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
              rows[t].file_name,
              rows[t].file_create_date
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

      function processImage(file_name, file_create_date) {
        return new Promise(resolve_ => {
          file_name = file_name.replace('.jpg', '.jpg.jpg').replace('.png', '.png.png');
          fs.readFile(filePath + file_name, function (err, data) {
            if (!err) {
              const datetime = moment(file_create_date).format(process.env.DATE_TIME_FORMAT);
              resolve_({
                file: file_name,
                image: 'data:image/png;base64,' + Buffer.from(data).toString('base64'),
                fileCreateDate: file_create_date,
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


}

exports.History = History;
