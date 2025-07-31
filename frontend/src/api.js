import axios from 'axios';

const API = axios.create({
  baseURL: 'https://movify-backend.onrender.com'
});

export default API;
