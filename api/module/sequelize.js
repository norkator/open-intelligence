// Components
const Sequelize = require('sequelize');
const dotEnv = require('dotenv');
dotEnv.config();


// Models
const DataModel = require('../models/data');
const OffSiteModel = require('../models/offsite');
const AppModel = require('../models/app');
const PlatesModel = require('../models/plate');
const InstanceModel = require('../models/instance');
const RecordingModel = require('../models/recording');
const NotificationModel = require('../models/notification');
const ConfigurationModel = require('../models/configuration');


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
const OffSite = OffSiteModel(sequelize, Sequelize);
const App = AppModel(sequelize, Sequelize);
const Plate = PlatesModel(sequelize, Sequelize);
const Instance = InstanceModel(sequelize, Sequelize);
const Recording = RecordingModel(sequelize, Sequelize);
const Notification = NotificationModel(sequelize, Sequelize);
const Configuration = ConfigurationModel(sequelize, Sequelize);


// Sync with database
sequelize.sync(/*{force: (process.env.SEQ_FORCE_SYNC === 'true')}*/) // Do not use force, will drop table
  .then(() => {
  });


// Export models
module.exports = {
  sequelize,
  Data,
  OffSite,
  App,
  Plate,
  Instance,
  Recording,
  Notification,
  Configuration,
};
