const moment = require('moment');
const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const os = require('os-utils');


function Arduino(router, sequelizeObjects) {


  router.post('/arduino/display/data', function (req, res) {
    let output = {
      output: {
        detections_count: "0",
        persons_count: "0",
        last_lp: '',
      }
    };
    sequelizeObjects.Data.findAll({
      attributes: [
        'label',
        'detection_result',
      ],
      where: {
        file_create_date: {
          [Op.gt]: moment().startOf('day').utc(true).toISOString(true),
          [Op.lt]: moment().endOf('day').utc(true).toISOString(true),
        }
      },
      order: [
        ['file_create_date', 'asc']
      ]
    }).then(rows => {
      if (rows.length > 0) {
        output.output.detections_count = String(rows.length);

        output.output.persons_count = String(rows.filter(r => {
          return r.label === 'person';
        }).length);

        rows.forEach(row => {
          const l = row.label;
          const dr = row.detection_result;
          if ((l === 'car' || l === 'truck' || l === 'bus') && dr !== null && dr !== '') {
            output.output.last_lp = dr;
          }
        });

        res.json(output);
      } else {
        res.status(500);
        res.send('');
      }
    }).catch(error => {
      res.status(500);
      res.send(error);
    })
  });


}

exports.Arduino = Arduino;
