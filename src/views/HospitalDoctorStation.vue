<template>
  <div class="hospital-doctor-station">
    <h1>医院住院医生站医嘱处理</h1>
    <div class="row">
      <div class="col-md-3">
        <div class="list-group">
          <router-link to="/hospital-doctor-station/admission-registration" class="list-group-item list-group-item-action">
            入院登记
          </router-link>
          <router-link to="/hospital-doctor-station/patient-diagnosis" class="list-group-item list-group-item-action">
            患者诊断
          </router-link>
          <router-link to="/hospital-doctor-station/patient-orders" class="list-group-item list-group-item-action">
            患者医嘱
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
  name: 'HospitalDoctorStation'
}
</script>

<style scoped>
.hospital-doctor-station {
  padding: 20px;
}
</style>