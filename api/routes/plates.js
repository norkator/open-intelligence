const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const dotEnv = require('dotenv');
dotEnv.config();


function Plates(router, sequelizeObjects) {


  router.post('/get/calendar/events', function (req, res) {
    let output = {events: []};
    utils.GetLicensePlates(sequelizeObjects).then(knownPlates => {
      if (knownPlates.length > 0) {
        sequelizeObjects.Data.findAll({
          attributes: [
            'id',
            'file_name_cropped',
            'file_create_date',
            'detection_result',
          ],
          where: {
            file_create_date: {
              [Op.gt]: moment().startOf('day').subtract(90, 'days').utc(true).toISOString(true),
              [Op.lt]: new moment().endOf('day').utc(true).toISOString(true),
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
        }).then(rows => {

          // Filtering
          rows.forEach(row => {
            const closestPlateOwner = utils.GetVehicleDetails(knownPlates, row.detection_result);
            if (closestPlateOwner.plate !== '' && closestPlateOwner.owner_name !== '') {
              const plate = closestPlateOwner.plate;
              let lastPlate = '';
              try {
                lastPlate = output.events[output.events.length - 1].title
              } catch (e) {
              }
              if (lastPlate !== plate) {
                output.events.push({
                  title: plate,
                  start: moment(row.file_create_date).format('YYYY-MM-DD hh:mm'),
                  description: closestPlateOwner.owner_name,
                });
              }

            }
          });

          res.json(output);
        });
      } else {
        res.json(output);
      }
    }).catch(error => {
      res.json(output);
    });
  });


}

exports.Plates = Plates;
