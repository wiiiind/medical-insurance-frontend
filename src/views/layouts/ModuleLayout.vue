<!-- src/views/layouts/ModuleLayout.vue (Correct Hover Effect) -->
<template>
  <div class="module-body" :class="{ 'sidebar-collapsed': isCollapsed }">
    <nav class="module-sidebar">
      <div class="sidebar-toggler" @click="toggleCollapse" title="收起/展开侧边栏">
        <FeatherIcon :icon="'sidebar'" class="toggler-icon" />
      </div>

      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :title="isCollapsed ? item.name : ''"
      >
        <FeatherIcon :icon="item.icon" class="nav-icon" />
        <span v-if="!isCollapsed">{{ item.name }}</span>
      </router-link>
    </nav>

    <main class="module-content">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script>
// Script is unchanged
import FeatherIcon from '@/components/FeatherIcon.vue';

export default {
  name: 'ModuleLayout',
  components: { FeatherIcon },
  props: {
    navItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
/* Base Styles */
.module-body {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.module-sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: #FBFBFD;
  border-right: 1px solid #E5E5EA;
  padding: 15px 10px;
  overflow-y: auto;
  transition: width 0.2s ease-in-out;
}

.module-content {
  flex-grow: 1;
  padding: 0;
  overflow-y: auto;
  background-color: #fff;
}

/* Expanded Sidebar Styles (Default) */
.sidebar-toggler,
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar-toggler {
  justify-content: flex-start;
  margin-bottom: 8px;
}
.nav-item {
  margin-bottom: 5px;
}

.nav-icon {
  margin-right: 15px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #0071e3;
}

.toggler-icon {
  transition: transform 0.2s ease;
  color: #555;
}

/* Default hover for expanded state */
.sidebar-toggler:hover,
.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-item.router-link-exact-active {
  background-color: #0071e3;
  color: white;
}
.nav-item.router-link-exact-active .nav-icon {
  color: white;
}

/* --- COLLAPSED STATE STYLES (THE FINAL FIX) --- */

.module-body.sidebar-collapsed .module-sidebar {
  width: 76px;
}

/* **This is the key fix**: When collapsed, the buttons are FORCED into a square shape */
.module-body.sidebar-collapsed .sidebar-toggler,
.module-body.sidebar-collapsed .nav-item {
  width: 44px;
  height: 44px;
  padding: 0;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}

.module-body.sidebar-collapsed .nav-icon {
  margin-right: 0;
}

.module-body.sidebar-collapsed .toggler-icon {
  transform: rotate(180deg);
}
</style>