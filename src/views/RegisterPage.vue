<!-- src/views/RegisterPage.vue (with Floating Label Animation) -->
<template>
  <div class="register-box">
    <div class="register-header">
      <h1>创建您的账户</h1>
      <p>已有账户？ <a href="#" @click.prevent="$emit('close')">登录</a></p>
    </div>

    <!-- **关键修改 1**: 调整表单结构以支持动画 -->
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <input type="text" id="userName" v-model="registerForm.userName" required />
        <label for="userName">姓名或昵称</label>
      </div>
      <div class="form-group">
        <input type="text" id="loginName" v-model="registerForm.loginName" required />
        <label for="loginName">用户名 (用于登录)</label>
      </div>
      <div class="form-group">
        <input type="password" id="password" v-model="registerForm.password" required />
        <label for="password">密码</label>
      </div>
      <div class="form-group">
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        <label for="confirmPassword">确认密码</label>
      </div>

      <div v-if="message" :class="messageType === 'error' ? 'error-message' : 'success-message'">
        {{ message }}
      </div>
      
      <div class="form-actions">
        <button type="button" class="cancel-button" @click="$emit('close')">取消</button>
        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// Script 逻辑完全不需要改变
import { register } from '@/api/auth.js';

export default {
  name: 'RegisterPage',
  emits: ['close'],
  data() {
    return {
      loading: false,
      registerForm: {
        userName: '',
        loginName: '',
        password: '',
      },
      confirmPassword: '',
      message: '',
      messageType: '',
    };
  },
  methods: {
    async handleRegister() {
      this.message = '';
      this.messageType = '';
      if (this.registerForm.password !== this.confirmPassword) {
        this.message = '两次输入的密码不一致。';
        this.messageType = 'error';
        return;
      }
      if (this.registerForm.password.length < 6) {
        this.message = '密码长度不能少于6位。';
        this.messageType = 'error';
        return;
      }
      this.loading = true;
      try {
        await register(this.registerForm);
        this.message = '注册成功！';
        this.messageType = 'success';
        setTimeout(() => {
          this.$emit('close');
        }, 1500);
      } catch (error) {
        this.message = (error.response?.data?.msg) || '注册失败，请稍后再试。';
        this.messageType = 'error';
        console.error('Registration failed:', error);
      } finally {
        if (this.messageType !== 'success') {
           this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
/* 大部分容器样式无需改动 */
.management-container, .management-card, .card-header, .card-body, .avatar-section, .info-form, .form-actions, .success-modal-overlay { /* ... */ }
.management-container { padding: 40px; display: flex; justify-content: center; align-items: flex-start; }
.management-card { width: 100%; max-width: 800px; background: #ffffff; border-radius: 20px; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1); overflow: hidden; }
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
.success-modal-overlay, .success-modal-box, .success-icon, .success-title, .success-message, .ok-button, .success-modal-fade-enter-active { /* ... */ }
.success-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 2000; }
.success-modal-box { background: #fff; padding: 30px 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); text-align: center; display: flex; flex-direction: column; align-items: center; }
.success-icon { color: #28a745; width: 50px; height: 50px; margin-bottom: 15px; }
.success-title { font-size: 20px; font-weight: 600; margin-bottom: 5px; }
.success-message { font-size: 14px; color: #6c757d; margin-bottom: 25px; }
.ok-button { padding: 8px 35px; border: none; border-radius: 8px; background-color: #0071e3; color: white; font-size: 15px; cursor: pointer; transition: background-color 0.2s; }
.ok-button:hover { background-color: #0077ed; }
.success-modal-fade-enter-active, .success-modal-fade-leave-active { transition: opacity 0.3s ease; }
.success-modal-fade-enter-from, .success-modal-fade-leave-to { opacity: 0; }

/* --- **最终修正：统一所有输入框样式** --- */
.form-group {
  position: relative;
  margin-bottom: 25px;
}
.form-group input {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  border: 1px solid #d2d2d7;
  background-color: #fff;
  transition: all 0.2s ease;
}
.form-group label {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 16px;
  color: #86868b;
  pointer-events: none;
  transition: all 0.2s ease-out;
}
.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 12px;
  padding: 0 5px;
  color: #0071e3;
  background-color: #fff;
}
.form-group input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 125, 250, 0.2);
}

/* **关键修改：禁用状态的样式** */
.form-group input:disabled {
  /* 背景和文字颜色恢复正常，但稍微灰一点以示区别 */
  background-color: #f5f5f7 !important;
  color: #6c757d; 
  /* 鼠标指针变为“禁止”符号 */
  cursor: not-allowed;
}
/* 禁用状态下，标签的颜色也相应地变灰 */
.form-group input:disabled + label {
  color: #6c757d;
  background-color: #fff;
}
</style>