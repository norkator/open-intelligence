const pgTools = require('pgtools');
const logger = require('./logger');
const dotenv = require('dotenv');
dotenv.config();

/**
 * This scripts makes sure we have database
 * it run's every time api starts
 * @type {Promise<any>}
 */
function initDatabase() {
  return new Promise(function (resolve, reject) {
    if (createDatabase()) {
      resolve(true);
    } else {
      reject(false);
    }
  }).catch(function (error) {
    return false;
  });
}

exports.initDatabase = initDatabase;


/**
 * Create main database if not exists
 */
function createDatabase() {
  logger.log('PgTools check database existence', logger.LOG_GREEN);
  pgTools.createdb({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
  }, process.env.DB_DATABASE, function (error, response) {
    if (!error) {
      console.log('db ' + process.env.DB_DATABASE + ' did not exists. Created it!')
    }
  });
  return true;
}
