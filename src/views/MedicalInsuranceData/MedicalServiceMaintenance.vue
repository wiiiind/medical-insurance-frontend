<!-- src/views/MedicalInsuranceData/MedicalServiceMaintenance.vue -->
<template>
  <div class="medical-service-maintenance container-fluid mt-4">
    <h2 class="mb-4">医疗服务设施数据维护</h2>

    <!-- 功能按钮和搜索 -->
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-success me-2" @click="showAddModal">
          <i class="bi bi-plus-circle me-2"></i>新增服务
        </button>
        <button class="btn btn-danger" @click="deleteSelectedServices" :disabled="selectedServiceIds.length === 0">
          <i class="bi bi-trash-fill me-2"></i>批量删除
        </button>
      </div>
      <div class="d-flex">
        <input type="text" class="form-control me-2" placeholder="按服务名称搜索..." v-model.trim="searchQuery" @keyup.enter="handleSearch">
        <!-- The only change is adding 'flex-shrink-0' to this button -->
        <button class="btn btn-primary flex-shrink-0" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 医疗服务设施数据表格 -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-light">
          <tr>
            <th style="width: 5%;">
              <input class="form-check-input" type="checkbox" @change="toggleSelectAll" :checked="isAllSelected">
            </th>
            <th>医疗类型</th>
            <th>医疗编号</th>
            <th>国家编号</th>
            <th>医疗名称</th>
            <th>医疗信息</th>
            <th>医疗排除</th>
            <th>医疗单位</th>
            <th>医疗价格</th>
            <th>备注</th>
            <th class="text-center" style="width: 12%;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="services.length === 0">
            <td colspan="11" class="text-center text-muted">暂无数据</td>
          </tr>
          <tr v-for="service in services" :key="service.id">
            <td>
              <input class="form-check-input" type="checkbox" :value="service.id" v-model="selectedServiceIds">
            </td>
            <td>{{ service.medicalType }}</td>
            <td>{{ service.medicalNumber }}</td>
            <td>{{ service.countryNumber }}</td>
            <td>{{ service.medicalName }}</td>
            <td>{{ service.medicalInfo }}</td>
            <td>{{ service.medicalExclude }}</td>
            <td>{{ service.medicalUnit }}</td>
            <td>{{ service.medicalPrice }}</td>
            <td>{{ service.remark }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editService(service)">编辑</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteSingleService(service.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <nav aria-label="Page navigation" class="d-flex justify-content-end" v-if="totalPages > 1">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage - 1)">上一页</a>
        </li>
        <li class="page-item" v-for="(page, index) in paginatedPages" :key="index" 
            :class="{ active: pagination.currentPage === page, disabled: page === '...' }">
          <a class="page-link" href="#" @click.prevent="page !== '...' && goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage + 1)">下一页</a>
        </li>
      </ul>
    </nav>

    <!-- 新增/编辑服务模态框 -->
    <div class="modal fade" id="serviceModal" tabindex="-1" aria-labelledby="serviceModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="serviceModalLabel">{{ isEditing ? '编辑服务' : '新增服务' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveService">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="medicalType" class="form-label">医疗类型</label>
                  <input type="text" class="form-control" id="medicalType" v-model="currentService.medicalType" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="medicalName" class="form-label">医疗名称</label>
                  <input type="text" class="form-control" id="medicalName" v-model="currentService.medicalName" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="medicalNumber" class="form-label">医疗编号</label>
                  <input type="text" class="form-control" id="medicalNumber" v-model="currentService.medicalNumber">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="countryNumber" class="form-label">国家编号</label>
                  <input type="text" class="form-control" id="countryNumber" v-model="currentService.countryNumber">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="medicalUnit" class="form-label">医疗单位</label>
                  <input type="text" class="form-control" id="medicalUnit" v-model="currentService.medicalUnit">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="medicalPrice" class="form-label">医疗价格</label>
                  <input type="number" step="0.01" class="form-control" id="medicalPrice" v-model.number="currentService.medicalPrice">
                </div>
              </div>
              <div class="mb-3">
                <label for="medicalInfo" class="form-label">医疗信息</label>
                <textarea class="form-control" id="medicalInfo" v-model="currentService.medicalInfo" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label for="medicalExclude" class="form-label">医疗排除</label>
                <textarea class="form-control" id="medicalExclude" v-model="currentService.medicalExclude" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label for="remark" class="form-label">备注</label>
                <textarea class="form-control" id="remark" v-model="currentService.remark" rows="2"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveService">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Script is unchanged
import { Modal } from 'bootstrap'
import * as medicalServiceApi from '@/api/medicalService.js'

export default {
  name: 'MedicalServiceMaintenance',
  data() {
    return {
      services: [],
      selectedServiceIds: [],
      currentService: {
        id: null,
        medicalType: '',
        medicalNumber: '',
        countryNumber: '',
        medicalName: '',
        medicalInfo: '',
        medicalExclude: '',
        medicalUnit: '',
        medicalPrice: 0,
        remark: ''
      },
      isEditing: false,
      serviceModal: null,
      searchQuery: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    isAllSelected() {
      return this.services.length > 0 && this.selectedServiceIds.length === this.services.length;
    },
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.pageSize)
    },
    paginatedPages() {
      const total = this.totalPages;
      const current = this.pagination.currentPage;
      const maxVisible = 7;
      
      if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      if (current < 5) {
        return [1, 2, 3, 4, 5, '...', total];
      } else if (current > total - 4) {
        const pages = [1, '...'];
        for(let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      } else {
        return [1, '...', current - 1, current, current + 1, '...', total];
      }
    }
  },
  watch: {
    'pagination.currentPage'() {
        this.selectedServiceIds = [];
    }  
  },
  mounted() {
    this.fetchServices()
    this.serviceModal = new Modal(document.getElementById('serviceModal'))
  },
  methods: {
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedServiceIds = this.services.map(s => s.id);
      } else {
        this.selectedServiceIds = [];
      }
    },
    async fetchServices() {
      try {
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          medicalName: this.searchQuery
        }
        const response = await medicalServiceApi.getMedicalServices(params)
        
        if (response.data) {
          this.services = response.data.rows || [];
          this.pagination.total = response.data.total || 0;
        } else {
          this.services = [];
          this.pagination.total = 0;
        }

        this.selectedServiceIds = [];
      } catch (error) {
        console.error('获取医疗服务数据失败:', error)
        alert('获取医疗服务数据失败: ' + error.message)
      }
    },
    handleSearch() {
      this.pagination.currentPage = 1
      this.fetchServices()
    },
    showAddModal() {
      this.isEditing = false
      this.currentService = {
        id: null,
        medicalType: '',
        medicalNumber: '',
        countryNumber: '',
        medicalName: '',
        medicalInfo: '',
        medicalExclude: '',
        medicalUnit: '',
        medicalPrice: 0,
        remark: ''
      }
      this.serviceModal.show()
    },
    async editService(service) {
      this.isEditing = true
      try {
        const response = await medicalServiceApi.getMedicalServiceById(service.id)
        this.currentService = response.data
        this.serviceModal.show()
      } catch (error) {
        console.error('获取医疗服务详情失败:', error)
        alert('获取医疗服务详情失败: ' + error.message)
      }
    },
    async saveService() {
      try {
        if (this.isEditing) {
          await medicalServiceApi.updateMedicalService(this.currentService)
        } else {
          await medicalServiceApi.createMedicalService(this.currentService)
        }
        this.fetchServices()
        this.serviceModal.hide()
      } catch (error) {
        console.error('保存医疗服务失败:', error)
        alert('保存医疗服务失败: ' + error.message)
      }
    },
    async deleteSingleService(id) {
        this.deleteServices([id]);
    },
    async deleteSelectedServices() {
        this.deleteServices(this.selectedServiceIds);
    },
    async deleteServices(ids) {
      if (ids.length === 0) return;
      if (confirm(`确定要删除选中的 ${ids.length} 项服务吗？`)) {
        try {
          await medicalServiceApi.deleteMedicalServices(ids)
          this.fetchServices()
        } catch (error) {
          console.error('删除医疗服务失败:', error)
          alert('删除医疗服务失败: ' + error.message)
        }
      }
    },
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.pagination.currentPage = page
        this.fetchServices()
      }
    }
  }
}
</script>

<style scoped>
/* Style is unchanged */
.medical-service-maintenance {
  padding: 20px;
}
.table-responsive .table {
  table-layout: fixed;
  width: 100%;
}
.table-responsive .table th,
.table-responsive .table td {
  word-wrap: break-word; 
  vertical-align: middle; 
}
</style>