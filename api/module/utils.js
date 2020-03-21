const fs = require('fs');
const moment = require('moment');
const path = require('path');


/**
 * Check for minimum NodeJS requirement
 * @returns {boolean}
 * @constructor
 */
function ValidNodeJSVersion() {
  const nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
  console.log('Current installed NodeJS version: ' + nodeVersion);
  return nodeVersion >= 10.17;
}

exports.ValidNodeJSVersion = ValidNodeJSVersion;


/**
 * Get newest file from folder
 * @param files
 * @param path
 * @return {string}
 */
function GetNewestFile(files, path) {
  let out = [];
  if (files !== undefined) {
    files.forEach(function (file) {
      let stats = fs.statSync(path + "/" + file);
      if (stats.isFile()) {
        out.push({"file": file, "mtime": stats.mtime.getTime()});
      }
    });
    out.sort(function (a, b) {
      return b.mtime - a.mtime;
    });
  }
  if (out.length > 0) {
    if (out[0].file !== 'Thumbs.db') {
      return out[0].file;
    } else if (out.length > 1) {
      return out[1].file;
    } else {
      return "";
    }
  }
  return "";
}

exports.GetNewestFile = GetNewestFile;


/**
 * Get files between now and older than x days
 * give it as zero will return only start of today labels
 * @param {Array} files
 * @param {String} path
 * @param {Date} selectedDate
 * @returns {Array}
 * @constructor
 */
function GetFilesNotOlderThan(files, path, selectedDate = moment()) {
  let out = [];
  const startMillis = moment(selectedDate).startOf('day').utc(true).valueOf();
  const endMillis = moment(selectedDate).endOf('day').utc(true).valueOf();
  if (files !== undefined) {
    files.forEach(function (file) {
      if (!file.includes('Thumbs.db')) {
        let stats = fs.statSync(path + "/" + file);
        if (stats.isFile()) {
          const fileTime = stats.mtime.getTime();
          if (fileTime > startMillis && fileTime < endMillis) {
            out.push({"file": file, "mtime": fileTime});
          }
        }
      }
    });
  }
  // Sort on order mTime asc
  out.sort(function (a, b) {
    return a.mtime - b.mtime
  });
  return out;
}

exports.GetFilesNotOlderThan = GetFilesNotOlderThan;


/**
 * Add leading zeros to string number
 * @param {string} inputStr
 * @param {number} zerosCount number
 * @returns {string}
 * @constructor
 */
function AddLeadingZeros(inputStr = '', zerosCount) {
  const inputLength = String(inputStr).length;
  let outputStr = '';
  if (inputLength < zerosCount) {
    let requiredCount = (zerosCount - inputLength);
    for (let i = 0; i < requiredCount; i++) {
      outputStr += '0';
    }
    return outputStr += inputStr;
  } else {
    return inputStr;
  }
}

exports.AddLeadingZeros = AddLeadingZeros;


/**
 * Calculates label counts
 * returns array of { label: 'truck', value: 137 }, ...
 * @param {Array} rows
 * @return {Array}
 * @constructor
 */
function GetLabelCounts(rows) {
  let output = [];
  rows.forEach(row => {
    const label_ = row.label;
    const labelIndex = output.findIndex(function (dataObj) {
      return dataObj.label === label_;
    });
    if (labelIndex === -1) {
      output.push({label: label_, value: 1});
    } else {
      output[labelIndex].value++;
    }
  });
  return output;
}

exports.GetLabelCounts = GetLabelCounts;


/**
 * Move file
 * @param fromPath
 * @param toPath
 * @return {Promise<any>}
 * @constructor
 */
function MoveFile(fromPath, toPath) {
  return new Promise(function (resolve, reject) {
    fs.rename(fromPath, toPath, function (err) {
      if (err) {
        if (err.code === 'EXDEV') {
          copy();
        } else {
          reject();
        }
      }
      resolve();
    });

    function copy() {
      let readStream = fs.createReadStream(fromPath);
      let writeStream = fs.createWriteStream(toPath);
      readStream.on('error', callback);
      writeStream.on('error', callback);
      readStream.on('close', function () {
        fs.unlink(fromPath, callback);
      });
      readStream.pipe(writeStream);
    }
  });
}

exports.MoveFile = MoveFile;


/**
 * Database image not in image array
 * @param rowImage
 * @param imageArray
 * @constructor
 * @return {boolean}
 */
function ImageNotInImages(rowImage, imageArray) {
  return imageArray.filter(function (image) {
    return image !== rowImage;
  }).length === 0;
}

exports.ImageNotInImages = ImageNotInImages;


/**
 * Get license plate added by user
 * @param {Object} sequelizeObjects
 * @return {Promise<Array>}
 * @constructor
 */
function GetLicensePlates(sequelizeObjects) {
  return new Promise(function (resolve, reject) {
    sequelizeObjects.Plate.findAll({
      attributes: [
        'id',
        'licence_plate',
        'owner_name',
        'enabled',
      ],
      order: [
        ['createdAt', 'asc']
      ]
    }).then(rows => {
      resolve(rows);
    }).catch(() => {
      resolve([]);
    });
  });
}

exports.GetLicensePlates = GetLicensePlates;


/**
 * Get plate owner from records
 * @param plates
 * @param inPlate
 * @return {*}
 * @constructor
 */
function GetVehicleDetails(plates, inPlate) {
  return GetClosestPlateOwner(plates, inPlate);
}

exports.GetVehicleDetails = GetVehicleDetails;


/**
 * Get vehicle most probable owner name
 * @param {Array} knownPlates, array of user added plates
 * @param {String} inPlate, detected plate
 * @return {Object}
 */
function GetClosestPlateOwner(knownPlates, inPlate) {
  let results = [];
  knownPlates.forEach(knownPlate => {
    results.push({
      plate: knownPlate.licence_plate,
      owner_name: knownPlate.owner_name,
      levenstein: Number(String(knownPlate.licence_plate).levenstein(inPlate))
    });
  });
  // Sort asc
  results.sort(function (a, b) {
    return a.levenstein - b.levenstein
  });
  // Get only good results
  results = results.filter(function (result) {
    return result.levenstein <= 2;
  });
  // Return first
  // console.log(results);
  if (results.length > 0) {
    return results[0];
  } else {
    return {plate: '', owner_name: ''};
  }
}


/**
 * Matching license plate strings
 * @param {String} string
 * @return {*}
 */
String.prototype.levenstein = function (string) {
  let a = this, b = string + "", m = [], i, j, min = Math.min;
  if (!(a && b)) return (b || a).length;
  for (i = 0; i <= b.length; m[i] = [i++]) ;
  for (j = 0; j <= a.length; m[0][j] = j++) ;
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? m[i - 1][j - 1]
        : m[i][j] = min(
          m[i - 1][j - 1] + 1,
          min(m[i][j - 1] + 1, m[i - 1][j] + 1))
    }
  }
  return m[b.length][a.length];
};
