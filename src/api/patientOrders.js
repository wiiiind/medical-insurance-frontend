import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// 获取已入院的患者列表 (GET /hospital/medOrder/select)
export const getAdmittedPatientsForOrders = () => {
  return service.get(`/hospital/medOrder/select`);
};

// 搜索药品 (GET /hospital/medOrder/drug)
export const searchDrugs = (params) => {
  return service.get(`/hospital/medOrder/drug`, { params });
};

// 搜索诊疗项目 (GET /hospital/medOrder/treatment)
export const searchTreatments = (params) => {
  return service.get(`/hospital/medOrder/treatment`, { params });
};

// 保存药品医嘱 (POST /hospital/medOrder/drug)
export const saveDrugOrders = (data) => {
  return service.post(`/hospital/medOrder/drug`, data);
};

// 保存诊疗项目医嘱 (POST /hospital/medOrder/treatment)
export const saveTreatmentOrders = (data) => {
  return service.post(`/hospital/medOrder/treatment`, data);
};

// 保存医疗服务医嘱 (POST /hospital/medOrder/service)
export const saveServiceOrders = (data) => {
  return service.post(`/hospital/medOrder/service`, data);
};