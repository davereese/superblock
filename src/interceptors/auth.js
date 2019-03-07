import axios from 'axios';

export const tokenInterceptor = () => {
  axios.interceptors.request.use(config => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
      config.headers.common['Authorization'] = currentUser.token;
    }
    
    return config;
  });
};