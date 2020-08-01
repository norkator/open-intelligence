const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const dotEnv = require('dotenv');
dotEnv.config();


async function Plates(router, sequelizeObjects) {


  router.post('/get/calendar/events', async (req, res) => {
    let output = {events: []};
    const knownPlates = await utils.GetLicensePlates(sequelizeObjects);
    if (knownPlates.length > 0) {
      const rows = await sequelizeObjects.Data.findAll({
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
      });

      let temp = [];

      // Filtering
      rows.forEach(row => {
        const closestPlateOwner = utils.GetVehicleDetails(knownPlates, row.detection_result);
        if (closestPlateOwner.plate !== '' && closestPlateOwner.owner_name !== '') {
          const plate = closestPlateOwner.plate;
          temp.push({
            title: plate,
            start: moment(row.file_create_date).format('YYYY-MM-DD HH:mm'),
            description: closestPlateOwner.owner_name,
            file_name_cropped: row.file_name_cropped,
          });
        }
      });

      // Start end time filtering
      output.events = utils.ParseVehicleEvents(temp);
      res.json(output);

    } else {
      res.json(output);
    }
  });


}

exports.Plates = Plates;
