<!-- src/views/AccountManagement.vue (The Final, Corrected Version) -->
<template>
  <div class="management-container">
    <div v-if="isLoading" class="loading-state">加载中...</div>
    
    <div v-else class="management-card">
      <h2 class="card-header">账户信息</h2>
      
      <div class="card-body">
        <div class="avatar-section">
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
    hasValidAvatar() {
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
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id) {
        this.$router.push('/login');
        return;
      }

      this.isLoading = true;
      try {
        // **核心修正 1**: `getUserById` 现在直接返回被拦截器处理过的对象
        const response = await authApi.getUserById(storedUser.id);
        
        // **核心修正 2**: 直接从 `response.data` 中获取用户信息对象
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
          this.user.avatar = response.data;
          this.showFeedback('头像上传成功！', 'success'); // 使用新的反馈函数
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
        
        // **重要**: 更新 localStorage 中的用户信息，确保顶栏头像和昵称能立即刷新
        const updatedUser = { ...JSON.parse(localStorage.getItem('user')), userName: this.user.userName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        this.newPassword = '';
        this.showSuccessModal = true;
      } catch (error) {
        this.showError(error.message || '保存失败，请检查输入');
      }
    },
    closeSuccessModalAndNavigate() {
      this.showSuccessModal = false;
      // 触发一个事件或使用其他方式通知App.vue刷新用户信息
      window.dispatchEvent(new CustomEvent('user-updated'));
      this.$router.push('/');
    },
    // 将两种反馈消息统一处理，避免重复代码
    showError(msg) {
      this.errorMessage = msg;
      setTimeout(() => { this.errorMessage = ''; }, 3000);
    },
    showFeedback(msg, type) {
      // 临时使用 error message 的位置来显示成功消息
      if (type === 'success') {
        this.errorMessage = msg; // 可以在这里改变样式，但暂时复用
        setTimeout(() => { this.errorMessage = ''; }, 3000);
      }
    }
  }
};
</script>

<style scoped>
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