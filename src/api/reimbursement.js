import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // 使用代理路径
  headers: {
    'Content-Type': 'application/json'
  }
});

// 参保人员信息查询
export const getMemberList = (params) => {
  return apiClient.get('/expReimburse/manageInfo', { params });
};

// 参保人员费用查询 - 查询人员
export const getMemberExpenseList = (params) => {
  return apiClient.get('/expReimburse/findExp', { params });
};

// 参保人员费用查询 - 查询药品
export const getDrugExpense = (drugType, patientId) => {
  return apiClient.get(`/expReimburse/findExp/drug/${drugType}`, { params: { patientId } });
};

// 参保人员费用查询 - 查询诊疗项目
export const getDiagnosisExpense = (patientId) => {
  return apiClient.get(`/expReimburse/findExp/diagnosis/${patientId}`);
};

// 参保人员费用查询 - 查询医疗服务
export const getServiceExpense = (patientId) => {
  return apiClient.get(`/expReimburse/findExp/service/${patientId}`);
};
