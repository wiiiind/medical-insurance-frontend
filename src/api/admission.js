import axios from 'axios';

const API_BASE_URL = '/api';

// 新增入院记录 (POST /hospital/patientRegister)
export const createAdmission = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/patientRegister`, data);
};
