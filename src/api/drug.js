import axios from 'axios';

const API_BASE_URL = '/api'; // Assuming a proxy is set up in vue.config.js

// 数据显示接口 (GET /manage/drugs)
export const getDrugs = (params) => {
  return axios.get(`${API_BASE_URL}/manage/drugs`, { params });
};

// 查询回显接口 (GET /manage/drugs/{id})
export const getDrugById = (id) => {
  return axios.get(`${API_BASE_URL}/manage/drugs/${id}`);
};

// 新增接口 (POST /manage/drugs)
export const createDrug = (data) => {
  return axios.post(`${API_BASE_URL}/manage/drugs`, data);
};

// 修改接口 (PUT /manage/drugs)
export const updateDrug = (data) => {
  return axios.put(`${API_BASE_URL}/manage/drugs`, data);
};

// 删除接口 (DELETE /manage/drugs)
export const deleteDrugs = (ids) => {
  return axios.delete(`${API_BASE_URL}/manage/drugs`, { data: ids });
};
