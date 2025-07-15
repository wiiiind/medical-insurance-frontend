<template>
  <div class="drug-reimbursement-ratio-maintenance container-fluid mt-4">
    <h2 class="mb-4">药品报销比例维护</h2>

    <!-- 功能按钮 -->
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-success" @click="showAddModal">
          <i class="bi bi-plus-circle me-2"></i>新增比例
        </button>
      </div>
      <div>
        <button class="btn btn-info" @click="fetchRatios">
          <i class="bi bi-arrow-clockwise me-2"></i>刷新
        </button>
      </div>
    </div>

    <!-- 药品报销比例数据表格 -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-light">
          <tr>
            <th>报销类型</th>
            <th>报销比例 (%)</th>
            <th>说明</th>
            <th>状态</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ratios.length === 0">
            <td colspan="5" class="text-center text-muted">暂无数据</td>
          </tr>
          <tr v-for="ratio in ratios" :key="ratio.id">
            <td>{{ ratio.drugReimbursementType }}</td>
            <td>{{ ratio.drugReimbursementProportion }}</td>
            <td>{{ ratio.drugReimbursementInfo }}</td>
            <td>
              <span :class="['badge', ratio.status === 1 ? 'bg-success' : 'bg-secondary']">
                {{ ratio.status === 1 ? '启用' : '禁用' }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editRatio(ratio)">编辑</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteRatio(ratio.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑比例模态框 -->
    <div class="modal fade" id="ratioModal" tabindex="-1" aria-labelledby="ratioModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ratioModalLabel">{{ isEditing ? '编辑比例' : '新增比例' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRatio">
              <div class="mb-3">
                <label for="drugReimbursementType" class="form-label">报销类型</label>
                <input type="text" class="form-control" id="drugReimbursementType" v-model="currentRatio.drugReimbursementType" required>
              </div>
              <div class="mb-3">
                <label for="drugReimbursementProportion" class="form-label">报销比例 (%)</label>
                <input type="number" class="form-control" id="drugReimbursementProportion" v-model.number="currentRatio.drugReimbursementProportion" required>
              </div>
              <div class="mb-3">
                <label for="drugReimbursementInfo" class="form-label">说明</label>
                <textarea class="form-control" id="drugReimbursementInfo" v-model="currentRatio.drugReimbursementInfo" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">状态</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="statusSwitch" v-model="currentRatio.status" :true-value="1" :false-value="0">
                  <label class="form-check-label" for="statusSwitch">{{ currentRatio.status === 1 ? '启用' : '禁用' }}</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveRatio">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import * as drugReimbursementApi from '@/api/drugReimbursement.js'

export default {
  name: 'DrugReimbursementRatioMaintenance',
  data() {
    return {
      ratios: [],
      currentRatio: {
        id: null,
        drugReimbursementType: '',
        drugReimbursementProportion: 0,
        drugReimbursementInfo: '',
        status: 1
      },
      isEditing: false,
      ratioModal: null
    }
  },
  mounted() {
    this.fetchRatios()
    this.ratioModal = new Modal(document.getElementById('ratioModal'))
  },
  methods: {
    async fetchRatios() {
      try {
        const response = await drugReimbursementApi.getDrugReimbursements()
        this.ratios = response.data.data
      } catch (error) {
        console.error('获取药品报销比例失败:', error)
        alert('获取药品报销比例失败')
      }
    },
    showAddModal() {
      this.isEditing = false
      this.currentRatio = {
        id: null,
        drugReimbursementType: '',
        drugReimbursementProportion: 0,
        drugReimbursementInfo: '',
        status: 1
      }
      this.ratioModal.show()
    },
    editRatio(ratio) {
      this.isEditing = true
      // The API doc doesn't specify a GET by ID, so we edit the existing data directly.
      this.currentRatio = { ...ratio }
      this.ratioModal.show()
    },
    async saveRatio() {
      try {
        if (this.isEditing) {
          await drugReimbursementApi.updateDrugReimbursement(this.currentRatio)
        } else {
          await drugReimbursementApi.createDrugReimbursement(this.currentRatio)
        }
        this.fetchRatios()
        this.ratioModal.hide()
      } catch (error) {
        console.error('保存药品报销比例失败:', error)
        alert('保存药品报销比例失败')
      }
    },
    async deleteRatio(id) {
      if (confirm('确定要删除该报销比例吗？')) {
        try {
          await drugReimbursementApi.deleteDrugReimbursement(id)
          this.fetchRatios()
        } catch (error) {
          console.error('删除药品报销比例失败:', error)
          alert('删除药品报销比例失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.drug-reimbursement-ratio-maintenance {
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
