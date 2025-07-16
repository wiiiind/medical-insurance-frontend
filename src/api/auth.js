// src/api/auth.js (The Final, Correct Version)

import axios from 'axios';
import service from '@/utils/request.js';

// 注册函数是特例：它发生在用户登录前，没有 token，所以我们让它直接使用 axios
// 这样可以避免它经过请求拦截器，逻辑更清晰
export const register = (data) => {
  return axios.post(`/api/register`, data);
};

// --- 以下所有函数都应该使用我们带拦截器的全局 service 实例 ---

/**
 * 用户登录
 * @param {object} data - 包含 loginName 和 password 的对象
 */
export const login = (data) => {
  return service.post(`/login`, data);
};

/**
 * 上传头像
 * @param {FormData} formData - 包含文件的 FormData 对象
 */
export const uploadAvatar = (formData) => {
  return service.post(`/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

/**
 * 根据ID查询用户信息
 * @param {number} id - 用户ID
 */
export const getUserById = (id) => {
  return service.get(`/user/${id}`);
};

/**
 * 更新用户信息
 * @param {object} userData - 包含用户信息的对象
 */
export const updateUser = (userData) => {
  // 拦截器会自动添加 token，这里不再需要手动传递
  return service.put(`/user`, userData);
};