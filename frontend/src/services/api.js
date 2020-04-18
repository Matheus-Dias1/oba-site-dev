import axios from 'axios';

const api = axios.create({
    baseURL: 'https://oba-backend.herokuapp.com/',
});

export default api;