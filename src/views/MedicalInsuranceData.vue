<template>
  <div class="medical-insurance-data">
    <h1>医疗保险基本信息维护</h1>
    <div class="row">
      <div class="col-md-3">
        <div class="list-group">
          <router-link to="/medical-insurance-data/drug-maintenance" class="list-group-item list-group-item-action">
            医保药品数据维护
          </router-link>
          <router-link to="/medical-insurance-data/treatment-item-maintenance" class="list-group-item list-group-item-action">
            诊疗项目数据维护
          </router-link>
          <router-link to="/medical-insurance-data/medical-service-maintenance" class="list-group-item list-group-item-action">
            医疗服务设施数据维护
          </router-link>
          <router-link to="/medical-insurance-data/drug-reimbursement-ratio-maintenance" class="list-group-item list-group-item-action">
            药品报销比例维护
          </router-link>
          <router-link to="/medical-insurance-data/hospital-reimbursement-ratio-maintenance" class="list-group-item list-group-item-action">
            医院报销比例维护
          </router-link>
        </div>
      </div>
      <div class="col-md-9">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicalInsuranceData'
}
</script>

<style scoped>
.medical-insurance-data {
  padding: 20px;
}
</style>