<template>
  <div class="treatment-item-maintenance container-fluid mt-4">
    <h2 class="mb-4">诊疗项目数据维护</h2>

    <!-- 功能按钮和搜索 -->
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-success me-2" @click="showAddModal">
          <i class="bi bi-plus-circle me-2"></i>新增项目
        </button>
        <button class="btn btn-danger" @click="deleteSelectedItems" :disabled="selectedItemIds.length === 0">
          <i class="bi bi-trash-fill me-2"></i>批量删除
        </button>
      </div>
      <div class="d-flex">
        <input type="text" class="form-control me-2" placeholder="按项目名称搜索..." v-model.trim="searchQuery" @keyup.enter="handleSearch">
        <button class="btn btn-primary" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 诊疗项目数据表格 -->
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
          <tr v-if="treatmentItems.length === 0">
            <td colspan="11" class="text-center text-muted">暂无数据</td>
          </tr>
          <tr v-for="item in treatmentItems" :key="item.id">
            <td>
              <input class="form-check-input" type="checkbox" :value="item.id" v-model="selectedItemIds">
            </td>
            <td>{{ item.medicalType }}</td>
            <td>{{ item.medicalNumber }}</td>
            <td>{{ item.countryNumber }}</td>
            <td>{{ item.medicalName }}</td>
            <td>{{ item.medicalInfo }}</td>
            <td>{{ item.medicalExclude }}</td>
            <td>{{ item.medicalUnit }}</td>
            <td>{{ item.medicalPrice }}</td>
            <td>{{ item.remark }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editTreatmentItem(item)">编辑</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteSingleItem(item.id)">删除</button>
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

    <!-- 新增/编辑诊疗项目模态框 -->
    <div class="modal fade" id="treatmentItemModal" tabindex="-1" aria-labelledby="treatmentItemModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="treatmentItemModalLabel">{{ isEditing ? '编辑诊疗项目' : '新增诊疗项目' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTreatmentItem">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="medicalType" class="form-label">医疗类型</label>
                  <input type="text" class="form-control" id="medicalType" v-model="currentTreatmentItem.medicalType" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="medicalName" class="form-label">医疗名称</label>
                  <input type="text" class="form-control" id="medicalName" v-model="currentTreatmentItem.medicalName" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="medicalNumber" class="form-label">医疗编号</label>
                  <input type="text" class="form-control" id="medicalNumber" v-model="currentTreatmentItem.medicalNumber">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="countryNumber" class="form-label">国家编号</label>
                  <input type="text" class="form-control" id="countryNumber" v-model="currentTreatmentItem.countryNumber">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="medicalUnit" class="form-label">医疗单位</label>
                  <input type="text" class="form-control" id="medicalUnit" v-model="currentTreatmentItem.medicalUnit">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="medicalPrice" class="form-label">医疗价格</label>
                  <input type="number" step="0.01" class="form-control" id="medicalPrice" v-model.number="currentTreatmentItem.medicalPrice">
                </div>
              </div>
              <div class="mb-3">
                <label for="medicalInfo" class="form-label">医疗信息</label>
                <textarea class="form-control" id="medicalInfo" v-model="currentTreatmentItem.medicalInfo" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label for="medicalExclude" class="form-label">医疗排除</label>
                <textarea class="form-control" id="medicalExclude" v-model="currentTreatmentItem.medicalExclude" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label for="remark" class="form-label">备注</label>
                <textarea class="form-control" id="remark" v-model="currentTreatmentItem.remark" rows="2"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveTreatmentItem">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import * as treatmentApi from '@/api/treatment.js'

export default {
  name: 'TreatmentItemMaintenance',
  data() {
    return {
      treatmentItems: [],
      selectedItemIds: [],
      currentTreatmentItem: {
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
      treatmentItemModal: null,
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
      return this.treatmentItems.length > 0 && this.selectedItemIds.length === this.treatmentItems.length;
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
        this.selectedItemIds = [];
    }  
  },
  mounted() {
    this.fetchTreatmentItems()
    this.treatmentItemModal = new Modal(document.getElementById('treatmentItemModal'))
  },
  methods: {
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItemIds = this.treatmentItems.map(item => item.id);
      } else {
        this.selectedItemIds = [];
      }
    },
    async fetchTreatmentItems() {
      try {
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          medicalName: this.searchQuery
        }
        const response = await treatmentApi.getTreatments(params)
        this.treatmentItems = response.data.data.rows
        this.pagination.total = response.data.data.total
        this.selectedItemIds = [];
      } catch (error) {
        console.error('获取诊疗项目数据失败:', error)
        alert('获取诊疗项目数��失败')
      }
    },
    handleSearch() {
      this.pagination.currentPage = 1
      this.fetchTreatmentItems()
    },
    showAddModal() {
      this.isEditing = false
      this.currentTreatmentItem = {
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
      this.treatmentItemModal.show()
    },
    async editTreatmentItem(item) {
      this.isEditing = true
      try {
        const response = await treatmentApi.getTreatmentById(item.id)
        this.currentTreatmentItem = response.data.data
        this.treatmentItemModal.show()
      } catch (error) {
        console.error('获取诊疗项目详情失败:', error)
        alert('获取诊疗项目详情失败')
      }
    },
    async saveTreatmentItem() {
      try {
        if (this.isEditing) {
          await treatmentApi.updateTreatment(this.currentTreatmentItem)
        } else {
          await treatmentApi.createTreatment(this.currentTreatmentItem)
        }
        this.fetchTreatmentItems()
        this.treatmentItemModal.hide()
      } catch (error) {
        console.error('保存诊疗项目失败:', error)
        alert('保存诊疗项目��败')
      }
    },
    async deleteSingleItem(id) {
        this.deleteItems([id]);
    },
    async deleteSelectedItems() {
        this.deleteItems(this.selectedItemIds);
    },
    async deleteItems(ids) {
      if (ids.length === 0) return;
      if (confirm(`确定要删除选中的 ${ids.length} 项吗？`)) {
        try {
          await treatmentApi.deleteTreatments(ids)
          this.fetchTreatmentItems()
        } catch (error) {
          console.error('删除诊疗项目失败:', error)
          alert('删除诊疗项目失败')
        }
      }
    },
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.pagination.currentPage = page
        this.fetchTreatmentItems()
      }
    }
  }
}
</script>

<style scoped>
.treatment-item-maintenance {
  padding: 20px;
}

/* 关键修复：优化表格布局 */
.table-responsive .table {
  /* 强制表格宽度为100%，并使用固定布局算法，让浏览器自动计算列宽 */
  table-layout: fixed;
  width: 100%;
}

.table-responsive .table th,
.table-responsive .table td {
  /* 允许长单词或字符串在单元格内换行，防止内容撑破表格 */
  word-wrap: break-word; 
  /* 垂直居中对齐，更美观 */
  vertical-align: middle; 
}
</style>
