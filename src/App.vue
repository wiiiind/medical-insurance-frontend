<!-- src/App.vue (Corrected - Incorrect Sidebar REMOVED) -->
<template>
  <div id="app">
    <!-- The layout is only shown for authenticated routes -->
    <template v-if="showLayout">
      <nav class="top-bar">
        <!-- The <AppSidebar> component has been completely removed from here -->
        <router-link to="/" class="brand-title">医保报销系统</router-link>
        
        <div class="module-title">{{ currentModuleTitle }}</div>

        <div class="user-menu-container" ref="userMenuContainer">
          <div v-if="userInitial" class="user-avatar" @click.stop="isDropdownOpen = !isDropdownOpen">
            {{ userInitial }}
          </div>
          <transition name="dropdown-fade">
            <div v-if="isDropdownOpen" class="user-dropdown">
              <div class="dropdown-section user-details">
                <div class="user-name">{{ user.userName }}</div>
                <div class="user-login-name">{{ user.loginName }}</div>
              </div>
              <hr class="dropdown-divider" />
              <div class="dropdown-section">
                <router-link to="/account-management" class="dropdown-item manage-item" @click="isDropdownOpen = false">
                  <FeatherIcon icon="user" class="item-icon" />
                  <span>管理账户</span>
                </router-link>
              </div>
              <hr class="dropdown-divider" />
              <div class="dropdown-section">
                <a href="#" class="dropdown-item logout-item" @click.prevent="logout">
                  <FeatherIcon icon="x-circle" class="item-icon" />
                  <span>退出登录</span>
                </a>
              </div>
            </div>
          </transition>
        </div>
      </nav>

      <!-- The router-view now takes up the main space below the top bar -->
      <main class="main-content">
        <router-view />
      </main>
    </template>
    
    <!-- This part for the login page is correct -->
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
// NOTE: AppSidebar is no longer imported or used here.
import FeatherIcon from './components/FeatherIcon.vue'

export default {
  name: 'App',
  components: { FeatherIcon },
  data() {
    // NOTE: isSidebarCollapsed and toggleSidebar() have been removed.
    return {
      isDropdownOpen: false,
      user: {},
      userInitial: ''
    }
  },
  computed: {
    showLayout() { return this.$route.name !== 'Login'; },
    currentModuleTitle() {
      for (let i = this.$route.matched.length - 1; i >= 0; i--) {
        if (this.$route.matched[i].meta.title) {
          return this.$route.matched[i].meta.title;
        }
      }
      return '';
    }
  },
  created() {
    this.updateUserData();
    window.addEventListener('user-updated', this.updateUserData);
  },
  beforeUnmount() {
    window.removeEventListener('user-updated', this.updateUserData);
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },
  mounted() { document.addEventListener('click', this.closeDropdownOnClickOutside); },
  methods: {
    updateUserData() {
      const userStr = localStorage.getItem('user');
      this.user = userStr ? JSON.parse(userStr) : {};
      this.userInitial = this.user.userName ? this.user.userName.charAt(0) : '';
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isDropdownOpen = false;
      this.$router.push({ name: 'Login' }).then(() => { this.updateUserData(); });
    },
    closeDropdownOnClickOutside(event) {
      if (this.$refs.userMenuContainer && !this.$refs.userMenuContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  }
}
</script>

<style>
#app { background: linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%); min-height: 100vh; }

/* The main content area no longer has a margin, as the sidebar is now part of the router-view */
.main-content {
  margin-left: 0 !important;
  padding-top: 60px;
}

.top-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 24px; height: 60px; width: 100%; position: fixed;
  top: 0; left: 0; z-index: 1050;
  background-color: #F2F2F7;
  border-bottom: 1px solid #E5E5EA;
}
.brand-title {
  grid-column: 1 / 2;
  justify-self: start;
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  text-decoration: none;
}
.module-title {
  grid-column: 2 / 3;
  justify-self: center;
  font-size: 18px;
  font-weight: 600;
  color: #0071e3;
}
.user-menu-container {
  grid-column: 3 / 4;
  justify-self: end;
  position: relative;
}

/* All other styles for user menu, dropdown etc. remain the same */
.user-avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #e9ecef; color: #495057; display: flex; justify-content: center; align-items: center; font-weight: 500; font-size: 18px; cursor: pointer; transition: background-color 0.2s; }
.user-avatar:hover { background-color: #dee2e6; }
.user-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 260px; background-color: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border: 1px solid rgba(0, 0, 0, 0.05); padding: 8px; z-index: 1100; overflow: hidden; }
.dropdown-section { padding: 4px; }
.user-details { background-color: #f5f5f7; border-radius: 8px; padding: 12px; margin: 4px; }
.user-name { font-weight: 600; font-size: 15px; color: #1d1d1f; }
.user-login-name { font-size: 14px; color: #6e6e73; }
.dropdown-divider { border: none; border-top: 1px solid #eaeaec; margin: 8px 0; }
.user-dropdown .dropdown-item { display: flex; align-items: center; padding: 10px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; transition: background-color 0.2s; background-color: transparent; }
.user-dropdown .dropdown-item:hover { background-color: #f0f0f0 !important; }
.item-icon { margin-right: 12px; width: 20px; height: 20px; }
.user-dropdown .manage-item, .user-dropdown .manage-item .item-icon { color: #0071e3; }
.user-dropdown .logout-item, .user-dropdown .logout-item .item-icon { color: #d93025; }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>