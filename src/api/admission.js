import service from '@/utils/request.js';

// 新增入院记录 (POST /hospital/patientRegister)
export const createAdmission = (data) => {
  return service.post(`/hospital/patientRegister`, data);
};
