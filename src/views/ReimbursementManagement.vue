<template>
  <div class="reimbursement-management-container">
    <!-- 
      这个组件现在只作为路由容器。
      所有的子页面 (如人员管理、费用查询等) 将会在这里被渲染。
      导航逻辑已全部移至 AppSidebar.vue。
    -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ReimbursementManagement',
};
</script>

<style scoped>
/* 可以为容器添加一些通用内边距 */
.reimbursement-management-container {
  padding: 1rem;
}
</style>