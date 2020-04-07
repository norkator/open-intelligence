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
initDb.initDatabase().then(() => {
  let sequelizeObjects = require('./module/sequelize');

// -------------------------------------------------------------------------------------------------------------------
// Register scheduled tasks

  console.info('Emailing feature is ' + (process.env.EMAIL_ENABLED === 'True' ? 'enabled' : 'disabled'));
  schedule.scheduleJob('* 59 * * * *', () => {
    new RunScheduledProcesses();
  });

  function RunScheduledProcesses() {
    console.info('Running RunScheduledProcesses');
    if (process.env.EMAIL_ENABLED === 'True') {
      utils.SendEmail(sequelizeObjects).then(() => {
      });
    }
    utils.SetStorageUsage().then(() => {
    }).catch(() => {
    });
  }

});
