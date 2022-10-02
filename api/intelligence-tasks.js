// NOTE: Run only one instance of this task
'use strict';

// Components
const logger = require('./module/logger');
const utils = require('./module/utils');
const initDb = require('./module/database');
const dotEnv = require('dotenv');
dotEnv.config();
const schedule = require('node-schedule');
const siteRoute = require('./routes/site');


if (!utils.ValidNodeJSVersion()) {
  console.error('# WARNING, NODEJS VERSION DOES NOT MEET MINIMUM REQUIREMENT #');
  process.exit(0);
}

// Run app
initDb.initDatabase().then(async () => {
  let sequelizeObjects = require('./module/sequelize');

  // -------------------------------------------------------------------------------------------------------------------
  // Register scheduled tasks

  console.info('Emailing feature is ' + (process.env.EMAIL_ENABLED === 'True' ? 'enabled' : 'disabled'));

  schedule.scheduleJob('*/60 * * * *', async () => {
    try {
      await utils.SetStorageUsage();
      console.info('Storage usage updated.');
    } catch (e) {
      console.error(e);
    }
  });

  schedule.scheduleJob('0 0 22 * * *', async () => {
    if (process.env.EMAIL_ENABLED === 'True') {
      try {
        await utils.SendStatisticsEmail(sequelizeObjects);
        console.info('Email function run completed.');
      } catch (e) {
        console.error(e);
      }
    }
  });

  schedule.scheduleJob('*/120 * * * *', async () => {
    if (process.env.EMAIL_ENABLED === 'True') {
      try {
        await utils.SendNotifications(sequelizeObjects);
        console.info('Email notification sent function run completed.');
      } catch (e) {
        console.error(e);
      }
    }
  });

});
