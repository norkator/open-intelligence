'use strict';

// Components
const logger = require('./module/logger');
const utils = require('./module/utils');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const initDb = require('./module/database');
const dotenv = require('dotenv');
dotenv.config();


if (!utils.ValidNodeJSVersion()) {
  console.log('# WARNING, NODEJS VERSION DOES NOT MEET MINIMUM REQUIREMENT #');
  process.exit(0);
}


// Run app
initDb.initDatabase().then(() => {
  let sequelizeObjects = require('./module/sequelize');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true,}));

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use(function (req, res, next) {
    logger.log(req.method + req.url, logger.LOG_UNDERSCORE);
    next();
  });

  app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + 'html/index.html'));
  });

  // -------------------------------------------------------------------------------------------------------------------
  // Register routes

  require('./routes/site').Site(app, sequelizeObjects);

  // -------------------------------------------------------------------------------------------------------------------
  // Start web server

  // Development server
  app.listen(process.env.API_PORT, () => {
    logger.log(`Development api listening on port ${process.env.API_PORT}.`, logger.LOG_YELLOW);
  });

  // -------------------------------------------------------------------------------------------------------------------

});
