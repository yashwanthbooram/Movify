import axios from 'axios';

const API = axios.create({
  baseURL: 'https://movify-backend.onrender.com' // <-- YOUR LIVE RENDER URL
});

export default API;