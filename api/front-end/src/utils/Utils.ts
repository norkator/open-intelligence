import axios, {
  GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG,
  GET_OBJECT_DETECTION_IMAGE,
} from "../axios";


export interface ObjectDetectionImageFileNameInterface {
  file_name: string,
}

/**
 * Returns original full object detection image file name for cropped image origin
 * Todo: rename this function name to something smaller
 * @param croppedImageName
 */
export async function getObjectDetectionImageFileNameForCroppedImageName(croppedImageName: string): Promise<any> {
  let fileData = {} as ObjectDetectionImageFileNameInterface;
  const response = await axios.post(GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG, {croppedImageName: croppedImageName});
  fileData.file_name = response.data.file_name;
  return fileData;
}


export interface ObjectDetectionImageInterface {
  file_name: string,
  data: string,
}

/**
 * Get object detection image data
 * @param objectDetectionImageFileName
 */
export async function getObjectDetectionImage(objectDetectionImageFileName: string): Promise<any> {
  let imageData = {} as ObjectDetectionImageInterface;
  imageData.file_name = objectDetectionImageFileName;
  const response = await axios.post(GET_OBJECT_DETECTION_IMAGE, {objectDetectionImageFileName: objectDetectionImageFileName});
  imageData.data = response.data.data;
  return imageData;
}
