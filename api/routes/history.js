'use strict';
const imageUtils = require('../module/imageUtils');
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
        WHERE id IN (
            SELECT min(id)
            FROM data
            WHERE name = '` + cameraName + `'
              AND date(file_create_date) >= '` + startDate + `'
              AND CAST(file_create_date AS TIME) >= '` + timeOfDate + `'
            GROUP BY date(file_create_date)
        )
        AND date(file_create_date) <= '` + endDate + `'
        ORDER BY file_create_date ASC;`
      , null, {raw: false}
    );

    const rows = query[0];

    rows.forEach(row => {
      const fileName = String(row.file_name)
        .replace('.jpg', '.jpg.jpg').replace('.png', '.png.png');
      outputData.images.push({
        file: fileName,
        file_name: fileName,
        fileCreateDate: row.file_create_date
      });
    });
    outputData.images = await imageUtils.LoadImages(filePath, outputData.images);
    res.json(outputData);
  });


}

exports.History = History;
