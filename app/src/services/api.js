import axios from 'axios';
import env from '../variables';

const api = axios.create({
    baseURL: env.OBA_API_URL
});

export default api;

