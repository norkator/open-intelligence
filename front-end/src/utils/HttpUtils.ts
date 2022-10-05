import axios, {
  GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG,
  GET_OBJECT_DETECTION_IMAGE,
  GET_INTELLIGENCE,
  GET_LABEL_IMAGES,
  DELETE_LABEL_IMAGE,
  GET_SUPER_RESOLUTION_IMAGE,
  GET_INSTANCE_DETAILS,
  GET_CALENDAR_EVENTS,
  GET_LICENSE_PLATES,
  MANAGE_LICENSE_PLATES,
  GET_LICENSE_PLATE_DETECTIONS,
  GET_FACE_GROUPING_IMAGES,
  MOVE_FACE_GROUPING_IMAGE,
  TRAIN_FACE_MODEL_ACTION,
  GET_FACES,
  TRY_FACE_DETECTION_AGAIN, REJECT_LICENSE_PLATE_DETECTION, GET_CROPPED_IMAGE_FOR_LICENSE_PLATE,
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
  const response = await axios.get(GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG, {
    params: {
      croppedImageName: croppedImageName
    }
  });
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
  const response = await axios.get(GET_OBJECT_DETECTION_IMAGE, {
    params: {
      objectDetectionImageFileName: objectDetectionImageFileName
    }
  });
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
  const response = await axios.get(GET_INTELLIGENCE, {
    params: {
      selectedDate: selectedDate
    }
  });
  return response.data as IntelligenceInterface;
}


export interface LabelInterface {
  id: number;
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
  const response = await axios.get(GET_LABEL_IMAGES, {
    params: {
      selectedDate: selectedDate,
      label: label
    }
  });
  return response.data.images as LabelInterface[];
}


export async function deleteLabelImage(id: number): Promise<void> {
  await axios.delete(DELETE_LABEL_IMAGE, {
    params: {
      id: id,
    }
  });
}


export interface SuperResolutionInterface {
  srImage: boolean;
  data: string;
  detectionResult: string;
  color: string;
  file_create_date: string;
}

/**
 * Return super resolution image for selected label
 * if not exists, will return normal image with more details
 * @param label selected label group
 * @param imageFile label image name
 */
export async function getSuperResolutionImage(label: string, imageFile: string) {
  const response = await axios.get(GET_SUPER_RESOLUTION_IMAGE, {
    params: {
      label: label, imageFile: imageFile
    }
  });
  return response.data as SuperResolutionInterface;
}


export interface InstanceInterface {
  id: number;
  process_name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Return current running instances / processes
 * this means python processes
 */
export async function getInstanceDetails() {
  const response = await axios.get(GET_INSTANCE_DETAILS);
  return response.data as InstanceInterface;
}


export interface CalendarEventsInterface {
  title: string;
  start: string;
  end: string;
  description: string;
  file_name_cropped: string;
}

export async function getCalendarEvents(dateRangeStartDate: string, dateRangeEndDate: string) {
  const response = await axios.get(GET_CALENDAR_EVENTS, {
    params: {
      dateRangeStartDate: dateRangeStartDate,
      dateRangeEndDate: dateRangeEndDate
    }
  });
  return response.data.events as CalendarEventsInterface[];
}


export interface LicensePlatesInterface {
  enabled: number;
  id: string;
  licence_plate: string;
  owner_name: string;
}

/**
 * Get user added license plates
 * @method GET
 */
export async function getLicensePlates() {
  const response = await axios.get(GET_LICENSE_PLATES);
  return response.data.plates;
}

/**
 * Add new owner & license plate
 * @param licencePlate plate string
 * @param ownerName name of owner or any other information
 * @param dataId data table data id, given as zero when not intended to update detection result
 * @method POST
 */
export async function addLicensePlate(licencePlate: string, ownerName: string, dataId: number) {
  const response = await axios.post(MANAGE_LICENSE_PLATES, {
    licence_plate: licencePlate,
    owner_name: ownerName,
    data_id: dataId
  });
  return response.data;
}

/**
 * Delete vehicle owner record
 * @param id used for deletion
 * @method DELETE
 */
export async function removeLicensePlate(id: string) {
  const response = await axios.delete(MANAGE_LICENSE_PLATES + '/' + id);
  return response.data;
}

/**
 * Update one owner row details
 * @param id row to update
 * @param licencePlate string
 * @param ownerName name or other details
 * @method PUT
 */
export async function updateLicensePlate(id: string, licencePlate: string, ownerName: string) {
  const response = await axios.put(MANAGE_LICENSE_PLATES, {id: id, licence_plate: licencePlate, owner_name: ownerName});
  return response.data;
}


export interface LicensePlateDetectionsInterface {
  id: number;
  file: string;
  title: string;
  label: string;
  ownerName: string;
  detectionResult: string;
  detectionCorrected: string;
  image: string; // base64 encoded image data
  objectDetectionFileName: string;
}

export async function getLicensePlateDetections(resultOption: string, selectedDate: string, startDate: string, endDate: string) {
  const response = await axios.get(GET_LICENSE_PLATE_DETECTIONS, {
    params: {
      resultOption: resultOption,
      selectedDate: selectedDate,
      selectedDateStart: startDate,
      selectedDateEnd: endDate,
    }
  });
  return response.data.licensePlates as LicensePlateDetectionsInterface[];
}


export interface FaceGroupingNamesInterface {
  name: string;
}

export interface FaceGroupingImagesInterface {
  file: string;
  title: string;
  image: string; // base64 encoded image data
}

export interface FaceGroupingData {
  names?: FaceGroupingNamesInterface[],
  images?: FaceGroupingImagesInterface[],
}

export async function getFaceGroupingImages(): Promise<FaceGroupingData> {
  const response = await axios.get(GET_FACE_GROUPING_IMAGES);
  let faceGroupingData = {} as FaceGroupingData;
  faceGroupingData.names = response.data.names as FaceGroupingNamesInterface[];
  faceGroupingData.images = response.data.images as FaceGroupingImagesInterface[];
  return faceGroupingData;
}


export async function moveFaceGroupingImage(name: string, rectFileName: string) {
  const response = await axios.post(MOVE_FACE_GROUPING_IMAGE, {name: name, rectFileName: rectFileName});
  return response.data;
}


export async function trainFaceModelAction() {
  const response = await axios.get(TRAIN_FACE_MODEL_ACTION);
  return response.data;
}


export interface FacesInterface {
  id: string;
  title: string;
  image: string; // base64 encoded image data
  detectionResult: string;
}

export async function getFaces(selectedDate: string): Promise<FacesInterface[]> {
  const response = await axios.post(GET_FACES, {selectedDate: selectedDate});
  return response.data.faces as FacesInterface[];
}


export async function tryFaceDetectionAgain(id: string) {
  const response = await axios.post(TRY_FACE_DETECTION_AGAIN, {id: id});
  return response.data;
}


export async function rejectLicensePlateDetection(dataId: number) {
  const response = await axios.post(REJECT_LICENSE_PLATE_DETECTION, {data_id: dataId});
  return response.data;
}


export async function getCroppedImageForLicensePlate(license_plate: string, selectedDateStart: string, selectedDateEnd: string) {
  const response = await axios.post(GET_CROPPED_IMAGE_FOR_LICENSE_PLATE, {
    licensePlate: license_plate,
    selectedDateStart: selectedDateStart,
    selectedDateEnd: selectedDateEnd
  });
  return response.data.data;
}
