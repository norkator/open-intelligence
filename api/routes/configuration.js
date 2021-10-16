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
    const configFileData = fs.readFileSync(configurationFilePath).toString('base64');
    const raw = new Buffer.alloc(configFileData.length, configFileData, 'base64').toString('ascii');
    const response = {
      status: 'ok',
      fields: {
        app: {
          move_to_processed: utils.ConfigValue(raw, 'move_to_processed'),
          process_sleep_seconds: utils.ConfigValue(raw, 'process_sleep_seconds'),
          cv2_imshow_enabled: utils.ConfigValue(raw, 'cv2_imshow_enabled'),
        },
        yolo: {
          ignored_labels: utils.ConfigValue(raw, 'ignored_labels'),
        },
        camera: {
          camera_names: utils.ConfigValue(raw, 'camera_names'),
          camera_folders: utils.ConfigValue(raw, 'camera_folders'),
        },
        postgresql: {
          host: utils.ConfigValue(raw, 'host'),
          database: utils.ConfigValue(raw, 'database'),
          user: utils.ConfigValue(raw, 'user'),
          password: utils.ConfigValue(raw, 'password'),
        },
        openalpr: {
          enabled: utils.ConfigValue(raw, 'enabled'),
          region: utils.ConfigValue(raw, 'region'),
          use_plate_char_length: utils.ConfigValue(raw, 'use_plate_char_length'),
          plate_char_length: utils.ConfigValue(raw, 'plate_char_length'),
        },
        facerecognition: {
          file_name_prefix: utils.ConfigValue(raw, 'file_name_prefix'),
          output_root_path: utils.ConfigValue(raw, 'output_root_path'),
        },
        streamgrab: {
          sleep_seconds: utils.ConfigValue(raw, 'sleep_seconds'),
          jpeg_stream_names: utils.ConfigValue(raw, 'jpeg_stream_names'),
          jpeg_streams: utils.ConfigValue(raw, 'jpeg_streams'),
        },
        similarity: {
          delete_files: utils.ConfigValue(raw, 'delete_files'),
        },
        super_resolution: {
          use_gpu: utils.ConfigValue(raw, 'use_gpu'),
          max_width: utils.ConfigValue(raw, 'max_width'),
          max_height: utils.ConfigValue(raw, 'max_height'),
        },
      },
      configData: configFileData
    };
    res.json(response);
  });


  router.patch('/python-configuration', async (req, res) => {
    res.json({status: 'ok', data: ''});
  });


}

exports.Configuration = Configuration;
