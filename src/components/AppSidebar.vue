<template>
  <nav id="sidebarMenu" class="sidebar" :class="{ 'is-collapsed': collapsed }">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li v-for="item in navItems" :key="item.name" class="nav-item">
          
          <!-- Case 1: No children -->
          <router-link v-if="!item.children" :to="item.path" class="nav-link" :title="item.name">
            <span class="icon-wrapper">
              <FeatherIcon :icon="item.icon" />
            </span>
            <span v-if="!collapsed" class="link-text">{{ item.name }}</span>
          </router-link>
          
          <!-- Case 2: Has children -->
          <a v-else class="nav-link" :class="{ 'parent-active': isParentActive(item) }" href="#" @click.prevent="handleParentMenuClick(item.name)" :title="item.name">
            <span class="icon-wrapper">
              <FeatherIcon :icon="item.icon" />
            </span>
            <span v-if="!collapsed" class="link-text">{{ item.name }}</span>
            <span v-if="!collapsed" class="ms-auto me-2">
              <FeatherIcon :icon="isSubMenuOpen(item.name) ? 'chevron-down' : 'chevron-right'" />
            </span>
          </a>

          <!-- Sub-menu container -->
          <div v-if="item.children" class="collapse sub-menu-container" :class="{ 'show': isSubMenuOpen(item.name) }">
            <ul class="nav flex-column sub-menu">
              <li v-for="child in item.children" :key="child.name" class="nav-item">
                <router-link :to="child.path" class="nav-link" :title="child.name">
                  <span class="link-text">{{ child.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import FeatherIcon from './FeatherIcon.vue';

export default {
  name: 'AppSidebar',
  components: {
    FeatherIcon,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      navItems: [
        { name: '首页', path: '/', icon: 'home' },
        {
          name: '医疗保险基本信息维护',
          icon: 'file',
          children: [
            { name: '医保药品数据维护', path: '/medical-insurance-data/drug-maintenance' },
            { name: '诊疗项目数据维护', path: '/medical-insurance-data/treatment-item-maintenance' },
            { name: '医疗服务设施数据维护', path: '/medical-insurance-data/medical-service-maintenance' },
            { name: '药品报销比例维护', path: '/medical-insurance-data/drug-reimbursement-ratio-maintenance' },
            { name: '医院报销比例维护', path: '/medical-insurance-data/hospital-reimbursement-ratio-maintenance' },
          ],
        },
        {
          name: '医院住院医生站医嘱处理',
          icon: 'activity',
          children: [
            { name: '入院登记', path: '/hospital-doctor-station/admission-registration' },
            { name: '患者诊断', path: '/hospital-doctor-station/patient-diagnosis' },
            { name: '患者医嘱', path: '/hospital-doctor-station/patient-orders' },
          ],
        },
        {
          name: '医保中心报销管理',
          icon: 'users',
          children: [
             { name: '参保人员信息管理', path: '/reimbursement-management/member-info-management' },
             { name: '参保人员费用查询', path: '/reimbursement-management/member-expense-query' },
             { name: '参保人员费用报销', path: '/reimbursement-management/member-reimbursement' },
          ]
        },
      ],
      openSubMenus: [],
    };
  },
  computed: {
    activeParentName() {
      const currentPath = this.$route.path;
      const parent = this.navItems.find(item => 
        item.children && item.children.some(child => currentPath.startsWith(child.path))
      );
      return parent ? parent.name : null;
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        if (this.activeParentName && !this.isSubMenuOpen(this.activeParentName)) {
          this.openSubMenus = [this.activeParentName];
        }
      }
    }
  },
  methods: {
    handleParentMenuClick(name) {
      if (this.collapsed) {
        this.$emit('toggle-parent-menu');
        this.$nextTick(() => {
          this.openSubMenus = [name];
        });
      } else {
        this.toggleSubMenu(name);
      }
    },
    toggleSubMenu(name) {
      if (this.isSubMenuOpen(name)) {
        this.openSubMenus = this.openSubMenus.filter(item => item !== name);
      } else {
        this.openSubMenus = [name];
      }
    },
    isSubMenuOpen(name) {
      return !this.collapsed && this.openSubMenus.includes(name);
    },
    isParentActive(item) {
      return this.activeParentName === item.name;
    }
  }
};
</script>

<style scoped>
/* --- 基础布局 --- */
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  background-color: #f8f9fa;
  transition: width 0.2s ease-in-out;
  width: 250px;
}

.sidebar.is-collapsed {
  width: 60px;
}

.sidebar.is-collapsed .sub-menu-container {
  display: none;
}

/* --- 链接统一样式 --- */
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  cursor: pointer;
  background-color: transparent;
}

/* --- 图标和文本 --- */
.icon-wrapper {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.link-text {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- 统一高亮逻辑 --- */
/* 规则1: 当链接本身被激活时 (无子菜单的链接) */
.nav-link.router-link-active,
/* 规则2: 当链接是激活的子菜单的父级时 */
.nav-link.parent-active {
  color: #0d6efd;
  font-weight: bold;
}

/* 同样应用于图标和文字 */
.nav-link.router-link-active .icon-wrapper,
.nav-link.router-link-active .link-text,
.nav-link.parent-active .icon-wrapper,
.nav-link.parent-active .link-text {
  color: #0d6efd;
}

/* --- 子菜单 --- */
.sub-menu-container {
  background-color: transparent;
  padding-left: 1.5rem;
}

.sub-menu .nav-link {
  padding-left: calc(0.75rem + 24px);
  font-weight: normal;
}

/* 子菜单链接激活时，也应用统一的加粗和变蓝样式 */
.sub-menu .nav-link.router-link-active {
  color: #0d6efd;
  font-weight: bold;
}
</style>