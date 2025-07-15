<template>
  <div id="app">
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <!-- 侧边栏切换按钮 -->
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#" @click.prevent="toggleSidebar">
        <span data-feather="menu" class="me-2"></span>医保报销系统
      </a>
      <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <!-- 传递 collapsed 状态到侧边栏组件 -->
        <AppSidebar :collapsed="isSidebarCollapsed" />

        <!-- 根据侧边栏状态动态调整主内容区的 class -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from './components/AppSidebar.vue'
import feather from 'feather-icons'

export default {
  name: 'App',
  components: {
    AppSidebar
  },
  data() {
    return {
      // 侧边栏伸缩状态
      isSidebarCollapsed: false
    }
  },
  mounted() {
    // 渲染图标
    feather.replace()
  },
  updated() {
    // 视图更新后再次渲染图标
    feather.replace()
  },
  methods: {
    // 切换侧边栏状态的方法
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    }
  }
}
</script>

<style>
/* 全局样式 */
body {
  font-size: .875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

@media (max-width: 767.98px) {
  .sidebar {
    top: 5rem;
  }
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .navbar-toggler {
  top: .25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: .75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}

.main-content {
  transition: margin-left .3s;
}

/* 当侧边栏收缩时，主内容区的左边距变小 */
.main-content.sidebar-collapsed {
  margin-left: 60px !important;
}

.navbar-brand {
  cursor: pointer;
}
</style>