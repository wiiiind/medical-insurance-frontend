<template>
  <div class="member-reimbursement p-4">
    <h2 class="mb-4">参保人员费用报销</h2>

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
            <button class="btn btn-sm btn-info" @click.stop="selectMember(member)">选择</button>
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

    <!-- 费用详情和饼图 (已移除报销表单) -->
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

        <!-- 饼图容器 -->
        <div class="row mt-5">
          <div class="col-md-6">
            <div v-if="categoryPieOptions" class="chart-container">
              <v-chart class="chart" :option="categoryPieOptions" autoresize />
            </div>
            <div v-else class="chart-container d-flex justify-content-center align-items-center text-muted">
              <span>品类占比图数据加载中...</span>
            </div>
          </div>
          <div class="col-md-6">
            <div v-if="drugPieOptions" class="chart-container">
              <v-chart class="chart" :option="drugPieOptions" autoresize />
            </div>
            <div v-else class="chart-container d-flex justify-content-center align-items-center text-muted">
              <span>药品占比图数据加载中...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// 移除了不再需要的 getFeeReimbursementSummary
import { findPatInfo, getFeeReimbursementDrugs, getFeeReimbursementOtherItems, getFeeDetailPieChart } from '@/api/reimbursement';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);


export default {
  name: 'MemberReimbursement',
  components: {
    VChart,
  },
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
      serviceData: [],
      categoryPieOptions: null,
      drugPieOptions: null,
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
    async fetchMembers() {
      this.loading = true;
      this.selectedMember = null;
      try {
        const params = {
          current: this.pagination.page,
          size: this.pagination.pageSize,
          realName: this.searchQuery.realName || undefined
        };
        const response = await findPatInfo(params);
        if (response && response.code === 1 && response.data) {
          this.members = response.data.rows || [];
          this.pagination.total = response.data.total || 0;
        } else {
          this.members = [];
          this.pagination.total = 0;
        }
      } catch (error) {
        console.error('请求异常:', error);
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
      this.categoryPieOptions = null;
      this.drugPieOptions = null;

      try {
        // 只调用需要的API
        const drugPromise = getFeeReimbursementDrugs('1', this.selectedMember.id);
        const otherItemsPromise = getFeeReimbursementOtherItems(this.selectedMember.id);
        const categoryPiePromise = getFeeDetailPieChart('1');
        const drugPiePromise = getFeeDetailPieChart('2');

        const [
          drugRes, 
          otherItemsRes, 
          categoryPieRes,
          drugPieRes
        ] = await Promise.all([
          drugPromise, 
          otherItemsPromise, 
          categoryPiePromise, 
          drugPiePromise
        ]);

        if (drugRes && drugRes.code === 1) this.drugData = drugRes.data || [];
        if (otherItemsRes && otherItemsRes.code === 1) {
            this.serviceData = otherItemsRes.data.xlist || [];
            this.diagnosisData = otherItemsRes.data.ylist || [];
        }

        if (categoryPieRes && categoryPieRes.code === 1) {
          this.categoryPieOptions = this.buildPieOptions(
            '各费用品类占比', 
            categoryPieRes.data.xlist, 
            categoryPieRes.data.ylist
          );
        }
        if (drugPieRes && drugPieRes.code === 1) {
          this.drugPieOptions = this.buildPieOptions(
            '各类药品费用占比',
            drugPieRes.data.xlist,
            drugPieRes.data.ylist
          );
        }

      } catch (error) {
        console.error('获取费用详情或图表数据失败:', error);
      } finally {
        this.detailsLoading = false;
      }
    },
    buildPieOptions(title, labels, values) {
      if (!labels || !values || labels.length === 0) {
        return null;
      }
      const chartData = labels.map((label, index) => ({
        name: label,
        value: values[index] || 0,
      }));

      return {
        title: {
          text: title,
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle'
        },
        series: [
          {
            name: '费用占比',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['65%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: chartData,
          },
        ],
      };
    },
  }
}
</script>

<style scoped>
.member-reimbursement {
  padding: 20px;
}
.table-hover tbody tr:hover {
  cursor: pointer;
}
.pagination {
  justify-content: flex-end;
}
.chart-container {
  border: 1px solid #dee2e6;
  border-radius: .25rem;
  padding: 1rem;
  height: 420px; /* 给予容器一个固定的高度 */
}
.chart {
  height: 400px; /* 图表本身的高度 */
}
</style>