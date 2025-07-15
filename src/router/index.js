import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/medical-insurance-data',
    name: 'MedicalInsuranceData',
    component: () => import('../views/MedicalInsuranceData.vue'),
    children: [
      {
        path: 'drug-maintenance',
        name: 'DrugMaintenance',
        component: () => import('../views/MedicalInsuranceData/DrugMaintenance.vue')
      },
      {
        path: 'treatment-item-maintenance',
        name: 'TreatmentItemMaintenance',
        component: () => import('../views/MedicalInsuranceData/TreatmentItemMaintenance.vue')
      },
      {
        path: 'medical-service-maintenance',
        name: 'MedicalServiceMaintenance',
        component: () => import('../views/MedicalInsuranceData/MedicalServiceMaintenance.vue')
      },
      {
        path: 'drug-reimbursement-ratio-maintenance',
        name: 'DrugReimbursementRatioMaintenance',
        component: () => import('../views/MedicalInsuranceData/DrugReimbursementRatioMaintenance.vue')
      },
      {
        path: 'hospital-reimbursement-ratio-maintenance',
        name: 'HospitalReimbursementRatioMaintenance',
        component: () => import('../views/MedicalInsuranceData/HospitalReimbursementRatioMaintenance.vue')
      }
    ]
  },
  {
    path: '/hospital-doctor-station',
    name: 'HospitalDoctorStation',
    component: () => import('../views/HospitalDoctorStation.vue'),
    children: [
      {
        path: 'admission-registration',
        name: 'AdmissionRegistration',
        component: () => import('../views/HospitalDoctorStation/AdmissionRegistration.vue')
      },
      {
        path: 'patient-diagnosis',
        name: 'PatientDiagnosis',
        component: () => import('../views/HospitalDoctorStation/PatientDiagnosis.vue')
      },
      {
        path: 'patient-orders',
        name: 'PatientOrders',
        component: () => import('../views/HospitalDoctorStation/PatientOrders.vue')
      }
    ]
  },
  {
    path: '/reimbursement-management',
    name: 'ReimbursementManagement',
    component: () => import('../views/ReimbursementManagement.vue'),
    children: [
      {
        path: 'member-info-management',
        name: 'MemberInfoManagement',
        component: () => import('../views/ReimbursementManagement/MemberInfoManagement.vue')
      },
      {
        path: 'member-expense-query',
        name: 'MemberExpenseQuery',
        component: () => import('../views/ReimbursementManagement/MemberExpenseQuery.vue')
      },
      {
        path: 'member-reimbursement',
        name: 'MemberReimbursement',
        component: () => import('../views/ReimbursementManagement/MemberReimbursement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router