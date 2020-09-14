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
