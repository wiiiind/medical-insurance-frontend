<!-- src/views/AccountManagement.vue (Corrected Avatar Update Logic) -->
<template>
  <div class="management-container">
    <div v-if="isLoading" class="loading-state">加载中...</div>
    
    <div v-else class="management-card">
      <h2 class="card-header">账户信息</h2>
      
      <div class="card-body">
        <div class="avatar-section">
          <!-- This logic is correct and does not need to change -->
          <img v-if="hasValidAvatar" :src="user.avatar" alt="用户头像" class="avatar-image" />
          <div v-else class="avatar-placeholder">{{ userInitial }}</div>
          <div class="avatar-overlay" @click="triggerFileUpload">
            <FeatherIcon icon="camera" />
            <span>更改头像</span>
          </div>
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />
        </div>

        <form class="info-form" @submit.prevent="handleSave">
          <div class="form-group">
            <input type="text" id="userName" v-model="user.userName" placeholder=" " required />
            <label for="userName">姓名(昵称)</label>
          </div>
          <div class="form-group">
            <input type="text" id="loginName" v-model="user.loginName" placeholder=" " disabled required />
            <label for="loginName">用户名</label>
          </div>
          <div class="form-group">
            <input type="password" id="newPassword" v-model="newPassword" placeholder=" " />
            <label for="newPassword">新密码 (如不修改请留空)</label>
          </div>
          <div class="form-group">
            <input type="email" id="email" v-model="user.email" placeholder=" " required />
            <label for="email">电子邮箱</label>
          </div>
          <div class="form-group">
            <input type="text" id="mobile" v-model="user.mobile" placeholder=" " required />
            <label for="mobile">手机号码</label>
          </div>
          
          <div class="form-actions">
            <div v-if="errorMessage" class="feedback-message error">{{ errorMessage }}</div>
            <button type="submit" class="save-button">保存更改</button>
          </div>
        </form>
      </div>
    </div>

    <transition name="success-modal-fade">
      <div v-if="showSuccessModal" class="success-modal-overlay">
        <div class="success-modal-box">
          <FeatherIcon icon="check-circle" class="success-icon" />
          <h3 class="success-title">成功提示</h3>
          <p class="success-message">您的账户信息已更新！</p>
          <button @click="closeSuccessModalAndNavigate" class="ok-button">好</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FeatherIcon from '@/components/FeatherIcon.vue';
import * as authApi from '@/api/auth.js';

export default {
  name: 'AccountManagement',
  components: { FeatherIcon },
  data() {
    return {
      isLoading: true,
      user: {},
      newPassword: '',
      errorMessage: '',
      showSuccessModal: false,
    };
  },
  computed: {
    // This logic is also correct, it just needs the right data
    hasValidAvatar() {
      // We also need to check this.user.avatar exists first
      return this.user && this.user.avatar && this.user.avatar.startsWith('http');
    },
    userInitial() {
      return this.user && this.user.userName ? this.user.userName.charAt(0) : '';
    }
  },
  async created() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      // In App.vue, we now get the full user object, including the avatar.
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id) {
        this.$router.push('/login');
        return;
      }

      this.isLoading = true;
      try {
        const response = await authApi.getUserById(storedUser.id);
        if (response.code === 1) {
          this.user = response.data;
        } else {
          this.showError(response.msg || '获取用户信息失败');
        }
      } catch (error) {
        this.showError(error.message || '网络错误，请稍后再试');
      } finally {
        this.isLoading = false;
      }
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await authApi.uploadAvatar(formData);
        if (response.code === 1) {
          const newAvatarUrl = response.data;
          // Update the local component's avatar for immediate display on this page
          this.user.avatar = newAvatarUrl;

          // --- THIS IS THE CRITICAL FIX ---
          // 1. Get the current user data from localStorage
          const userInStorage = JSON.parse(localStorage.getItem('user') || '{}');
          
          // 2. Update its avatar property
          userInStorage.avatar = newAvatarUrl;

          // 3. Save it back to localStorage
          localStorage.setItem('user', JSON.stringify(userInStorage));

          // 4. Tell App.vue to refresh its user data
          window.dispatchEvent(new CustomEvent('user-updated'));
          // --- END OF FIX ---

          this.showFeedback('头像上传成功！', 'success');
        } else {
          this.showError(response.msg || '头像上传失败');
        }
      } catch (error) {
        this.showError(error.message || '头像上传失败');
      }
    },
    async handleSave() {
      this.errorMessage = '';
      const payload = { ...this.user };
      if (this.newPassword) {
        payload.password = this.newPassword;
      }

      try {
        await authApi.updateUser(payload);
        
        // IMPROVEMENT: Update localStorage with all current user info (name, avatar, etc.)
        const updatedUserForStorage = {
          ...JSON.parse(localStorage.getItem('user')), // Keep old data like id, token
          userName: this.user.userName,               // Add new name
          avatar: this.user.avatar,                   // Add new avatar
        };
        localStorage.setItem('user', JSON.stringify(updatedUserForStorage));
        
        this.newPassword = '';
        this.showSuccessModal = true;
      } catch (error) {
        this.showError(error.message || '保存失败，请检查输入');
      }
    },
    closeSuccessModalAndNavigate() {
      this.showSuccessModal = false;
      // This event is now correctly fired after localStorage is updated
      window.dispatchEvent(new CustomEvent('user-updated'));
      this.$router.push('/');
    },
    showError(msg) {
      this.errorMessage = msg;
      setTimeout(() => { this.errorMessage = ''; }, 3000);
    },
    showFeedback(msg, type) {
      if (type === 'success') {
        this.errorMessage = msg;
        setTimeout(() => { this.errorMessage = ''; }, 3000);
      }
    }
  }
};
</script>

