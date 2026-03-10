import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.disneyapi.dev',
  timeout: 10000,
});

// intercepteurs de requetes
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// intercepteurs de reponses  
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {

      console.error(`[API Response Error] ${error.response.status}:`, error.response.data);
    } else if (error.request) {

      console.error('[API Network Error] No response received');
    } else {

      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
