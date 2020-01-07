// Components
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();


// Models
const DataModel = require('../models/data');


// Sequelize instance
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: function (str) {
    if ((process.env.SEQ_LOGGING === 'true')) {
      console.log(str);
    }
  },
});


// Initialize models
const Data = DataModel(sequelize, Sequelize);


// Sync with database
sequelize.sync(/*{force: (process.env.SEQ_FORCE_SYNC === 'true')}*/) // Do not use force, will drop table
  .then(() => {
  });


// Export models
module.exports = {
  Data
};
