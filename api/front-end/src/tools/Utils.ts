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
  axios.post(GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG, {croppedImageName: croppedImageName}).then((data: any) => {
    return data as ObjectDetectionImageFileNameInterface;
  }).catch(error => {
    return null;
  });
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
  axios.post(GET_OBJECT_DETECTION_IMAGE, {objectDetectionImageFileName: objectDetectionImageFileName}).then((data: any) => {
    let imageData = data as ObjectDetectionImageInterface;
    imageData.file_name = objectDetectionImageFileName;
    return imageData;
  }).catch(error => {
    return null;
  });
}
