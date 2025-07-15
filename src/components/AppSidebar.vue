<template>
  <!-- 根据 collapsed 状态动态添加 is-collapsed class -->
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" :class="{ 'is-collapsed': collapsed }">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/" class="nav-link active" aria-current="page" title="首页">
            <span data-feather="home"></span>
            <!-- 当不收缩时才显示文本 -->
            <span v-if="!collapsed" class="link-text">首页</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/medical-insurance-data/drug-maintenance" class="nav-link" title="医疗保险基本信息维护">
            <span data-feather="file"></span>
            <span v-if="!collapsed" class="link-text">医疗保险基本信息维护</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/hospital-doctor-station/admission-registration" class="nav-link" title="医院住院医生站医嘱处理">
            <span data-feather="activity"></span>
            <span v-if="!collapsed" class="link-text">医院住院医生站医嘱处理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/reimbursement-management/member-info-management" class="nav-link" title="医保中心报销管理">
            <span data-feather="users"></span>
            <span v-if="!collapsed" class="link-text">医保中心报销管理</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    // 从父组件接收 collapsed 状态
    collapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  transition: width 0.3s;
  overflow-x: hidden;
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link.active {
  color: #007bff;
}
.sidebar.is-collapsed {
  width: 60px;
}

.sidebar .nav-link {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.sidebar .nav-link .link-text {
  margin-left: 8px;
}
</style>