<template>
  <div class="hospital-reimbursement-ratio-maintenance container-fluid mt-4">
    <h2 class="mb-4">医院报销比例维护</h2>

    <ul class="nav nav-tabs" id="hospitalLevelTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="level1-tab" data-bs-toggle="tab" data-bs-target="#level1" type="button" role="tab" aria-controls="level1" aria-selected="true" @click="switchLevel(1)">一级医院</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="level2-tab" data-bs-toggle="tab" data-bs-target="#level2" type="button" role="tab" aria-controls="level2" aria-selected="false" @click="switchLevel(2)">二级医院</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="level3-tab" data-bs-toggle="tab" data-bs-target="#level3" type="button" role="tab" aria-controls="level3" aria-selected="false" @click="switchLevel(3)">三级医院</button>
      </li>
    </ul>

    <div class="tab-content" id="hospitalLevelTabContent">
      <div v-for="level in [1, 2, 3]" :key="level" :class="['tab-pane', 'fade', { 'show active': activeLevel === level }]" :id="`level${level}`" role="tabpanel">
        <div class="d-flex justify-content-between align-items-center my-3">
          <h4 class="mb-0">{{ level }}级医院报销比例</h4>
          <div>
            <button class="btn btn-success me-2" @click="showAddModal">新增比例</button>
            <button class="btn btn-info" @click="fetchRatios">刷新</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-light">
              <tr>
                <th>人员类别</th>
                <th>起付线</th>
                <th>最高支付线</th>
                <th>报销比例 (%)</th>
                <th>状态</th>
                <th class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="ratios[level].length === 0">
                <td colspan="6" class="text-center text-muted">暂无数据</td>
              </tr>
              <tr v-for="ratio in ratios[level]" :key="ratio.id">
                <td>{{ ratio.peopleType }}</td>
                <td>{{ ratio.minPayLevel }}</td>
                <td>{{ ratio.maxPayLevel }}</td>
                <td>{{ ratio.payProportion }}</td>
                <td>
                  <span :class="['badge', ratio.status === '1' ? 'bg-success' : 'bg-secondary']">
                    {{ ratio.status === '1' ? '启用' : '禁用' }}
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
      </div>
    </div>

    <!-- 新增/编辑比例模态框 -->
    <div class="modal fade" id="ratioModal" tabindex="-1" aria-labelledby="ratioModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ratioModalLabel">{{ isEditing ? '编辑比例' : `新增${activeLevel}级医院比例` }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRatio">
              <div class="mb-3">
                <label for="peopleType" class="form-label">人员类别</label>
                <input type="text" class="form-control" id="peopleType" v-model="currentRatio.peopleType" required>
              </div>
              <div class="mb-3">
                <label for="minPayLevel" class="form-label">起付线</label>
                <input type="text" class="form-control" id="minPayLevel" v-model="currentRatio.minPayLevel" required>
              </div>
              <div class="mb-3">
                <label for="maxPayLevel" class="form-label">最高支付线</label>
                <input type="text" class="form-control" id="maxPayLevel" v-model="currentRatio.maxPayLevel" required>
              </div>
              <div class="mb-3">
                <label for="payProportion" class="form-label">报销比例 (%)</label>
                <input type="text" class="form-control" id="payProportion" v-model="currentRatio.payProportion" required>
              </div>
              <div class="mb-3">
                <label class="form-label">状态</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="statusSwitch" v-model="currentRatio.status" true-value="1" false-value="0">
                  <label class="form-check-label" for="statusSwitch">{{ currentRatio.status === '1' ? '启用' : '禁用' }}</label>
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
import * as hospReimbursementApi from '@/api/hospitalReimbursement.js'

export default {
  name: 'HospitalReimbursementRatioMaintenance',
  data() {
    return {
      activeLevel: 1,
      ratios: {
        1: [],
        2: [],
        3: []
      },
      currentRatio: {
        id: null,
        minPayLevel: '',
        maxPayLevel: '',
        peopleType: '',
        payProportion: '',
        hospitalLevel: '',
        status: '1'
      },
      isEditing: false,
      ratioModal: null,
      apiMap: {
        1: {
          get: hospReimbursementApi.getLevel1Ratios,
          create: hospReimbursementApi.createLevel1Ratio,
          update: hospReimbursementApi.updateLevel1Ratio,
          delete: hospReimbursementApi.deleteLevel1Ratio
        },
        2: {
          get: hospReimbursementApi.getLevel2Ratios,
          create: hospReimbursementApi.createLevel2Ratio,
          update: hospReimbursementApi.updateLevel2Ratio,
          delete: hospReimbursementApi.deleteLevel2Ratio
        },
        3: {
          get: hospReimbursementApi.getLevel3Ratios,
          create: hospReimbursementApi.createLevel3Ratio,
          update: hospReimbursementApi.updateLevel3Ratio,
          delete: hospReimbursementApi.deleteLevel3Ratio
        }
      }
    }
  },
  mounted() {
    this.fetchRatios()
    this.ratioModal = new Modal(document.getElementById('ratioModal'))
    
    // Add event listeners for tab switching to refresh data
    const tabEls = document.querySelectorAll('button[data-bs-toggle="tab"]')
    tabEls.forEach(tabEl => {
      tabEl.addEventListener('shown.bs.tab', (event) => {
        const level = parseInt(event.target.id.replace('level', ''))
        this.activeLevel = level
        this.fetchRatios()
      })
    })
  },
  methods: {
    async fetchRatios() {
      try {
        const response = await this.apiMap[this.activeLevel].get()
        this.ratios[this.activeLevel] = response.data.data
      } catch (error) {
        console.error(`获取${this.activeLevel}级医院报销比例失败:`, error)
        alert(`获取${this.activeLevel}级医院报销比例失败`)
      }
    },
    switchLevel(level) {
        this.activeLevel = level;
        this.fetchRatios();
    },
    showAddModal() {
      this.isEditing = false
      this.currentRatio = {
        id: null,
        minPayLevel: '',
        maxPayLevel: '',
        peopleType: '',
        payProportion: '',
        hospitalLevel: String(this.activeLevel),
        status: '1'
      }
      this.ratioModal.show()
    },
    editRatio(ratio) {
      this.isEditing = true
      this.currentRatio = { ...ratio }
      this.ratioModal.show()
    },
    async saveRatio() {
      try {
        const api = this.apiMap[this.activeLevel]
        if (this.isEditing) {
          await api.update(this.currentRatio)
        } else {
          await api.create(this.currentRatio)
        }
        this.fetchRatios()
        this.ratioModal.hide()
      } catch (error) {
        console.error('保存报销比例失败:', error)
        alert('保存报销比例失败')
      }
    },
    async deleteRatio(id) {
      if (confirm('确定要删除该报销比例吗？')) {
        try {
          await this.apiMap[this.activeLevel].delete(id)
          this.fetchRatios()
        } catch (error) {
          console.error('删除报销比例失败:', error)
          alert('删除报销比例失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.hospital-reimbursement-ratio-maintenance {
  padding: 20px;
}
.nav-tabs .nav-link {
    cursor: pointer;
}
</style>
