// src/api/reimbursement.js (The Final, Correct Version)

import service from '@/utils/request.js';

// **之前所有的 axios.create 和 interceptors 代码已全部删除**
// 现在所有函数都将使用全局的、带 token 和统一响应处理的 service 实例

export function manageInfo(params) {
  return service({
    url: '/expReimburse/manageInfo',
    method: 'get',
    params
  })
}

export function findPatInfo(params) {
  return service({
    url: '/expReimburse/findExp',
    method: 'get',
    params
  })
}

export function findDrugInfo(drugType, patientId) {
  return service({
    url: `/expReimburse/findExp/drug/${drugType}`,
    method: 'get',
    params: { patientId }
  })
}

export function findDiagnosisInfo(patientId) {
  return service({
    url: `/expReimburse/findExp/diagnosis/${patientId}`,
    method: 'get'
  })
}

export function findMedServiceInfo(patientId) {
  return service({
    url: `/expReimburse/findExp/service/${patientId}`,
    method: 'get'
  })
}

export function getFeeReimbursementMembers(params) {
  return service({
    url: '/expReimburse/fee',
    method: 'get',
    params
  })
}

export function getFeeReimbursementDrugs(drugType, patientId) {
  return service({
    url: `/expReimburse/fee/rebursement/${drugType}`,
    method: 'get',
    params: { patientId }
  })
}

export function getFeeReimbursementOtherItems(patientId) {
  return service({
    url: '/expReimburse/fee/rebursement/other',
    method: 'get',
    params: { patientId }
  })
}

export function getFeeReimbursementSummary(patientId) {
  return service({
    url: '/expReimburse/fee/reimbursement',
    method: 'get',
    params: { patientId }
  })
}

// 确保 getFeeDetailPieChart 函数存在
export function getFeeDetailPieChart(pieType) {
  return service({
    url: `/expReimburse/fee/detail/${pieType}`,
    method: 'get'
  });
}