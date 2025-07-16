<template>
  <div class="hospital-reimbursement-ratio-maintenance p-4">
    <h2 class="mb-4">医院报销比例维护</h2>

    <!-- Tab 导航 -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="level in [1, 2, 3]" :key="`tab-${level}`">
        <a class="nav-link" :class="{ active: activeLevel === level }" href="#" @click.prevent="switchLevel(level)">
          {{ level }}级医院
        </a>
      </li>
    </ul>

    <!-- 操作按钮 -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-success" @click="showAddModal">新增比例</button>
    </div>

    <!-- 数据表格 -->
    <table class="table table-striped table-hover">
      <thead class="table-light">
        <tr>
          <th>人员类别</th>
          <th>起付线</th>
          <th>最高支付线</th>
          <th>报销比例</th>
          <th>状态</th>
          <th class="text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="text-center">加载中...</td>
        </tr>
        <tr v-else-if="ratios.length === 0">
          <td colspan="6" class="text-center text-muted">暂无数据</td>
        </tr>
        <tr v-for="ratio in ratios" :key="ratio.id">
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
            <button class="btn btn-sm btn-outline-primary me-2" @click="showEditModal(ratio)">编辑</button>
            <button class="btn btn-sm btn-outline-danger" @click="handleDelete(ratio.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增/编辑模态框 -->
    <div class="modal fade" id="ratioModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? '编辑比例' : `新增${activeLevel}级医院比例` }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSave">
              <div class="mb-3">
                <label class="form-label">人员类别</label>
                <input type="text" class="form-control" v-model="currentRatio.peopleType" required>
              </div>
              <div class="mb-3">
                <label class="form-label">起付线</label>
                <input type="text" class="form-control" v-model="currentRatio.minPayLevel" required>
              </div>
              <div class="mb-3">
                <label class="form-label">最高支付线</label>
                <input type="text" class="form-control" v-model="currentRatio.maxPayLevel" required>
              </div>
              <div class="mb-3">
                <label class="form-label">报销比例</label>
                <input type="text" class="form-control" v-model="currentRatio.payProportion" required>
              </div>
              <div class="mb-3">
                <label class="form-label">状态</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="currentRatio.status" true-value="1" false-value="0">
                  <label class="form-check-label">{{ currentRatio.status === '1' ? '启用' : '禁用' }}</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="handleSave">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { getHospitalRatio, addHospitalRatio, updateHospitalRatio, deleteHospitalRatio } from '@/api/maintenance.js';

export default {
  name: 'HospitalReimbursementRatioMaintenance',
  data() {
    return {
      loading: false,
      activeLevel: 1,
      ratios: [],
      currentRatio: {},
      isEditing: false,
      modalInstance: null,
    };
  },
  mounted() {
    this.fetchRatios();
    this.modalInstance = new Modal(document.getElementById('ratioModal'));
  },
  methods: {
    async fetchRatios() {
      this.loading = true;
      try {
        const response = await getHospitalRatio(this.activeLevel);
        if (response.data && response.data.code === 1) { // 假设成功码为1
          this.ratios = response.data.data;
        } else {
          this.ratios = [];
        }
      } catch (error) {
        console.error(`获取数据失败:`, error);
        this.ratios = [];
      } finally {
        this.loading = false;
      }
    },
    switchLevel(level) {
      this.activeLevel = level;
      this.fetchRatios();
    },
    resetCurrentRatio() {
      this.currentRatio = {
        id: null,
        minPayLevel: '',
        maxPayLevel: '',
        peopleType: '',
        payProportion: '',
        hospitalLevel: String(this.activeLevel),
        status: '1',
      };
    },
    showAddModal() {
      this.isEditing = false;
      this.resetCurrentRatio();
      this.modalInstance.show();
    },
    showEditModal(ratio) {
      this.isEditing = true;
      this.currentRatio = { ...ratio };
      this.modalInstance.show();
    },
    async handleSave() {
      try {
        if (this.isEditing) {
          await updateHospitalRatio(this.activeLevel, this.currentRatio);
        } else {
          await addHospitalRatio(this.activeLevel, this.currentRatio);
        }
        this.fetchRatios();
        this.modalInstance.hide();
      } catch (error) {
        console.error('保存失败:', error);
        alert('操作失败，请查看控制台获取更多信息。');
      }
    },
    async handleDelete(id) {
      if (confirm('确定要删除该条记录吗？')) {
        try {
          await deleteHospitalRatio(this.activeLevel, id);
          this.fetchRatios();
        } catch (error) {
          console.error('删除失败:', error);
          alert('操作失败，请查看控制台获取更多信息。');
        }
      }
    },
  },
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
