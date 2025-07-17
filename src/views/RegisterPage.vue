<!-- src/views/RegisterPage.vue (Corrected Styles) -->
<template>
  <div class="register-box">
    <div class="register-header">
      <h1>创建您的账户</h1>
      <p>已有账户？ <a href="#" @click.prevent="$emit('close')">登录</a></p>
    </div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <input type="text" id="userName" v-model="registerForm.userName" required placeholder=" " />
        <label for="userName">姓名或昵称</label>
      </div>
      <div class="form-group">
        <input type="text" id="loginName" v-model="registerForm.loginName" required placeholder=" " />
        <label for="loginName">用户名 (用于登录)</label>
      </div>
      <div class="form-group">
        <input type="password" id="password" v-model="registerForm.password" required placeholder=" " />
        <label for="password">密码</label>
      </div>
      <div class="form-group">
        <input type="password" id="confirmPassword" v-model="confirmPassword" required placeholder=" " />
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
// The script section was already correct and needs no changes.
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
/* --- THIS IS THE CRITICAL FIX: The entire style block is replaced --- */

/* The main container for the registration form */
.register-box {
  background: white;
  padding: 40px 50px;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  text-align: center;
  transform: scale(1);
  transition: transform 0.2s ease-out;
}

/* Header section */
.register-header {
  margin-bottom: 30px;
}
.register-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
}
.register-header p {
  font-size: 14px;
  color: #6e6e73;
}
.register-header a {
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
}
.register-header a:hover {
  text-decoration: underline;
}

/* Floating label styles */
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

/* Feedback messages */
.error-message,
.success-message {
  margin-bottom: 15px;
  font-size: 14px;
  text-align: left;
  min-height: 20px;
}
.error-message {
  color: #d93025;
}
.success-message {
  color: #28a745;
}

/* Action buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.cancel-button,
.register-button {
  padding: 10px 25px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background-color: #e9ecef;
  color: #495057;
}
.cancel-button:hover {
  background-color: #dee2e6;
}

.register-button {
  background-color: #0071e3;
  color: white;
}
.register-button:hover {
  background-color: #0077ed;
}
.register-button:disabled {
  background-color: #a0a0a5;
  cursor: not-allowed;
}
</style>