// NOTE: This task can have multiple instances, pm2 start intelligence.js -i 2
'use strict';

// Components
const logger = require('./module/logger');
const utils = require('./module/utils');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const initDb = require('./module/database');
const dotEnv = require('dotenv');
dotEnv.config();
const path = require('path');
const helmet = require('helmet');


if (!utils.ValidNodeJSVersion()) {
  console.error('# WARNING, NODEJS VERSION DOES NOT MEET MINIMUM REQUIREMENT #');
  process.exit(0);
}


// Run app
initDb.initDatabase().then(async () => {
  let sequelizeObjects = require('./module/sequelize');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true,}));

  if (process.env.ALLOW_ACCESS_ORIGIN_ALL === 'true') {
    // ALLOW_ACCESS_ORIGIN_ALL will let any origin client connect to this api
    app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
      next();
    });
  } else {
    // helps you secure your Express apps by setting various HTTP headers
    app.use(helmet());
  }

  app.use(function (req, res, next) {
    logger.log(req.method + req.url, logger.LOG_UNDERSCORE);
    next();
  });

  // -------------------------------------------------------------------------------------------------------------------
  // Register routes

  require('./routes/site').Site(app, sequelizeObjects);
  require('./routes/wall').Wall(app, sequelizeObjects);
  require('./routes/cameras').Cameras(app, sequelizeObjects);
  require('./routes/faces').Faces(app, sequelizeObjects);
  require('./routes/arduino').Arduino(app, sequelizeObjects);
  require('./routes/plates').Plates(app, sequelizeObjects);
  require('./routes/training').Training(app, sequelizeObjects);
  require('./routes/audio').Audio(app, sequelizeObjects);
  require('./routes/history').History(app, sequelizeObjects);
  require('./routes/configuration').Configuration(app, sequelizeObjects);

  // -------------------------------------------------------------------------------------------------------------------
  // Start web server

  // Development server
  app.listen(process.env.API_PORT, () => {
    logger.log(`Development api listening on port ${process.env.API_PORT}.`, logger.LOG_YELLOW);
  });

}).catch(() => null);
