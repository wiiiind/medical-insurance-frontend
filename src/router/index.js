// src/router/index.js (Corrected Icons)

import { createRouter, createWebHistory } from 'vue-router'
import ModuleLayout from '../views/layouts/ModuleLayout.vue';

const medicalInsuranceNavs = [
  // --- The only two lines that changed are here ---
  { name: '医保药品数据维护', path: '/medical-insurance-data/drug-maintenance', icon: 'package' },
  { name: '诊疗项目数据维护', path: '/medical-insurance-data/treatment-item-maintenance', icon: 'activity' },
  // --- End of changes ---
  { name: '医疗服务设施数据维护', path: '/medical-insurance-data/medical-service-maintenance', icon: 'grid' },
  { name: '药品报销比例维护', path: '/medical-insurance-data/drug-reimbursement-ratio-maintenance', icon: 'percent' },
  { name: '医院报销比例维护', path: '/medical-insurance-data/hospital-reimbursement-ratio-maintenance', icon: 'home' },
];

const doctorStationNavs = [
  { name: '入院登记', path: '/hospital-doctor-station/admission-registration', icon: 'edit-3' },
  { name: '患者诊断', path: '/hospital-doctor-station/patient-diagnosis', icon: 'user-check' },
  { name: '患者医嘱', path: '/hospital-doctor-station/patient-orders', icon: 'clipboard' },
];

const reimbursementNavs = [
   { name: '参保人员信息管理', path: '/reimbursement-management/member-info-management', icon: 'users' },
   { name: '参保人员费用查询', path: '/reimbursement-management/member-expense-query', icon: 'search' },
   { name: '参保人员费用报销', path: '/reimbursement-management/member-reimbursement', icon: 'dollar-sign' },
];

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/account-management',
    name: 'AccountManagement',
    component: () => import('../views/AccountManagement.vue'),
    meta: { requiresAuth: true, title: '账户管理' }
  },
  {
    path: '/medical-insurance-data',
    component: ModuleLayout,
    redirect: '/medical-insurance-data/drug-maintenance',
    meta: { title: '医疗保险基本信息维护', requiresAuth: true },
    props: { navItems: medicalInsuranceNavs },
    children: [
      { path: 'drug-maintenance', name: 'DrugMaintenance', component: () => import('../views/MedicalInsuranceData/DrugMaintenance.vue')},
      { path: 'treatment-item-maintenance', name: 'TreatmentItemMaintenance', component: () => import('../views/MedicalInsuranceData/TreatmentItemMaintenance.vue') },
      { path: 'medical-service-maintenance', name: 'MedicalServiceMaintenance', component: () => import('../views/MedicalInsuranceData/MedicalServiceMaintenance.vue') },
      { path: 'drug-reimbursement-ratio-maintenance', name: 'DrugReimbursementRatioMaintenance', component: () => import('../views/MedicalInsuranceData/DrugReimbursementRatioMaintenance.vue') },
      { path: 'hospital-reimbursement-ratio-maintenance', name: 'HospitalReimbursementRatioMaintenance', component: () => import('../views/MedicalInsuranceData/HospitalReimbursementRatioMaintenance.vue') },
    ]
  },
  {
    path: '/hospital-doctor-station',
    component: ModuleLayout,
    redirect: '/hospital-doctor-station/admission-registration',
    meta: { title: '医院住院医生站医嘱处理', requiresAuth: true },
    props: { navItems: doctorStationNavs },
    children: [
      { path: 'admission-registration', name: 'AdmissionRegistration', component: () => import('../views/HospitalDoctorStation/AdmissionRegistration.vue')},
      { path: 'patient-diagnosis', name: 'PatientDiagnosis', component: () => import('../views/HospitalDoctorStation/PatientDiagnosis.vue')},
      { path: 'patient-orders', name: 'PatientOrders', component: () => import('../views/HospitalDoctorStation/PatientOrders.vue')}
    ]
  },
  {
    path: '/reimbursement-management',
    component: ModuleLayout,
    redirect: '/reimbursement-management/member-info-management',
    meta: { title: '医保中心报销管理', requiresAuth: true },
    props: { navItems: reimbursementNavs },
    children: [
      { path: 'member-info-management', name: 'MemberInfoManagement', component: () => import('../views/ReimbursementManagement/MemberInfoManagement.vue')},
      { path: 'member-expense-query', name: 'MemberExpenseQuery', component: () => import('../views/ReimbursementManagement/MemberExpenseQuery.vue')},
      { path: 'member-reimbursement', name: 'MemberReimbursement', component: () => import('../views/ReimbursementManagement/MemberReimbursement.vue')}
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;