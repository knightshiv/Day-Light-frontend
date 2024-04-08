import axios from "axios";
import { API_BASE_URL , API_PRODUCTION_BASE_URL} from "./constants";

//require('dotenv').config()

const AuthAxios = (userToken) =>{

  let url =  API_BASE_URL

  if(process.env.REACT_APP_ENV === 'production')
    url = API_PRODUCTION_BASE_URL;
    

    console.log("url",url)
    const instance = axios.create({
      baseURL: url,
    });

    // Add an interceptor to include JWT token in every request
    instance.interceptors.request.use(
      (config) => {
        // Get the JWT token from your state or context
        // If the JWT token exists, add it to the request header
        if (userToken) {
          config.headers["Authorization"] = `Bearer ${userToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
}

export default AuthAxios;
