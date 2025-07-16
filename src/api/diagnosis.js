import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// 查询待诊断的患者 (GET /hospital/diseaseDiag/select)
export const getUndiagnosedPatients = () => {
  return service.get(`/hospital/diseaseDiag/select`);
};

// 关键修改：新增 searchDiseases 方法，调用 /main 接口进行搜索
// 根据后端截图，/admission, /main, /other 都可以用于搜索
export const searchDiseases = (params) => {
  return service.get(`/hospital/diseaseDiag/main`, { params });
};

// 保存入院诊断 (POST /hospital/diseaseDiag/admission)
export const saveAdmissionDiagnosis = (data) => {
  return service.post(`/hospital/diseaseDiag/admission`, data);
};

// 保存主要诊断 (POST /hospital/diseaseDiag/main)
export const saveMainDiagnosis = (data) => {
  return service.post(`/hospital/diseaseDiag/main`, data);
};

// 保存其他诊断 (POST /hospital/diseaseDiag/other)
export const saveOtherDiagnosis = (data) => {
  return service.post(`/hospital/diseaseDiag/other`, data);
};