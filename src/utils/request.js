// src/utils/request.js

import axios from 'axios';

// 1. 创建一个新的 Axios 实例
const service = axios.create({
  baseURL: '/api', // 所有请求的基础路径，来自于 vue.config.js 的代理
  timeout: 10000 // 请求超时时间
});

// 2. 添加请求拦截器 (Request Interceptor)
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    
    // 从 localStorage 中获取 token
    const token = localStorage.getItem('token');
    
    // 如果 token 存在，则为每个请求的请求头添加 'token' 字段
    if (token) {
      config.headers['token'] = token;
    }
    
    return config; // 必须返回配置对象，否则请求会被中断
  },
  error => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 3. 添加响应拦截器 (Response Interceptor) - 可选但推荐
// 我们可以把您在 reimbursement.js 中的响应处理逻辑也统一到这里
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 假设 'code' 不为 1 就是错误 (这可以根据您的后端逻辑调整)
    if (res.code !== 1) {
      console.error('API Error:', res.msg || 'Error');
      // 可以根据具体 code 做统一的错误处理，例如弹窗提示
      // Message({ message: res.msg || 'Error', type: 'error', duration: 5 * 1000 });
      
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      // 如果 code 为 1，直接返回数据
      return res;
    }
  },
  error => {
    console.error('Network Error:', error); // for debug
    // 可以做统一的网络错误处理
    return Promise.reject(error);
  }
);

// 4. 导出这个配置好的实例
export default service;