<template>
  <div class="patient-diagnosis container-fluid mt-4">
    <h2 class="mb-4">患者诊断</h2>

    <div class="row">
      <!-- 分栏已调整为 col-md-3 -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">
            已入院患者列表
          </div>
          <div class="list-group list-group-flush">
             <a href="#" v-for="patient in patients" :key="patient.id"
               class="list-group-item list-group-item-action"
               :class="{ active: selectedPatient && selectedPatient.id === patient.id }"
               @click.prevent="selectPatient(patient)">
               {{ patient.realName }} - {{ patient.cardNumber }}
            </a>
            <div v-if="patients.length === 0" class="list-group-item text-muted">
              暂无已入院患者
            </div>
          </div>
        </div>
      </div>

      <!-- 分栏已调整为 col-md-9 -->
      <div class="col-md-9">
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

                <!-- 疾病名称搜索 (已集成滚动条功能) -->
                <div class="mb-3 position-relative">
                  <label for="diseaseName" class="form-label">疾病名称</label>
                  <input type="text" class="form-control" id="diseaseName" v-model="diseaseSearchQuery" 
                         @input="debouncedSearchDisease" @blur="hideSearchResults" autocomplete="off" placeholder="输入疾病名称进行搜索...">
                  
                  <div v-if="diseaseSearchResults.length > 0 && showResults" 
                       class="list-group position-absolute w-100 search-results-container" 
                       style="z-index: 1000;">
                    <button v-for="disease in diseaseSearchResults" :key="disease.id" type="button" 
                            class="list-group-item list-group-item-action" @mousedown="selectDisease(disease)">
                      {{ disease.diseaseName }} ({{ disease.diseaseICD }})
                    </button>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="orderTime" class="form-label">诊断时间</label>
                  <input type="datetime-local" class="form-control" id="orderTime" v-model="currentDiagnosis.orderTime" required>
                </div>

                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-primary" :disabled="!currentDiagnosis.diseaseId">保存诊断</button>
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
import * as diagnosisApi from '@/api/diagnosis.js';
import * as patientOrdersApi from '@/api/patientOrders.js';
import _ from 'lodash';

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
      },
      diseaseSearchQuery: '',
      diseaseSearchResults: [],
      showResults: false, // 新增状态，控制结果列表的显示
    };
  },
  mounted() {
    this.fetchPatients();
  },
  methods: {
    getCurrentDateTime() {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    },
    async fetchPatients() {
      try {
        const response = await patientOrdersApi.getAdmittedPatientsForOrders();
        this.patients = response.data.data;
      } catch (error) {
        console.error('获取患者列表失败:', error);
      }
    },
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.resetCurrentDiagnosis();
    },
    debouncedSearchDisease: _.debounce(function() {
      this.searchDiseases();
    }, 300),
    async searchDiseases() {
      if (this.diseaseSearchQuery.length < 1) {
        this.diseaseSearchResults = [];
        this.showResults = false;
        return;
      }
      try {
        // 调用指向 /other 的 API
        const response = await diagnosisApi.searchDiseases({ diseaseName: this.diseaseSearchQuery });
        this.diseaseSearchResults = response.data.data.rows;
        this.showResults = true;
      } catch (error) {
        console.error('搜索疾病失败:', error);
        this.diseaseSearchResults = [];
        this.showResults = false;
      }
    },
    selectDisease(disease) {
      this.currentDiagnosis.diseaseId = disease.id;
      this.diseaseSearchQuery = disease.diseaseName;
      this.showResults = false;
    },
    hideSearchResults() {
      setTimeout(() => {
        this.showResults = false;
      }, 150);
    },
    async saveCurrentDiagnosis() {
      if (!this.selectedPatient || !this.currentDiagnosis.diseaseId) {
        alert('请先选择一位患者并选择一个诊断疾病');
        return;
      }
      
      const payload = { ...this.currentDiagnosis, patientId: this.selectedPatient.id };
      
      const apiCallMap = {
        admission: diagnosisApi.saveAdmissionDiagnosis,
        main: diagnosisApi.saveMainDiagnosis,
        other: diagnosisApi.saveOtherDiagnosis,
      };

      const apiCall = apiCallMap[this.currentDiagnosis.diseaseType];
      if (!apiCall) {
        alert('未知的诊断类型');
        return;
      }

      try {
        await apiCall(payload);
        alert('诊断信息保存成功！');
        this.resetCurrentDiagnosis();
      } catch (error) {
        console.error('保存诊断信息失败:', error);
        alert('保存诊断信息失败');
      }
    },
    resetCurrentDiagnosis() {
      this.currentDiagnosis = {
        patientId: this.selectedPatient ? this.selectedPatient.id : null,
        diseaseId: null,
        orderTime: this.getCurrentDateTime(),
        diseaseType: 'main'
      };
      this.diseaseSearchQuery = '';
      this.diseaseSearchResults = [];
      this.showResults = false;
    },
  },
};
</script>

<style scoped>
.patient-diagnosis {
  padding: 20px;
}
.list-group-item-action {
  cursor: pointer;
}

/* 为搜索结果容器添加滚动条样式 */
.search-results-container {
  max-height: 240px; 
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: .25rem;
}
</style>