<!-- src/views/ReimbursementManagement/MemberExpenseQuery.vue (Corrected) -->
<template>
  <div class="member-expense-query p-4">
    <h2 class="mb-4">参保人员费用查询</h2>

    <!-- 搜索区域 -->
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto">
        <input type="text" class="form-control" v-model="searchQuery.realName" placeholder="请输入姓名" @keyup.enter="handleSearch">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 人员列表 -->
    <table class="table table-striped table-hover">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>姓名</th>
          <th>性别</th>
          <th>身份证号</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center">加载中...</td>
        </tr>
        <tr v-else-if="members.length === 0">
          <td colspan="5" class="text-center">没有找到相关数据</td>
        </tr>
        <tr v-for="(member, index) in members" :key="member.id" @click="selectMember(member)" :class="{ 'table-active': selectedMember && selectedMember.id === member.id }">
          <td>{{ (pagination.page - 1) * pagination.pageSize + index + 1 }}</td>
          <td>{{ member.realName }}</td>
          <td>{{ member.gender }}</td>
          <td>{{ member.cardNumber }}</td>
          <td>
            <button class="btn btn-sm btn-info" @click.stop="selectMember(member)">查看费用</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <nav v-if="pagination.total > 0">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: pagination.page <= 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(pagination.page - 1)">上一页</a>
        </li>
        <li class="page-item" v-for="page in pages" :key="page" :class="{ active: page === pagination.page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.page >= totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(pagination.page + 1)">下一页</a>
        </li>
      </ul>
    </nav>

    <!-- 费用详情 -->
    <div v-if="selectedMember" class="mt-5">
      <h3>{{ selectedMember.realName }} 的费用详情</h3>
      <div v-if="detailsLoading" class="text-center">费用详情加载中...</div>
      <div v-else>
        <!-- 药品费用 -->
        <h4 class="mt-4">药品费用</h4>
        <table class="table table-bordered">
           <thead>
            <tr>
              <th>药品名称</th>
              <th>规格</th>
              <th>价格</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!drugData || drugData.length === 0"><td colspan="3" class="text-center">无数据</td></tr>
            <tr v-for="item in drugData" :key="item.id">
              <td>{{ item.chinaName }}</td>
              <td>{{ item.specifications }}</td>
              <td>{{ item.drugPrice }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- 诊疗项目费用 -->
        <h4 class="mt-4">诊疗项目</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>项目名称</th>
              <th>价格</th>
              <th>单位</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!diagnosisData || diagnosisData.length === 0"><td colspan="4" class="text-center">无数据</td></tr>
            <tr v-for="item in diagnosisData" :key="item.id">
              <td>{{ item.medicalName }}</td>
              <td>{{ item.medicalPrice }}</td>
              <td>{{ item.medicalUnit }}</td>
              <td>{{ item.medicalInfo }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 医疗服务费用 -->
        <h4 class="mt-4">医疗服务</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>服务名称</th>
              <th>价格</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!serviceData || serviceData.length === 0"><td colspan="3" class="text-center">无数据</td></tr>
            <tr v-for="item in serviceData" :key="item.id">
              <td>{{ item.medicalName }}</td>
              <td>{{ item.medicalPrice }}</td>
              <td>{{ item.medicalInfo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { findPatInfo, getFeeReimbursementDrugs, getFeeReimbursementOtherItems, findDiagnosisInfo } from '@/api/reimbursement';

export default {
  name: 'MemberExpenseQuery',
  data() {
    return {
      loading: false,
      detailsLoading: false,
      members: [],
      searchQuery: {
        realName: ''
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      selectedMember: null,
      drugData: [],
      diagnosisData: [],
      serviceData: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.pageSize);
    },
    pages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  created() {
    this.fetchMembers();
  },
  methods: {
// In the 'methods' object, replace the entire fetchMembers function:

async fetchMembers() {
  this.loading = true;
  this.selectedMember = null;
  try {
    // Parameters updated to match the OpenAPI specification
    const params = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      realName: this.searchQuery.realName || undefined
    };
    const response = await findPatInfo(params);

    // This logic is correct and will now work with the paginated data
    if (response && response.data) {
      this.members = response.data.rows || [];
      this.pagination.total = response.data.total || 0;
    } else {
      this.members = [];
      this.pagination.total = 0;
    }
  } catch (error) {
    console.error('请求异常:', error);
    this.members = [];
    this.pagination.total = 0;
  } finally {
    this.loading = false;
  }
},
    handleSearch() {
      this.pagination.page = 1;
      this.fetchMembers();
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.pagination.page = page;
        this.fetchMembers();
      }
    },
    async selectMember(member) {
      if (this.selectedMember && this.selectedMember.id === member.id) {
        this.selectedMember = null;
        return;
      }
      this.selectedMember = member;
      this.detailsLoading = true;
      
      this.drugData = [];
      this.diagnosisData = [];
      this.serviceData = [];

      try {
        const drugPromise = getFeeReimbursementDrugs('1', this.selectedMember.id);
        const otherItemsPromise = getFeeReimbursementOtherItems(this.selectedMember.id);
        const diagnosisPromise = findDiagnosisInfo(this.selectedMember.id);

        const [drugRes, otherItemsRes, diagnosisRes] = await Promise.all([drugPromise, otherItemsPromise, diagnosisPromise]);
        
        // **核心修正 2**: 统一使用 response.data 来获取数据
        if (drugRes) this.drugData = drugRes.data || [];
        if (otherItemsRes && otherItemsRes.data) {
          this.serviceData = otherItemsRes.data.xlist || [];
        }
        if (diagnosisRes) this.diagnosisData = diagnosisRes.data || [];

      } catch (error) {
        console.error('获取费用详情失败:', error);
      } finally {
        this.detailsLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.member-expense-query {
  padding: 20px;
}
.table-hover tbody tr:hover {
  cursor: pointer;
}
.pagination {
  justify-content: flex-end;
}
</style>