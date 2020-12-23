'use strict';
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const dotEnv = require('dotenv');
dotEnv.config();
const audioPath = path.join(__dirname + '../../../' + 'output/audio/');
const file_extension = '.mp3';

async function Audio(router, sequelizeObjects) {


  /**
   * When label is opened, this method returns audio matching time frame
   */
  router.post('/audio/get/for/label', async (req, res) => {
    const image_file_create_date =
      moment(req.body.imageFileCreateDate).utc().format(process.env.DATE_TIME_FORMAT);
    const audioFiles = [];

    const rows = await sequelizeObjects.sequelize.query(
      "SELECT file_name FROM recordings WHERE '" + image_file_create_date + "' between start_time and end_time"
      , {
        type: sequelizeObjects.sequelize.QueryTypes.SELECT
      }
    );
    if (rows.length > 0) {
      const audioFiles = await LoadAudioFiles(rows);
      res.json(audioFiles);
    } else {
      res.json([]);
    }

  });


  /**
   * Get's latest audio for cameras view
   */
  router.post('/audio/get/latest', async (req, res) => {
    const lastAudioId = Number(req.body.lastAudioId);
    const rows = await sequelizeObjects.sequelize.query(
      lastAudioId === 0 ?
        "SELECT id, file_name FROM recordings ORDER BY id DESC LIMIT 1;" :
        "SELECT id, file_name FROM recordings WHERE id > " + lastAudioId + " ORDER BY id ASC;"
      , {
        type: sequelizeObjects.sequelize.QueryTypes.SELECT
      }
    );
    if (rows.length > 0) {
      const audioFiles = await LoadAudioFiles(rows);
      res.json(audioFiles);
    } else {
      res.json([]);
    }
  });


}

exports.Audio = Audio;


/**
 * Helper loading audio files
 * @param rows
 * @return {Promise<void>}
 * @constructor
 */
async function LoadAudioFiles(rows) {
  const audioFiles = [];
  return processAudioFilesSequentially(rows.length);

  async function processAudioFilesSequentially(taskLength) {
    // Specify tasks
    const promiseTasks = [];
    for (let i = 0; i < taskLength; i++) {
      promiseTasks.push(processAudio);
    }
    // Execute tasks
    let t = 0;
    for (const task of promiseTasks) {
      audioFiles.push(
        await task(
          rows[t].id,
          rows[t].file_name
        )
      );
      t++;
      if (t === taskLength) {
        return audioFiles;
      }
    }
  }

  function processAudio(id, file_name) {
    return new Promise(resolve_ => {
      fs.readFile(
        audioPath + file_name + file_extension, function (err, data) {
          if (!err) {
            resolve_({
              id: id,
              audio: Buffer.from(data).toString('base64'),
            });
          } else {
            resolve_(null);
          }
        });
    });
  }


}
