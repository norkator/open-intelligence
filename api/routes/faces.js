'use strict';
const imageUtils = require('../module/imageUtils');
const moment = require('moment');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();


async function Faces(router, sequelizeObjects) {


  router.get('/faces/for/day', async (req, res) => {
    let outputData = {images: []};
    const selectedDate = req.query.selectedDate;
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

    rows.forEach(row => {
      const datetime = moment(row.file_create_date).format(process.env.DATE_TIME_FORMAT);
      outputData.images.push({
        title: datetime,
        file: row.file_name_cropped,
        file_name: row.file_name_cropped,
      });
    });
    outputData.images = (await imageUtils.LoadImages(filePath, outputData.images)).filter(image => {
      return image.image !== null;
    });
    res.json(outputData);
  });


}

exports.Faces = Faces;
