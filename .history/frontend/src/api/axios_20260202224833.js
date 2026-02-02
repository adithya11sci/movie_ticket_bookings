import axios from 'axios';

// create axios instance with base config
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://movie-ticket-bookings-93ni.vercel.app/api',
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
