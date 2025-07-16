import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// 数据显示接口 (GET /manage/medserv)
export const getMedicalServices = (params) => {
  return service.get(`/manage/medserv`, { params });
};

// 查询回显接口 (GET /manage/medserv/{id})
export const getMedicalServiceById = (id) => {
  return service.get(`/manage/medserv/${id}`);
};

// 新增接口 (POST /manage/medserv)
export const createMedicalService = (data) => {
  return service.post(`/manage/medserv`, data);
};

// 修改接口 (PUT /manage/medserv)
export const updateMedicalService = (data) => {
  return service.put(`/manage/medserv`, data);
};

// 删除接口 (DELETE /manage/medserv)
export const deleteMedicalServices = (ids) => {
  return service.delete(`/manage/medserv`, { data: ids });
};
