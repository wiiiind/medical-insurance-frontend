<template>
  <div class="reimbursement-management">
    <h1>医保中心报销管理</h1>
    <div class="row">
      <div class="col-md-3">
        <div class="list-group">
          <router-link to="/reimbursement-management/member-info-management" class="list-group-item list-group-item-action">
            参保人员信息管理
          </router-link>
          <router-link to="/reimbursement-management/member-expense-query" class="list-group-item list-group-item-action">
            参保人员费用查询
          </router-link>
          <router-link to="/reimbursement-management/member-reimbursement" class="list-group-item list-group-item-action">
            参保人员费用报销
          </router-link>
        </div>
      </div>
      <div class="col-md-9">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReimbursementManagement'
}
</script>

<style scoped>
.reimbursement-management {
  padding: 20px;
}
</style>