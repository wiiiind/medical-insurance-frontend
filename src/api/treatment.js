import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// 数据显示接口 (GET /manage/treatment)
export const getTreatments = (params) => {
  return service.get(`/manage/treatment`, { params });
};

// 查询回显接口 (GET /manage/treatment/{id})
export const getTreatmentById = (id) => {
  return service.get(`/manage/treatment/${id}`);
};

// 新增接口 (POST /manage/treatment)
export const createTreatment = (data) => {
  return service.post(`/manage/treatment`, data);
};

// 修改接口 (PUT /manage/treatment)
export const updateTreatment = (data) => {
  return service.put(`/manage/treatment`, data);
};

// 删除接口 (DELETE /manage/treatment)
export const deleteTreatments = (ids) => {
  return service.delete(`/manage/treatment`, { params: { ids } });
};
