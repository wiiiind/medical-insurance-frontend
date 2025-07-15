<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/" class="nav-link active" aria-current="page">
            <span data-feather="home"></span>
            首页
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/medical-insurance-data/drug-maintenance" class="nav-link">
            <span data-feather="file"></span>
            医疗保险基本信息维护
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/hospital-doctor-station/admission-registration" class="nav-link">
            <span data-feather="shopping-cart"></span>
            医院住院医生站医嘱处理
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/reimbursement-management/member-info-management" class="nav-link">
            <span data-feather="users"></span>
            医保中心报销管理
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppSidebar'
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
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link.active {
  color: #007bff;
}
</style>