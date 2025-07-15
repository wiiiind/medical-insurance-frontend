<template>
  <div class="medical-insurance-data-container">
    <!-- 
      这个组件现在只作为路由容器。
      所有的子页面 (如药品维护、项目维护等) 将会在这里被渲染。
      导航逻辑已全部移至 AppSidebar.vue。
    -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'MedicalInsuranceData',
};
</script>

<style scoped>
/* 可以为容器添加一些通用内边距 */
.medical-insurance-data-container {
  padding: 1rem;
}
</style>