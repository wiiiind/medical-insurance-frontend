import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// 数据显示接口 (GET /manage/drugs)
export const getDrugs = (params) => {
  return service.get(`/manage/drugs`, { params }); // 之后: return service.get(...)
};

// 查询回显接口 (GET /manage/drugs/{id})
export const getDrugById = (id) => {
  return service.get(`/manage/drugs/${id}`);
};

// 新增接口 (POST /manage/drugs)
export const createDrug = (data) => {
  return service.post(`/manage/drugs`, data);
};

// 修改接口 (PUT /manage/drugs)
export const updateDrug = (data) => {
  return service.put(`/manage/drugs`, data);
};

// 删除接口 (DELETE /manage/drugs)
export const deleteDrugs = (ids) => {
  return service.delete(`/manage/drugs`, { data: ids });
};
