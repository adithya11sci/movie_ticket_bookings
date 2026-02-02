import axios from 'axios';

// create axios instance with base config
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// add token to requests if user is logged in
API.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        const { token } = JSON.parse(user);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
