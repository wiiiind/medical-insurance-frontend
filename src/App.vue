<template>
  <div id="app">
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <!-- 
        关键修改：
        - 移除了 a 标签的 @click.prevent
        - 为顶栏的菜单按钮添加了 @click 事件
      -->
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
        <span @click.stop.prevent="handleMenuIconClick" style="cursor: pointer;">
          <FeatherIcon icon="menu" />
        </span>
        <span class="ms-2">医保报销系统</span>
      </a>
      <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <AppSidebar :collapsed="isSidebarCollapsed" @toggle-parent-menu="handleMenuIconClick" />
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from './components/AppSidebar.vue'
// 关键修改：引入新的 FeatherIcon 组件
import FeatherIcon from './components/FeatherIcon.vue'

export default {
  name: 'App',
  components: {
    AppSidebar,
    FeatherIcon
  },
  data() {
    return {
      isSidebarCollapsed: false
    }
  },
  // 关键修改：移除了所有 mounted 和 updated 中的 feather.replace()
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    // 关键修改：新的处理方法
    handleMenuIconClick() {
      // 如果侧边栏是收缩的，则展开它。否则，执行常规的切换。
      if (this.isSidebarCollapsed) {
        this.isSidebarCollapsed = false;
      } else {
        this.toggleSidebar();
      }
    }
  }
}
</script>

<style>
/* ... (全局样式保持不变) ... */
.main-content {
  transition: margin-left .3s;
}

.main-content.sidebar-collapsed {
  margin-left: 60px !important;
}
</style>