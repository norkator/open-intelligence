const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const os = require('os-utils');


function Cameras(router, sequelizeObjects) {


  /**
   * Get intelligence
   */
  router.post('/get/latest/camera/images', function (req, res) {
    sequelizeObjects.sequelize.query(
      "with cte as (" +
      "select " +
      "row_number() over (partition by name order by id desc) as rn, " +
      "id, name, file_name, file_create_date " +
      "from data " +
      ") " +
      "select id, name, file_name, file_create_date " +
      "from cte " +
      "where rn = 1 " +
      "order by name desc"
      , {
      type: sequelizeObjects.sequelize.QueryTypes.SELECT}
      ).then(function(cameraImages) {
        // TODO: develop image loading from output object detection images
        res.json(cameraImages);
      /**
       [{
        "id": "46592",
        "name": "Asd",
        "file_name": "asd.jpg",
        "file_create_date": "2020-03-31T13:49:45.000Z"
        },...]
       */

    })
  });


}

exports.Cameras = Cameras;
