<template>
  <div class="drug-maintenance container-fluid mt-4">
    <h2 class="mb-4">医保药品数据维护</h2>

    <!-- 功能按钮和搜索 -->
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-success" @click="showAddModal">
          <i class="bi bi-plus-circle me-2"></i>新增药品
        </button>
      </div>
      <div class="d-flex">
        <input type="text" class="form-control me-2" placeholder="按药品名称搜索..." v-model.trim="searchQuery" @keyup.enter="handleSearch">
        <button class="btn btn-primary" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 药品数据表格 -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-light">
          <tr>
            <th>
              <input class="form-check-input" type="checkbox" value="">
            </th>
            <th>医保类型</th>
            <th>中文名称</th>
            <th>商品名</th>
            <th>规格</th>
            <th>单位</th>
            <th>生产企业</th>
            <th>价格</th>
            <th>备注</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="drugs.length === 0">
            <td colspan="10" class="text-center text-muted">暂无数据</td>
          </tr>
          <tr v-for="drug in drugs" :key="drug.id">
            <td>
              <input class="form-check-input" type="checkbox" :value="drug.id">
            </td>
            <td>{{ drug.insuranceType }}</td>
            <td>{{ drug.chinaName }}</td>
            <td>{{ drug.goodsName }}</td>
            <td>{{ drug.specifications }}</td>
            <td>{{ drug.drugUnit }}</td>
            <td>{{ drug.drugManufacturer }}</td>
            <td>{{ drug.drugPrice }}</td>
            <td>{{ drug.remarks }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editDrug(drug)">编辑</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteDrug(drug.id)">删除</button>
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
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: pagination.currentPage === page }">
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage + 1)">下一页</a>
        </li>
      </ul>
    </nav>

    <!-- 新增/编辑药品模态框 -->
    <div class="modal fade" id="drugModal" tabindex="-1" aria-labelledby="drugModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="drugModalLabel">{{ isEditing ? '编辑药品' : '新增药品' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveDrug">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="insuranceType" class="form-label">医保类型</label>
                  <input type="text" class="form-control" id="insuranceType" v-model="currentDrug.insuranceType" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="chinaName" class="form-label">中文名称</label>
                  <input type="text" class="form-control" id="chinaName" v-model="currentDrug.chinaName" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="goodsName" class="form-label">商品名</label>
                  <input type="text" class="form-control" id="goodsName" v-model="currentDrug.goodsName">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="specifications" class="form-label">规格</label>
                  <input type="text" class="form-control" id="specifications" v-model="currentDrug.specifications">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="drugUnit" class="form-label">单位</label>
                  <input type="text" class="form-control" id="drugUnit" v-model="currentDrug.drugUnit">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="drugPrice" class="form-label">价格</label>
                  <input type="number" step="0.01" class="form-control" id="drugPrice" v-model.number="currentDrug.drugPrice">
                </div>
              </div>
              <div class="mb-3">
                <label for="drugManufacturer" class="form-label">生产企业</label>
                <input type="text" class="form-control" id="drugManufacturer" v-model="currentDrug.drugManufacturer">
              </div>
              <div class="mb-3">
                <label for="remarks" class="form-label">备注</label>
                <textarea class="form-control" id="remarks" v-model="currentDrug.remarks" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveDrug">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import * as drugApi from '@/api/drug.js'

export default {
  name: 'DrugMaintenance',
  data() {
    return {
      drugs: [],
      currentDrug: {
        id: null,
        insuranceType: '',
        chinaName: '',
        goodsName: '',
        specifications: '',
        drugUnit: '',
        drugManufacturer: '',
        drugPrice: 0,
        remarks: ''
      },
      isEditing: false,
      drugModal: null,
      searchQuery: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.pageSize)
    }
  },
  mounted() {
    this.fetchDrugs()
    this.drugModal = new Modal(document.getElementById('drugModal'))
  },
  methods: {
    async fetchDrugs() {
      try {
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          drugName: this.searchQuery
        }
        const response = await drugApi.getDrugs(params)
        this.drugs = response.data.data.rows
        this.pagination.total = response.data.data.total
      } catch (error) {
        console.error('获取药品数据失败:', error)
        alert('获取药品数据失败')
      }
    },
    handleSearch() {
      this.pagination.currentPage = 1
      this.fetchDrugs()
    },
    showAddModal() {
      this.isEditing = false
      this.currentDrug = {
        id: null,
        insuranceType: '',
        chinaName: '',
        goodsName: '',
        specifications: '',
        drugUnit: '',
        drugManufacturer: '',
        drugPrice: 0,
        remarks: ''
      }
      this.drugModal.show()
    },
    async editDrug(drug) {
      this.isEditing = true
      try {
        const response = await drugApi.getDrugById(drug.id)
        this.currentDrug = response.data.data
        this.drugModal.show()
      } catch (error) {
        console.error('获取药品详情失败:', error)
        alert('获取药品详情失败')
      }
    },
    async saveDrug() {
      try {
        if (this.isEditing) {
          await drugApi.updateDrug(this.currentDrug)
        } else {
          await drugApi.createDrug(this.currentDrug)
        }
        this.fetchDrugs()
        this.drugModal.hide()
      } catch (error) {
        console.error('保存药品失败:', error)
        alert('保存药品失��')
      }
    },
    async deleteDrug(id) {
      if (confirm('确定要删除该药品吗？')) {
        try {
          await drugApi.deleteDrugs([id])
          this.fetchDrugs()
        } catch (error) {
          console.error('删除药品失败:', error)
          alert('删除药品失败')
        }
      }
    },
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.pagination.currentPage = page
        this.fetchDrugs()
      }
    }
  }
}
</script>

<style scoped>
.drug-maintenance {
  padding: 20px;
}
</style>