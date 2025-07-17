<!-- src/views/HospitalDoctorStation/PatientOrders.vue (Final Date Fix) -->
<template>
  <div class="patient-orders container-fluid mt-4">
    <h2 class="mb-4">患者医嘱管理</h2>

    <div class="row">
      <!-- Patient List -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">
            已入院患者列表
          </div>
          <div class="list-group list-group-flush">
            <a href="#" v-for="patient in patients" :key="patient.id" class="list-group-item list-group-item-action"
              :class="{ active: selectedPatient && selectedPatient.id === patient.id }"
              @click.prevent="selectPatient(patient)">
              {{ patient.realName }} - {{ patient.cardNumber }}
            </a>
            <div v-if="patients.length === 0" class="list-group-item text-muted">
              暂无患者
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Section -->
      <div class="col-md-9">
        <div class="card">
          <div class="card-header">
            医嘱详情
          </div>
          <div class="card-body">
            <div v-if="!selectedPatient" class="text-center text-muted">
              请先从左侧选择一位患者
            </div>
            <div v-else>
              <!-- Add Order Form -->
              <div class="row g-3 align-items-center mb-3">
                <div class="col-auto">
                  <label for="orderType" class="col-form-label">医嘱类型</label>
                </div>
                <div class="col-auto">
                  <select class="form-select" id="orderType" v-model="orderType">
                    <option value="drug">药品</option>
                    <option value="treatment">诊疗项目</option>
                    <option value="service">医疗服务</option>
                  </select>
                </div>
                <div class="col">
                  <div class="position-relative" ref="searchWrapper" @focusout="handleFocusOut">
                    <input type="text" class="form-control" placeholder="搜索项目..." v-model="searchQuery"
                      @input="handleInput" @focus="showDrugResults = true" @keydown.down.prevent="navigateDown"
                      @keydown.up.prevent="navigateUp" @keydown.enter.prevent="selectHighlightedItem"
                      @keydown.tab.prevent="handleTab" autocomplete="off">
                    <div v-if="showDrugResults && searchResults.length > 0"
                      class="list-group position-absolute w-100 search-results-container" style="z-index: 1000;">
                      <button v-for="(item, index) in searchResults" :key="item.id" type="button"
                        class="list-group-item list-group-item-action" :class="{ 'active': index === highlightedIndex }"
                        @mousedown="addItemToOrder(item)">
                        {{ item.name }} - {{ item.specifications || item.medicalInfo }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Current Orders -->
              <h5 class="mb-3">待提交医嘱</h5>
              <form @submit.prevent="submitOrders">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>名称</th>
                        <th v-if="orderType === 'drug'" style="width: 90px;">数量</th>
                        <th>医嘱内容</th>
                        <th>用法</th>
                        <th style="width: 150px;">时间</th>
                        <th v-if="orderType === 'drug'" style="width: 150px;">结束时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="newOrders.length === 0">
                        <td :colspan="orderType === 'drug' ? 7 : 5" class="text-center text-muted">请从上方搜索并添加医嘱项目</td>
                      </tr>
                      <tr v-for="(order, index) in newOrders" :key="index">
                        <td>{{ order.name }}</td>
                        <td v-if="order.type === 'drug'"><input type="number" class="form-control form-control-sm"
                            v-model.number="order.orderNumber" min="1"></td>
                        <td><input type="text" class="form-control form-control-sm" v-model="order.doctorOrder"></td>
                        <td><input type="text" class="form-control form-control-sm" v-model="order.useMethod"></td>
                        <td><input type="datetime-local" class="form-control form-control-sm" v-model="order.startTime">
                        </td>
                        <td v-if="order.type === 'drug'"><input type="datetime-local"
                            class="form-control form-control-sm" v-model="order.endTime"></td>
                        <td><button type="button" class="btn btn-sm btn-danger"
                            @click="removeItemFromOrder(index)">X</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="d-flex justify-content-end mt-3">
                  <button type="submit" class="btn btn-primary" :disabled="newOrders.length === 0">提交医嘱</button>
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
// Script has changes
import * as patientOrdersApi from '@/api/patientOrders.js'
import * as medicalServiceApi from '@/api/medicalService.js'
import _ from 'lodash';

export default {
  name: 'PatientOrders',
  data() {
    return {
      patients: [],
      selectedPatient: null,
      orderType: 'drug',
      searchQuery: '',
      userTypedQuery: '',
      searchResults: [],
      newOrders: [],
      showDrugResults: false,
      highlightedIndex: -1,
    }
  },
  watch: {
    orderType() {
      this.searchQuery = '';
      this.searchResults = [];
      this.showDrugResults = false;
      this.newOrders = [];
    }
  },
  mounted() {
    this.fetchAdmittedPatients()
  },
  methods: {
    // Helper function to get YYYY-MM-DDTHH:mm string for the input
    getCurrentDateTime() {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    },
    // *** NEW HELPER FUNCTION: This is the core of the fix ***
    // Converts "YYYY-MM-DDTHH:mm" to "YYYY-MM-DD HH:mm:ss"
    formatDateForBackend(localDateTimeString) {
      if (!localDateTimeString) return null;
      return localDateTimeString.replace('T', ' ') + ':00';
    },
    async fetchAdmittedPatients() {
      try {
        const response = await patientOrdersApi.getAdmittedPatientsForOrders()
        this.patients = response.data || []
      } catch (error) {
        console.error('获取患者列表失败:', error)
      }
    },
    selectPatient(patient) {
      this.selectedPatient = patient
      this.newOrders = []
      this.searchQuery = ''
      this.userTypedQuery = ''
      this.searchResults = []
      this.showDrugResults = false
      this.highlightedIndex = -1
    },
    handleInput() {
      this.userTypedQuery = this.searchQuery;
      this.highlightedIndex = -1;
      this.debouncedSearch();
    },
    debouncedSearch: _.debounce(function () {
      this.searchItems();
    }, 300),
    async searchItems() {
        if (this.userTypedQuery.length < 1) {
            this.searchResults = [];
            this.showDrugResults = false;
            return;
        }
        this.showDrugResults = true;
        try {
            let response;
            let params;

            if (this.orderType === 'drug') {
                params = { medicalName: this.userTypedQuery, chinaName: this.userTypedQuery };
                response = await patientOrdersApi.searchDrugs(params);
            } else if (this.orderType === 'treatment') {
                params = { medicalName: this.userTypedQuery, chinaName: this.userTypedQuery };
                response = await patientOrdersApi.searchTreatments(params);
            } else { // service
                params = { medicalName: this.userTypedQuery };
                response = await medicalServiceApi.getMedicalServices(params);
            }
            const sourceData = response.data.rows || [];
            this.searchResults = sourceData.map(item => ({
                id: item.id,
                name: item.chinaName || item.medicalName,
                specifications: item.specifications,
                medicalInfo: item.medicalInfo,
                type: this.orderType
            }));
        } catch (error) {
            console.error('搜索项目失败:', error);
            this.searchResults = [];
        }
    },
    navigateDown() {
      if (this.highlightedIndex < this.searchResults.length - 1) {
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
      if (this.showDrugResults && this.searchResults.length > 0) {
        this.navigateDown();
        event.preventDefault();
      }
    },
    updatePreview() {
      if (this.highlightedIndex === -1) {
        this.searchQuery = this.userTypedQuery;
      } else {
        const highlightedItem = this.searchResults[this.highlightedIndex];
        this.searchQuery = highlightedItem.name;
      }
    },
    selectHighlightedItem() {
      if (this.highlightedIndex > -1 && this.searchResults[this.highlightedIndex]) {
        this.addItemToOrder(this.searchResults[this.highlightedIndex]);
      }
    },
    addItemToOrder(item) {
      const existingItem = this.newOrders.find(order => order.id === item.id && order.type === item.type);
      if (existingItem) {
        if (existingItem.orderNumber) {
          existingItem.orderNumber++;
        }
      } else {
        this.newOrders.push({
          ...item,
          orderNumber: 1,
          doctorOrder: '',
          useMethod: '',
          startTime: this.getCurrentDateTime(),
          endTime: this.getCurrentDateTime(),
          status: 1
        });
      }
      this.searchQuery = '';
      this.userTypedQuery = '';
      this.searchResults = [];
      this.showDrugResults = false;
      this.highlightedIndex = -1;
    },
    handleFocusOut(event) {
      if (this.$refs.searchWrapper && !this.$refs.searchWrapper.contains(event.relatedTarget)) {
        this.showDrugResults = false;
      }
    },
    removeItemFromOrder(index) {
      this.newOrders.splice(index, 1);
    },
    async submitOrders() {
        if (!this.selectedPatient || this.newOrders.length === 0) return;
        const groupedOrders = _.groupBy(this.newOrders, 'type');
        
        try {
            const promises = [];
            if (groupedOrders.drug) {
                groupedOrders.drug.forEach(order => {
                    const singleOrderPayload = { 
                        patientId: this.selectedPatient.id, 
                        drugId: order.id, 
                        // Using the new helper function
                        startTime: this.formatDateForBackend(order.startTime), 
                        endTime: this.formatDateForBackend(order.endTime), 
                        doctorOrder: order.doctorOrder, 
                        orderNumber: order.orderNumber, 
                        useMethod: order.useMethod, 
                        status: order.status 
                    };
                    // As requested, logging the payload
                    console.log('Sending DRUG payload:', singleOrderPayload);
                    promises.push(patientOrdersApi.saveDrugOrders(singleOrderPayload));
                });
            }

            if (groupedOrders.treatment) {
                groupedOrders.treatment.forEach(order => {
                    const singleOrderPayload = { 
                        patientId: this.selectedPatient.id, 
                        diagnosisId: order.id, 
                        // Using the new helper function
                        orderTime: this.formatDateForBackend(order.startTime), 
                        doctorOrder: order.doctorOrder, 
                        useMethod: order.useMethod, 
                        status: order.status 
                    };
                    console.log('Sending TREATMENT payload:', singleOrderPayload);
                    promises.push(patientOrdersApi.saveTreatmentOrders(singleOrderPayload));
                });
            }

            if (groupedOrders.service) {
                groupedOrders.service.forEach(order => {
                    const singleOrderPayload = { 
                        patientId: this.selectedPatient.id, 
                        medicalId: order.id, 
                        // Using the new helper function
                        orderTime: this.formatDateForBackend(order.startTime), 
                        doctorOrder: order.doctorOrder, 
                        useMethod: order.useMethod, 
                        status: order.status 
                    };
                    console.log('Sending SERVICE payload:', singleOrderPayload);
                    promises.push(patientOrdersApi.saveServiceOrders(singleOrderPayload));
                });
            }
            
            await Promise.all(promises);
            alert('医嘱提交成功！');
            this.newOrders = [];
        } catch (error) {
            console.error('提交医嘱失败:', error);
            alert('提交医嘱失败: ' + error.message);
        }
    }
  }
}
</script>

<style scoped>
/* Unchanged styles */
.patient-orders {
  padding: 20px;
}
.list-group-item-action {
  cursor: pointer;
}
.table-responsive .table {
  table-layout: auto;
  width: 100%;
}
.table-responsive .table th,
.table-responsive .table td {
  word-wrap: break-word;
  vertical-align: middle;
}
.search-results-container {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: .25rem;
}
</style>