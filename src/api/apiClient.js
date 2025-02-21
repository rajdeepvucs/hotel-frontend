import axios from 'axios';
import { baseURL } from "../../config";
import Cookies from 'js-cookie';
const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Enable sending cookies with requests
});

apiClient.interceptors.request.use(
  async (config) => {
        const propertyId = localStorage.getItem('propertyId')
        if (propertyId) {
            config.params = {
              ...config.params,
              propertyId: propertyId,
            };
        }
        // Get the token from cookies
        const token = Cookies.get('token'); // Replace 'authToken' with the cookie name used in your app
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
        }
        console.log("Request Headers:", config.headers);
       return config;
      },
     (error) => {
        return Promise.reject(error);
     }
);

 export default apiClient;