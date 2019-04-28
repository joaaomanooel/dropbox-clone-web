import axios from 'axios';

export const API_URL = 'https://dropbox-clone-api.herokuapp.com';
export default axios.create({ baseURL: `${API_URL}/api/v1` });