<style scoped>
/* All styles remain unchanged */
.management-container {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.management-card {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  overflow: hidden;
}
.card-header { padding: 20px 30px; font-size: 22px; font-weight: 600; border-bottom: 1px solid #f0f0f0; }
.card-body { display: flex; padding: 30px; gap: 40px; }
.avatar-section { flex-shrink: 0; position: relative; cursor: pointer; width: 120px; height: 120px; }
.avatar-image { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.avatar-placeholder { width: 100%; height: 100%; border-radius: 50%; background-color: #e9ecef; color: #495057; display: flex; justify-content: center; align-items: center; font-size: 50px; font-weight: 500; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.avatar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; background-color: rgba(0,0,0,0.5); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease; }
.avatar-section:hover .avatar-overlay { opacity: 1; }
.avatar-overlay span { font-size: 14px; margin-top: 5px; }
.info-form { flex-grow: 1; }
.form-actions { display: flex; justify-content: flex-end; align-items: center; margin-top: 30px; gap: 15px; }
.feedback-message.error { color: #d93025; font-size: 14px; }
.save-button { padding: 10px 25px; border: none; border-radius: 8px; background-color: #0071e3; color: white; font-size: 15px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.save-button:hover { background-color: #0077ed; }
.loading-state { padding: 50px; text-align: center; font-size: 18px; color: #555; }
.success-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 2000; }
.success-modal-box { background: #fff; padding: 30px 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); text-align: center; display: flex; flex-direction: column; align-items: center; }
.success-icon { color: #28a745; width: 50px; height: 50px; margin-bottom: 15px; }
.success-title { font-size: 20px; font-weight: 600; margin-bottom: 5px; }
.success-message { font-size: 14px; color: #6c757d; margin-bottom: 25px; }
.ok-button { padding: 8px 35px; border: none; border-radius: 8px; background-color: #0071e3; color: white; font-size: 15px; cursor: pointer; transition: background-color 0.2s; }
.ok-button:hover { background-color: #0077ed; }
.success-modal-fade-enter-active, .success-modal-fade-leave-active { transition: opacity 0.3s ease; }
.success-modal-fade-enter-from, .success-modal-fade-leave-to { opacity: 0; }
.form-group { position: relative; margin-bottom: 25px; }
.form-group input { width: 100%; padding: 14px; border-radius: 12px; font-size: 16px; border: 1px solid #d2d2d7; background-color: #fff; transition: all 0.2s ease; }
.form-group label { position: absolute; top: 15px; left: 15px; font-size: 16px; color: #86868b; pointer-events: none; transition: all 0.2s ease-out; }
.form-group input:focus + label, .form-group input:not(:placeholder-shown) + label { top: -10px; left: 10px; font-size: 12px; padding: 0 5px; color: #0071e3; background-color: #fff; }
.form-group input:focus { outline: none; border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 125, 250, 0.2); }
.form-group input:disabled { background-color: #f5f5f7 !important; color: #6c757d; cursor: not-allowed; }
.form-group input:disabled + label { color: #6c757d; background-color: #fff; }
</style>