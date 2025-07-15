import axios from 'axios';

const API_BASE_URL = '/api';

// 查询待诊断的患者 (GET /hospital/diseaseDiag/select)
export const getUndiagnosedPatients = () => {
  return axios.get(`${API_BASE_URL}/hospital/diseaseDiag/select`);
};

// 关键修改：新增 searchDiseases 方法，调用 /main 接口进行搜索
// 根据后端截图，/admission, /main, /other 都可以用于搜索
export const searchDiseases = (params) => {
  return axios.get(`${API_BASE_URL}/hospital/diseaseDiag/main`, { params });
};

// 保存入院诊断 (POST /hospital/diseaseDiag/admission)
export const saveAdmissionDiagnosis = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/diseaseDiag/admission`, data);
};

// 保存主要诊断 (POST /hospital/diseaseDiag/main)
export const saveMainDiagnosis = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/diseaseDiag/main`, data);
};

// 保存其他诊断 (POST /hospital/diseaseDiag/other)
export const saveOtherDiagnosis = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/diseaseDiag/other`, data);
};