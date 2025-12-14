// Interceptors for API client requests and responses
// BASE URL: https://hiring-dev.internal.kloudspot.com/api/
import axios from "axios";

// Axios Instance
const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request Interceptor
Axios.interceptors.request.use(
  function (config) {
    // Modify request config before sending the request (with Authentication Token if available)

    // Get Token from localStorage (or any other storage mechanism)
    const token = localStorage.getItem("authToken");

    // If token exists, add it to the request headers under 'Authorization' key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return config after modifications
    return config;
  },
  function (error) {
    // Handle request error
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
Axios.interceptors.response.use(
  function (response) {
    // No modifications, just return the response
    return response;
  },
  function (error) {
    // Handle response error (404) token related error -> User Logout
    console.error("Response Error:", error);
    return Promise.reject(error);
  },
);

export default Axios;
