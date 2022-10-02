'use strict';

const moment = require('moment');
const utils = require('../module/utils');
const {Op} = require('sequelize');
const dotEnv = require('dotenv').config();

async function Configuration(router, sequelizeObjects) {

  router.get('/python-configuration', async (req, res) => {
    const configurations = await sequelizeObjects.Configuration.findAll({
      attributes: [
        'id',
        'key',
        'value',
      ],
    });

    const response = {
      status: 'ok',
      fields: {
        app: {
          move_to_processed: utils.ConfigValue(configurations, 'move_to_processed', 'True'),
          process_sleep_seconds: utils.ConfigValue(configurations, 'process_sleep_seconds', '4'),
          cv2_imshow_enabled: utils.ConfigValue(configurations, 'cv2_imshow_enabled', 'False'),
          output_folder: utils.ConfigValue(configurations, 'output_folder', '/output_test/'),
        },
        yolo: {
          ignored_labels: utils.ConfigValue(configurations, 'ignored_labels', 'pottedplant,tennis racket,umbrella'),
        },
        camera: {
          cameras_root_path: utils.ConfigValue(configurations, 'cameras_root_path', '/input'),
          camera_names: utils.ConfigValue(configurations, 'camera_names', 'TestCamera1,TestCamera2'),
          camera_folders: utils.ConfigValue(configurations, 'camera_folders', '/testCamera1Folder/,/testCamera2Folder/,'),
        },
        openalpr: {
          enabled: utils.ConfigValue(configurations, 'enabled', 'True'),
          region: utils.ConfigValue(configurations, 'region', 'eu'),
          use_plate_char_length: utils.ConfigValue(configurations, 'use_plate_char_length', 'True'),
          plate_char_length: utils.ConfigValue(configurations, 'plate_char_length', '6'),
        },
        facerecognition: {
          file_name_prefix: utils.ConfigValue(configurations, 'file_name_prefix', ''),
          output_root_path: utils.ConfigValue(configurations, 'output_root_path', 'cwd'),
        },
        streamgrab: {
          sleep_seconds: utils.ConfigValue(configurations, 'sleep_seconds', '4'),
          jpeg_stream_names: utils.ConfigValue(configurations, 'jpeg_stream_names', 'name'),
          jpeg_streams: utils.ConfigValue(configurations, 'jpeg_streams', 'http://127.0.0.1/mjpg/video.mjpg'),
        },
        similarity: {
          delete_files: utils.ConfigValue(configurations, 'delete_files', 'False'),
        },
        super_resolution: {
          use_gpu: utils.ConfigValue(configurations, 'use_gpu', 'False'),
          max_width: utils.ConfigValue(configurations, 'max_width', '1000'),
          max_height: utils.ConfigValue(configurations, 'max_height', '1000'),
        },
      },
    };
    res.json(response);
  });


  router.patch('/python-configuration', async (req, res) => {
    const fields = req.body;
    let configs = [];
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.app));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.yolo));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.camera));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.openalpr));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.facerecognition));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.streamgrab));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.similarity));
    configs = configs.concat(utils.ObjectKeyValuePairs(fields.super_resolution));

    for await (const config of configs) {
      const configObj = await sequelizeObjects.Configuration.findOne({
        where: {key: config.key}
      });
      if (configObj === null) {
        await sequelizeObjects.Configuration.create({
          key: config.key,
          value: config.value,
        });
      } else {
        await configObj.update({
          key: config.key,
          value: config.value,
        });
      }
    }

    res.json({status: 'ok'});
  });


}

exports.Configuration = Configuration;
