import axios from 'axios';

const instance = axios.create({
  /* Something for future use */
});

// instance.defaults.headers.common['Someheader'] = 'somevalue';

export default instance;
