import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {MOCK_API_BASE_URL} from '../constants/endpoints';

const api = axios.create({
  baseURL: MOCK_API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

const getAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (!accessToken) throw new Error('Access token is null or undefined');
  return accessToken;
};

export const toRejectValue = error => {
  const data = error.response?.data;
  const Message = data?.Message || data?.message || error.message;
  console.log('API Error:', Message);
  return {...(typeof data === 'object' ? data : {}), Message, message: Message};
};

export const fetchData = async path => {
  const accessToken = await getAccessToken();
  const response = await api.get(path, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
  return response.data;
};

// area 0 = all branches
export const fetchBranchData = (endpoint, area) =>
  fetchData(`${endpoint}/${area ?? 0}.json`);

export default api;
