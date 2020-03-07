const moment = require('moment');
const utils = require('../module/utils');
const fs = require('fs');
const {Op} = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const os = require('os-utils');


function Wall(router, sequelizeObjects) {


  /**
   * Get image wall images
   */
  router.post('/wall/get/images', function (req, res) {

  });



}

exports.Wall = Wall;
