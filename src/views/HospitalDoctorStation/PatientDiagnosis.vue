<template>
  <div class="patient-diagnosis container-fluid mt-4">
    <h2 class="mb-4">患者诊断</h2>

    <div class="row">
      <!-- Patient List -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            待诊断患者列表
          </div>
          <div class="list-group list-group-flush">
             <a href="#" v-for="patient in patients" :key="patient.id"
               class="list-group-item list-group-item-action"
               :class="{ active: selectedPatient && selectedPatient.id === patient.id }"
               @click.prevent="selectPatient(patient)">
               {{ patient.realName }} - {{ patient.cardNumber }}
            </a>
            <div v-if="patients.length === 0" class="list-group-item text-muted">
              暂无待诊断患者
            </div>
          </div>
        </div>
      </div>

      <!-- Diagnosis Info -->
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            诊断信息
          </div>
          <div class="card-body">
            <div v-if="!selectedPatient" class="text-center text-muted">
              请先从左侧选择一位患者
            </div>
            <div v-else>
              <!-- Main Diagnosis Form -->
              <form @submit.prevent="saveCurrentDiagnosis">
                <div class="mb-3">
                  <label for="diseaseType" class="form-label">诊断类型</label>
                  <select class="form-select" id="diseaseType" v-model="currentDiagnosis.diseaseType" required>
                      <option value="admission">入院诊断</option>
                      <option value="main">主要诊断</option>
                      <option value="other">其他诊断</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="diseaseId" class="form-label">疾病ID</label>
                  <input type="number" class="form-control" id="diseaseId" v-model.number="currentDiagnosis.diseaseId" required placeholder="请输入疾病ID">
                   <div class="form-text">由于缺少疾病搜索接口，请手动输入疾病ID。</div>
                </div>
                <div class="mb-3">
                  <label for="orderTime" class="form-label">诊断时间</label>
                  <input type="datetime-local" class="form-control" id="orderTime" v-model="currentDiagnosis.orderTime" required>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-primary">保存诊断</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as diagnosisApi from '@/api/diagnosis.js'

export default {
  name: 'PatientDiagnosis',
  data() {
    return {
      patients: [],
      selectedPatient: null,
      currentDiagnosis: {
        patientId: null,
        diseaseId: null,
        orderTime: this.getCurrentDateTime(),
        diseaseType: 'main'
      }
    }
  },
  mounted() {
    this.fetchUndiagnosedPatients()
  },
  methods: {
    getCurrentDateTime() {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    },
    async fetchUndiagnosedPatients() {
      try {
        const response = await diagnosisApi.getUndiagnosedPatients()
        this.patients = response.data.data
      } catch (error) {
        console.error('获取待诊断患者列表失败:', error)
      }
    },
    selectPatient(patient) {
      this.selectedPatient = patient
      this.resetCurrentDiagnosis()
    },
    async saveCurrentDiagnosis() {
      if (!this.selectedPatient) {
        alert('请先选择一位患者')
        return
      }
      
      const payload = {
        ...this.currentDiagnosis,
        patientId: this.selectedPatient.id
      };
      
      try {
        const apiCallMap = {
          admission: diagnosisApi.saveAdmissionDiagnosis,
          main: diagnosisApi.saveMainDiagnosis,
          other: diagnosisApi.saveOtherDiagnosis
        };

        const apiCall = apiCallMap[payload.diseaseType];

        if (apiCall) {
          await apiCall(payload);
        } else {
          alert('未知的诊断类型');
          return;
        }

        alert('诊断信息保存成功！')
        this.resetCurrentDiagnosis()
      } catch (error) {
        console.error('保存诊断信息失败:', error)
        alert('保存诊断信息失败')
      }
    },
    resetCurrentDiagnosis() {
        this.currentDiagnosis = {
            patientId: this.selectedPatient ? this.selectedPatient.id : null,
            diseaseId: null,
            orderTime: this.getCurrentDateTime(),
            diseaseType: 'main'
        }
    }
  }
}
</script>

<style scoped>
.patient-diagnosis {
  padding: 20px;
}
.list-group-item-action {
    cursor: pointer;
}
</style>
