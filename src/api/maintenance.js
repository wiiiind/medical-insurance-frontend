import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // 使用代理路径
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- 医院报销比例维护 ---

/**
 * 查询医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 */
export const getHospitalRatio = (level) => {
  return apiClient.get(`/manage/hospReimburse/level${level}`);
};

/**
 * 新增医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 * @param {object} data 报销比例数据
 */
export const addHospitalRatio = (level, data) => {
  return apiClient.post(`/manage/hospReimburse/level${level}`, data);
};

/**
 * 修改医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 * @param {object} data 报销比例数据 (必须包含 id)
 */
export const updateHospitalRatio = (level, data) => {
  return apiClient.put(`/manage/hospReimburse/level${level}`, data);
};

/**
 * 删除医院报销比例
 * @param {number} level 医院等级 (1, 2, or 3)
 * @param {number} id 要删除的记录的 id
 */
export const deleteHospitalRatio = (level, id) => {
  return apiClient.delete(`/manage/hospReimburse/level${level}`, { params: { id } });
};
