import axios from 'axios';

const instance = axios.create({
  /* Something for future use */
});

// instance.defaults.headers.common['Someheader'] = 'somevalue';

export default instance;

// .env file in root can override default base path taken from window location href
const basePath: string = process.env.REACT_APP_API_BASE_URL !== undefined ?
  process.env.REACT_APP_API_BASE_URL : document.location.href;

export const GET_LATEST_CAMERA_IMAGES_PATH: string = basePath + "latest/camera/images";
export const GET_FACES_FOR_DAY_PATH: string = basePath + "faces/for/day";
export const GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG: string = basePath + "object/detection/image/for/cropped/image";
export const GET_OBJECT_DETECTION_IMAGE: string = basePath + "object/detection/image";
export const GET_INTELLIGENCE: string = basePath + "intelligence";
export const GET_LABEL_IMAGES: string = basePath + "label/images";
export const DELETE_LABEL_IMAGE: string = basePath + "label/image";
export const GET_SUPER_RESOLUTION_IMAGE: string = basePath + "super/resolution/image";
export const GET_INSTANCE_DETAILS: string = basePath + "get/instance/details";
export const GET_CALENDAR_EVENTS: string = basePath + "calendar/events";
export const GET_LICENSE_PLATES: string = basePath + "get/licence/plates";
export const MANAGE_LICENSE_PLATES: string = basePath + "manage/licence/plates";
export const GET_LICENSE_PLATE_DETECTIONS: string = basePath + "license/plate/detections";
export const GET_FACE_GROUPING_IMAGES: string = basePath + "get/face/grouping/images";
export const MOVE_FACE_GROUPING_IMAGE: string = basePath + "move/face/grouping/image";
export const TRAIN_FACE_MODEL_ACTION: string = basePath + "train/face/model";
export const GET_FACES: string = basePath + "get/faces";
export const TRY_FACE_DETECTION_AGAIN: string = basePath + "try/face/detection/again";
export const REJECT_LICENSE_PLATE_DETECTION: string = basePath + "reject/licence/plate/detection";
export const GET_CROPPED_IMAGE_FOR_LICENSE_PLATE: string = basePath + "get/cropped/image/for/license/plate";
export const GET_HISTORY_CAMERA_NAMES: string = basePath + "get/history/camera/names";
export const GET_HISTORY_CAMERA_IMAGES: string = basePath + "get/history/camera/images";
export const GET_VOICE_INTELLIGENCE: string = basePath + "voice/intelligence";
export const PYTHON_CONFIGURATION: string = basePath + "python-configuration";
