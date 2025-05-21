import axios from 'axios';
import router from './router';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    withCredentials: true,
    withXSRFToken: true,
});

// axiosClient.interceptors.request.use((config)=>{
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//     return config;
// });

axiosClient.interceptors.request.use(config => {
    const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken[1]; // Extract CSRF token from cookies
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(response=>{
    return response
}, error => {
    if(error.response && error.response.statusCode === 401){
        router.navigate('/login');
        return error;
    }
    throw error;
})

export default axiosClient;