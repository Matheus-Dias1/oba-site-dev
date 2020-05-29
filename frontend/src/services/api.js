import axios from 'axios';

const api = axios.create({
    baseURL: 'https://deliveryoba.com.br/',
});

export default api;