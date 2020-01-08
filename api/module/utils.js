const fs = require('fs');


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
  files.forEach(function (file) {
    let stats = fs.statSync(path + "/" + file);
    if (stats.isFile()) {
      out.push({"file": file, "mtime": stats.mtime.getTime()});
    }
  });
  out.sort(function (a, b) {
    return b.mtime - a.mtime;
  });
  return (out.length > 0) ? out[0].file : "";
}

exports.GetNewestFile = GetNewestFile;


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
