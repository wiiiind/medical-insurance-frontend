import axios from 'axios';

// Create axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  timeout: 5000 // request timeout
});

// Request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log('Backend Response Data:', res); // Add this line to log the response

    // If the custom code is not 1, it is judged as an error.
    if (res.code !== 1) {
      console.error('Error:', res.msg || 'Error');
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.error('API Request Error:', error); // Log the full error object
    return Promise.reject(error);
  }
);

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
    url: '/expReimburse/fee/rebursement',
    method: 'get',
    params: { patientId }
  })
}

export function getFeeDetailPieChart(pieType) {
  return service({
    url: `/expReimburse/fee/detail/${pieType}`,
    method: 'get'
  });
}