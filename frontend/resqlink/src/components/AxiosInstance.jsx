import axios from 'axios';

// For Create React App, use process.env instead of import.meta.env
const isDevelopment = process.env.NODE_ENV === 'development';
const baseURL = isDevelopment 
  ? process.env.REACT_APP_API_BASE_URL_LOCAL 
  : process.env.REACT_APP_API_BASE_URL_DEPLOY;

const AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json"
    }
});

// Add request interceptor
AxiosInstance.interceptors.request.use(
  config => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          break;
        case 404:
          // Handle not found errors
          break;
        case 500:
          // Handle server errors
          break;
        default:
          // Handle other errors
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;