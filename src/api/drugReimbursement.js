import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// 查询接口 (GET /manage/drugReimburse)
export const getDrugReimbursements = () => {
  return service.get(`/manage/drugReimburse`);
};

// 新增接口 (POST /manage/drugReimburse)
export const createDrugReimbursement = (data) => {
  return service.post(`/manage/drugReimburse`, data);
};

// 修改接口 (PUT /manage/drugReimburse)
export const updateDrugReimbursement = (data) => {
  return service.put(`/manage/drugReimburse`, data);
};

// 删除接口 (DELETE /manage/drugReimburse/{id})
export const deleteDrugReimbursement = (id) => {
  return service.delete(`/manage/drugReimburse/${id}`);
};
