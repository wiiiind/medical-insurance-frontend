import service from '@/utils/request.js'; // 之后: 导入我们自己的实例

// --- 医院报销比例维护 ---

/**
 * 查询医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 */
export const getHospitalRatio = (level) => {
  return service.get(`/manage/hospReimburse/level${level}`);
};

/**
 * 新增医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 * @param {object} data 报销比例数据
 */
export const addHospitalRatio = (level, data) => {
  return service.post(`/manage/hospReimburse/level${level}`, data);
};

/**
 * 修改医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 * @param {object} data 报销比例数据 (必须包含 id)
 */
export const updateHospitalRatio = (level, data) => {
  return service.put(`/manage/hospReimburse/level${level}`, data);
};

/**
 * 删除医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 * @param {number} id 要删除的记录的 id
 */
export const deleteHospitalRatio = (level, id) => {
  return service.delete(`/manage/hospReimburse/level${level}`, { params: { id } });
};
