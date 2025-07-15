import axios from 'axios';

const API_BASE_URL = '/api';

// 数据显示接口 (GET /manage/medserv)
export const getMedicalServices = (params) => {
  return axios.get(`${API_BASE_URL}/manage/medserv`, { params });
};

// 查询回显接口 (GET /manage/medserv/{id})
export const getMedicalServiceById = (id) => {
  return axios.get(`${API_BASE_URL}/manage/medserv/${id}`);
};

// 新增接口 (POST /manage/medserv)
export const createMedicalService = (data) => {
  return axios.post(`${API_BASE_URL}/manage/medserv`, data);
};

// 修改接口 (PUT /manage/medserv)
export const updateMedicalService = (data) => {
  return axios.put(`${API_BASE_URL}/manage/medserv`, data);
};

// 删除接口 (DELETE /manage/medserv)
export const deleteMedicalServices = (ids) => {
  return axios.delete(`${API_BASE_URL}/manage/medserv`, { data: ids });
};
