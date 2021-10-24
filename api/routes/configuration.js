'use strict';

const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const path = require('path');
const dotEnv = require('dotenv').config();
const fs = require('fs');

const PYTHON_CONFIG_FILE_PATH = path.join(__dirname + '../../../' + 'config.ini');


async function Configuration(router, sequelizeObjects) {

  router.get('/python-configuration', async (req, res) => {
    const configFileData = fs.readFileSync(PYTHON_CONFIG_FILE_PATH).toString('base64');
    const raw = new Buffer.alloc(configFileData.length, configFileData, 'base64').toString('ascii');
    const response = {
      status: 'ok',
      fields: {
        app: {
          move_to_processed: utils.ConfigValue(raw, 'move_to_processed'),
          process_sleep_seconds: utils.ConfigValue(raw, 'process_sleep_seconds'),
          cv2_imshow_enabled: utils.ConfigValue(raw, 'cv2_imshow_enabled'),
          output_folder: utils.ConfigValue(raw, 'output_folder'),
        },
        yolo: {
          ignored_labels: utils.ConfigValue(raw, 'ignored_labels'),
        },
        camera: {
          cameras_root_path: utils.ConfigValue(raw, 'cameras_root_path'),
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
    const fields = req.body;

    const config =
      `[app]
move_to_processed=` + (fields.app.move_to_processed ? `True` : `False`) + `
process_sleep_seconds=` + fields.app.process_sleep_seconds + `
cv2_imshow_enabled=` + (fields.app.cv2_imshow_enabled ? `True` : `False`) + `
output_folder=` + fields.app.output_folder + `

[yolo]
ignored_labels=` + fields.yolo.ignored_labels + `

[camera]
cameras_root_path=` + fields.camera.cameras_root_path + `
camera_names=` + fields.camera.camera_names + `
camera_folders=` + fields.camera.camera_folders + `

[postgresql]
host=` + fields.postgresql.host + `
database=` + fields.postgresql.database + `
user=` + fields.postgresql.user + `
password=` + fields.postgresql.password + `

[openalpr]
enabled=` + (fields.openalpr.enabled ? `True` : `False`) + `
region=` + fields.openalpr.region + `
use_plate_char_length=` + (fields.openalpr.use_plate_char_length ? `True` : `False`) + `
plate_char_length=` + fields.openalpr.plate_char_length + `

[facerecognition]
file_name_prefix=` + fields.facerecognition.file_name_prefix + `
output_root_path=` + fields.facerecognition.output_root_path + `

[streamgrab]
sleep_seconds=` + fields.streamgrab.sleep_seconds + `
jpeg_stream_names=` + fields.streamgrab.jpeg_stream_names + `
jpeg_streams=` + fields.streamgrab.jpeg_streams + `

[similarity]
delete_files=` + (fields.similarity.delete_files ? `True` : `False`) + `

[super_resolution]
use_gpu=` + (fields.super_resolution.use_gpu ? `True` : `False`) + `
max_width=` + fields.super_resolution.max_width + `
max_height=` + fields.super_resolution.max_height + `
`;
    fs.writeFileSync(PYTHON_CONFIG_FILE_PATH, config);
    res.json({status: 'ok'});
  });


}

exports.Configuration = Configuration;
