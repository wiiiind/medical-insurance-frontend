<!-- src/views/HospitalDoctorStation/PatientDiagnosis.vue (最终修正版) -->
<template>
  <div class="patient-diagnosis container-fluid mt-4">
    <h2 class="mb-4">患者诊断</h2>

    <div class="row">
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
              <form @submit.prevent="saveCurrentDiagnosis">
                <div class="mb-3">
                  <label for="diseaseType" class="form-label">诊断类型</label>
                  <!-- 1. 关键修改: 将 value 改为数字，并使用 v-model.number -->
                  <select class="form-select" id="diseaseType" v-model.number="currentDiagnosis.diseaseType" required>
                      <option value="1">入院诊断</option>
                      <option value="2">主要诊断</option>
                      <option value="3">其他诊断</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="diseaseName" class="form-label">疾病名称</label>
                  <div class="position-relative" ref="searchWrapper" @focusout="handleFocusOut">
                    <input type="text" class="form-control" id="diseaseName" v-model="diseaseSearchQuery" 
                           @input="handleInput" @focus="showResults = true"
                           @keydown.down.prevent="navigateDown" @keydown.up.prevent="navigateUp" @keydown.enter.prevent="selectHighlightedItem" @keydown.tab.prevent="handleTab"
                           autocomplete="off">
                    
                    <div v-if="diseaseSearchResults.length > 0 && showResults" 
                         class="list-group position-absolute w-100 search-results-container" 
                         style="z-index: 1000;">
                      <button v-for="(disease, index) in diseaseSearchResults" :key="disease.id" type="button" 
                              class="list-group-item list-group-item-action" 
                              :class="{ 'active': index === highlightedIndex }" @mousedown="selectDisease(disease)">
                        {{ disease.diseaseName }} ({{ disease.diseaseICD }})
                      </button>
                    </div>
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
        // 2. 关键修改: 默认值改为数字 2 (代表主要诊断)
        diseaseType: 2 
      },
      diseaseSearchQuery: '',
      userTypedQuery: '',
      diseaseSearchResults: [],
      showResults: false,
      highlightedIndex: -1,
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
    formatDateForBackend(localDateTimeString) {
      if (!localDateTimeString) return null;
      return localDateTimeString.replace('T', ' ') + ':00';
    },
    async fetchPatients() {
      try {
        const response = await patientOrdersApi.getAdmittedPatientsForOrders();
        this.patients = response.data || [];
      } catch (error) {
        console.error('获取患者列表失败:', error);
      }
    },
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.resetCurrentDiagnosis();
    },
    handleInput() {
      this.userTypedQuery = this.diseaseSearchQuery;
      this.highlightedIndex = -1;
      this.debouncedSearchDisease();
    },
    debouncedSearchDisease: _.debounce(function() {
      this.searchDiseases();
    }, 300),
    async searchDiseases() {
      if (this.userTypedQuery.length < 1) {
        this.diseaseSearchResults = [];
        this.showResults = false;
        return;
      }
      try {
        const response = await diagnosisApi.searchDiseases({ diseaseName: this.userTypedQuery });
        this.diseaseSearchResults = response.data || [];
        this.showResults = true;
      } catch (error) {
        console.error('搜索疾病失败:', error);
        this.diseaseSearchResults = [];
        this.showResults = false;
      }
    },
    navigateDown() {
      if (this.highlightedIndex < this.diseaseSearchResults.length - 1) {
        this.highlightedIndex++;
        this.updatePreview();
      }
    },
    navigateUp() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
        this.updatePreview();
      }
    },
    handleTab(event) {
      if (this.showResults && this.diseaseSearchResults.length > 0) {
        this.navigateDown();
        event.preventDefault();
      }
    },
    updatePreview() {
      if (this.highlightedIndex === -1) {
        this.diseaseSearchQuery = this.userTypedQuery;
      } else {
        const highlightedItem = this.diseaseSearchResults[this.highlightedIndex];
        this.diseaseSearchQuery = highlightedItem.diseaseName;
      }
    },
    selectHighlightedItem() {
      if (this.highlightedIndex > -1 && this.diseaseSearchResults[this.highlightedIndex]) {
        this.selectDisease(this.diseaseSearchResults[this.highlightedIndex]);
      }
    },
    selectDisease(disease) {
      this.currentDiagnosis.diseaseId = disease.id;
      this.diseaseSearchQuery = disease.diseaseName;
      this.showResults = false;
      this.userTypedQuery = '';
      this.highlightedIndex = -1;
    },
    handleFocusOut(event) {
      if (this.$refs.searchWrapper && !this.$refs.searchWrapper.contains(event.relatedTarget)) {
        this.showResults = false;
      }
    },
    async saveCurrentDiagnosis() {
      if (!this.selectedPatient || !this.currentDiagnosis.diseaseId) {
        alert('请先选择一位患者并选择一个诊断疾病');
        return;
      }
      
      const payload = { 
        patientId: this.selectedPatient.id,
        diseaseId: this.currentDiagnosis.diseaseId,
        orderTime: this.formatDateForBackend(this.currentDiagnosis.orderTime),
        diseaseType: this.currentDiagnosis.diseaseType
      };
      
      // 3. 关键修改: 使用数字作为 key 来选择正确的 API 函数
      const apiCallMap = {
        1: diagnosisApi.saveAdmissionDiagnosis,
        2: diagnosisApi.saveMainDiagnosis,
        3: diagnosisApi.saveOtherDiagnosis,
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
        alert('保存诊断信息失败: ' + error.message);
      }
    },
    resetCurrentDiagnosis() {
      this.currentDiagnosis = {
        patientId: this.selectedPatient ? this.selectedPatient.id : null,
        diseaseId: null,
        orderTime: this.getCurrentDateTime(),
        // 4. 关键修改: 重置时同样使用数字 2
        diseaseType: 2
      };
      this.diseaseSearchQuery = '';
      this.userTypedQuery = '';
      this.diseaseSearchResults = [];
      this.showResults = false;
      this.highlightedIndex = -1;
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
.search-results-container {
  max-height: 240px; 
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: .25rem;
}
</style>