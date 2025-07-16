import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// --- Level 1 ---

// 查询接口 (GET /manage/hospReimburse/level1)
export const getLevel1Ratios = () => {
  return service.get(`/manage/hospReimburse/level1`);
};

// 新增接口 (POST /manage/hospReimburse/level1)
export const createLevel1Ratio = (data) => {
  return service.post(`/manage/hospReimburse/level1`, data);
};

// 修改接口 (PUT /manage/hospReimburse/level1)
export const updateLevel1Ratio = (data) => {
  return service.put(`/manage/hospReimburse/level1`, data);
};

// 删除接口 (DELETE /manage/hospReimburse/level1?id=)
export const deleteLevel1Ratio = (id) => {
  return service.delete(`/manage/hospReimburse/level1`, { params: { id } });
};


// --- Level 2 ---

// 查询接口 (GET /manage/hospReimburse/level2)
export const getLevel2Ratios = () => {
  return service.get(`/manage/hospReimburse/level2`);
};

// 新增接口 (POST /manage/hospReimburse/level2)
export const createLevel2Ratio = (data) => {
  return service.post(`/manage/hospReimburse/level2`, data);
};

// 修改接口 (PUT /manage/hospReimburse/level2)
export const updateLevel2Ratio = (data) => {
  return service.put(`/manage/hospReimburse/level2`, data);
};

// 删除接口 (DELETE /manage/hospReimburse/level2?id=)
export const deleteLevel2Ratio = (id) => {
  return service.delete(`/manage/hospReimburse/level2`, { params: { id } });
};


// --- Level 3 ---

// 查询接口 (GET /manage/hospReimburse/level3)
export const getLevel3Ratios = () => {
  return service.get(`/manage/hospReimburse/level3`);
};

// 新增接口 (POST /manage/hospReimburse/level3)
export const createLevel3Ratio = (data) => {
  return service.post(`/manage/hospReimburse/level3`, data);
};

// 修改接口 (PUT /manage/hospReimburse/level3)
export const updateLevel3Ratio = (data) => {
  return service.put(`/manage/hospReimburse/level3`, data);
};

// 删除接口 (DELETE /manage/hospReimburse/level3?id=)
export const deleteLevel3Ratio = (id) => {
  return service.delete(`/manage/hospReimburse/level3`, { params: { id } });
};
