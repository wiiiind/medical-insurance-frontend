<template>
  <div class="member-info-management p-4">
    <h2 class="mb-4">参保人员信息管理</h2>

    <!-- 搜索区域 -->
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto">
        <input type="text" class="form-control" v-model="searchQuery.realName" placeholder="请输入姓名" @keyup.enter="handleSearch">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 参保人员信息表格 -->
    <table class="table table-striped table-hover">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>姓名</th>
          <th>性别</th>
          <th>身份证号</th>
          <th>出生日期</th>
          <th>家庭住址</th>
          <th>最近就诊日期</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="7" class="text-center">加载中...</td>
        </tr>
        <tr v-else-if="members.length === 0">
          <td colspan="7" class="text-center">没有找到相关数据</td>
        </tr>
        <tr v-for="(member, index) in members" :key="member.id">
          <td>{{ (pagination.page - 1) * pagination.pageSize + index + 1 }}</td>
          <td>{{ member.realName }}</td>
          <td>{{ member.gender }}</td>
          <td>{{ member.cardNumber }}</td>
          <td>{{ member.birthday }}</td>
          <td>{{ member.homeAddress }}</td>
          <td>{{ member.visitDate }}</td>
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
  </div>
</template>

<script>
import { manageInfo } from '@/api/reimbursement';

export default {
  name: 'MemberInfoManagement',
  data() {
    return {
      loading: false,
      members: [],
      searchQuery: {
        realName: ''
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      }
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
      try {
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          realName: this.searchQuery.realName || undefined
        };
        const response = await manageInfo(params);
        if (response && response.code === 1) {
          this.members = response.data.rows;
          this.pagination.total = response.data.total;
        } else {
          this.members = [];
          this.pagination.total = 0;
          console.error('获取数据失败:', response.msg || '响应码不为1');
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
    }
  }
}
</script>

<style scoped>
.member-info-management {
  padding: 20px;
}
.pagination {
  justify-content: flex-end;
}
</style>