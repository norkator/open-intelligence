'use strict';
const fs = require('fs');

/**
 * Loads images from given file path for given images array...
 * @param filePath image root where to load images from
 * @param images containing image detail objects without image data
 * @return {Promise<*[]>}
 * @constructor
 */
async function LoadImages(filePath = null, images = []) {
  if (filePath === null) {
    return [];
  }
  for (const image of images) {
    image.image = await loadImage(filePath, image.file_name);
  }
  return images;
}

exports.LoadImages = LoadImages;


/**
 * Loads one image file data
 * @param filePath image root where to load images from
 * @param fileName name of wanted image data file
 * @return {Promise<string>}
 */
async function loadImage(filePath, fileName) {
  return new Promise(resolve => {
    fs.readFile(filePath + fileName, function (error, data) {
      if (!error) {
        resolve('data:image/png;base64,' + Buffer.from(data).toString('base64'));
      } else {
        resolve(null);
      }
    });
  });
}


/**
 * Delete file from given path
 * @param filePath
 * @param fileName
 * @returns {Promise<boolean>}
 */
async function DeleteImage(filePath, fileName) {
  try {
    fs.unlinkSync(filePath + fileName);
    return true;
  } catch (err) {
    return false;
  }
}

exports.DeleteImage = DeleteImage;
