<!-- src/views/HomePage.vue (Updated Animation and Spacing) -->
<template>
  <div class="home-container">
    <router-link v-for="nav in mainNavs" :key="nav.title" :to="nav.path" class="nav-card">
      <div class="card-icon">
        <FeatherIcon :icon="nav.icon" />
      </div>
      <h2 class="card-title">{{ nav.title }}</h2>
    </router-link>
  </div>
</template>

<script>
// Script部分没有变化
import FeatherIcon from '@/components/FeatherIcon.vue';
export default {
  name: 'HomePage',
  components: { FeatherIcon },
  data() {
    return {
      mainNavs: [
        { title: '医疗保险基本信息维护', path: '/medical-insurance-data/drug-maintenance', icon: 'database' },
        { title: '医院住院医生站医嘱处理', path: '/hospital-doctor-station/admission-registration', icon: 'clipboard' },
        { title: '医保中心报销管理', path: '/reimbursement-management/member-info-management', icon: 'users' }
      ]
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* **关键修改 1**: 加大间距 */
  gap: 30px;
  padding: 40px 20px;
}

.nav-card {
  width: 100%;
  max-width: 450px;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  color: #333;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  transition: transform 0.2s ease-out, box-shadow 0.3s ease; /* 调整动画速度 */
}

/* **关键修改 2**: 修改悬浮动画效果 */
.nav-card:hover {
  transform: scale(1.03); /* 放大3% */
  box-shadow: 0 12px 35px 0 rgba(31, 38, 135, 0.15);
}

.card-icon {
  margin-bottom: 20px;
  color: #0071e3;
}

.card-icon :deep(svg) {
  width: 48px;
  height: 48px;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
}
</style>