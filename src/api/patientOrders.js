import axios from 'axios';

const API_BASE_URL = '/api';

// 获取已入院的患者列表 (GET /hospital/medOrder/select)
export const getAdmittedPatientsForOrders = () => {
  return axios.get(`${API_BASE_URL}/hospital/medOrder/select`);
};

// 搜索药品 (GET /hospital/medOrder/drug)
export const searchDrugs = (params) => {
  return axios.get(`${API_BASE_URL}/hospital/medOrder/drug`, { params });
};

// 搜索诊疗项目 (GET /hospital/medOrder/treatment)
export const searchTreatments = (params) => {
  return axios.get(`${API_BASE_URL}/hospital/medOrder/treatment`, { params });
};

// 保存药品医嘱 (POST /hospital/medOrder/drug)
export const saveDrugOrders = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/medOrder/drug`, data);
};

// 保存诊疗项目医嘱 (POST /hospital/medOrder/treatment)
export const saveTreatmentOrders = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/medOrder/treatment`, data);
};

// 保存医疗服务医嘱 (POST /hospital/medOrder/service)
export const saveServiceOrders = (data) => {
  return axios.post(`${API_BASE_URL}/hospital/medOrder/service`, data);
};