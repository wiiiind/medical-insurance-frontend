import axios from 'axios';

const API_BASE_URL = '/api';

// 查询接口 (GET /manage/drugReimburse)
export const getDrugReimbursements = () => {
  return axios.get(`${API_BASE_URL}/manage/drugReimburse`);
};

// 新增接口 (POST /manage/drugReimburse)
export const createDrugReimbursement = (data) => {
  return axios.post(`${API_BASE_URL}/manage/drugReimburse`, data);
};

// 修改接口 (PUT /manage/drugReimburse)
export const updateDrugReimbursement = (data) => {
  return axios.put(`${API_BASE_URL}/manage/drugReimburse`, data);
};

// 删除接口 (DELETE /manage/drugReimburse/{id})
export const deleteDrugReimbursement = (id) => {
  return axios.delete(`${API_BASE_URL}/manage/drugReimburse/${id}`);
};
