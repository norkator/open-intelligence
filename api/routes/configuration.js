'use strict';

const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv').config();
const fs = require('fs');


async function Configuration(router, sequelizeObjects) {

  router.get('/python-configuration', async (req, res) => {
    const configurationFilePath = path.join(__dirname + '../../../' + 'config.ini');
    const configFileData = fs.readFileSync(configurationFilePath);
    res.json({
      status: 'ok', fields: {

      },
      configData: configFileData.toString('base64')
    });
  });


  router.patch('/python-configuration', async (req, res) => {
    res.json({status: 'ok', data: ''});
  });


}

exports.Configuration = Configuration;
