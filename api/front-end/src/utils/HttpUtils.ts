import axios, {
  GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG,
  GET_OBJECT_DETECTION_IMAGE,
  GET_INTELLIGENCE, GET_LABEL_IMAGES,
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


export interface IntelligenceInterface {
  performance: {
    loadAvg: string;
    memUse: string;
    storageUse: string;
    instanceCount: number;
  },
  activity: {
    data: [{
      h: string,
      a: string,
    }]
  },
  donut: [{
    label: string,
    value: number,
  }]
}

/**
 * Get intelligence data for selected date
 * @param selectedDate in format like 'YYYY-MM-DD' (new Date().toISOString().substr(0, 10))
 * @return IntelligenceInterface object
 */
export async function getIntelligence(selectedDate: string): Promise<any> {
  const response = await axios.post(GET_INTELLIGENCE, {selectedDate: selectedDate});
  return response.data as IntelligenceInterface;
}


export interface LabelInterface {
  title: string;
  file: string;
  image: string;
}

/**
 * Get labels for donut chart label selection
 * @param selectedDate selected date in 'YYYY-MM-DD' format
 * @param label string like 'person'
 * @return LabelInterface
 */
export async function loadLabelImages(selectedDate: string, label: string) {
  const response = await axios.post(GET_LABEL_IMAGES, {selectedDate: selectedDate, label: label});
  return response.data.images as LabelInterface[];
}
