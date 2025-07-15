import axios from 'axios';

const API_BASE_URL = '/api';

// 数据显示接口 (GET /manage/treatment)
export const getTreatments = (params) => {
  return axios.get(`${API_BASE_URL}/manage/treatment`, { params });
};

// 查询回显接口 (GET /manage/treatment/{id})
export const getTreatmentById = (id) => {
  return axios.get(`${API_BASE_URL}/manage/treatment/${id}`);
};

// 新增接口 (POST /manage/treatment)
export const createTreatment = (data) => {
  return axios.post(`${API_BASE_URL}/manage/treatment`, data);
};

// 修改接口 (PUT /manage/treatment)
export const updateTreatment = (data) => {
  return axios.put(`${API_BASE_URL}/manage/treatment`, data);
};

// 删除接口 (DELETE /manage/treatment)
export const deleteTreatments = (ids) => {
  return axios.delete(`${API_BASE_URL}/manage/treatment`, { params: { ids } });
};
