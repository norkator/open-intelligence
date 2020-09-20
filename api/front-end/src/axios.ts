import axios from 'axios';

const instance = axios.create({
  /* Something for future use */
});

// instance.defaults.headers.common['Someheader'] = 'somevalue';

export default instance;

// .env file in root can override default base path taken from window location href
const basePath: string = process.env.REACT_APP_API_BASE_URL !== undefined ?
  process.env.REACT_APP_API_BASE_URL : document.location.href;

export const GET_LATEST_CAMERA_IMAGES_PATH = basePath + "get/latest/camera/images";
export const GET_FACES_FOR_DAY_PATH = basePath + "get/faces/for/day";
export const GET_GET_OBJ_IMG_NAME_FROM_CROPPED_IMG = basePath + "get/object/detection/image/for/cropped/image";
export const GET_OBJECT_DETECTION_IMAGE = basePath + "get/object/detection/image";
export const GET_INTELLIGENCE = basePath + "get/intelligence";
export const GET_LABEL_IMAGES = basePath + "get/label/images";
export const GET_SUPER_RESOLUTION_IMAGE = basePath + "get/super/resolution/image";
export const GET_INSTANCE_DETAILS = basePath + "get/instance/details";
export const GET_CALENDAR_EVENTS = basePath + "get/calendar/events";
export const GET_LICENSE_PLATES = basePath + "get/licence/plates";
export const MANAGE_LICENSE_PLATES = basePath + "manage/licence/plates";
