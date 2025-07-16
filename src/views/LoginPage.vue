<!-- src/views/LoginPage.vue (Corrected Login Logic) -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>医保报销系统</h1>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            type="text"
            id="loginName"
            v-model="loginForm.loginName"
            required
          />
          <label for="loginName">用户名</label>
        </div>
        <div class="form-group">
          <input
            type="password"
            id="password"
            v-model="loginForm.password"
            required
          />
          <label for="password">密码</label>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="login-footer">
        <a href="#">忘记密码?</a>
        <a href="#" @click.prevent="showRegisterOverlay = true">创建账户</a>
      </div>
    </div>

    <transition name="register-modal">
      <div v-if="showRegisterOverlay" class="register-overlay">
        <RegisterPage @close="showRegisterOverlay = false" />
      </div>
    </transition>
  </div>
</template>

<script>
import { login } from '@/api/auth.js';
import RegisterPage from './RegisterPage.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterPage,
  },
  data() {
    return {
      loading: false,
      loginForm: {
        loginName: '',
        password: '',
      },
      errorMessage: '',
      showRegisterOverlay: false,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        // login() 现在返回的是被拦截器处理过的数据
        const response = await login(this.loginForm);

        // **关键修改 1**: 直接检查返回的 response 对象，而不是 response.data
        if (response && response.code === 1) {
          
          // **关键修改 2**: 从 response.data 中解构，而不是 response.data.data
          const { token, ...userData } = response.data;
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // 跳转到首页
          this.$router.push('/');
        } else {
          // **关键修改 3**: 直接从 response.msg 获取错误信息
          this.errorMessage = response.msg || '登录失败，请检查您的凭据。';
        }
      } catch (error) {
        // Promise.reject 抛出的错误会在这里被捕获
        this.errorMessage = error.message || '发生错误，请稍后再试。';
        console.error('Login failed:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 容器和卡片样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.login-box {
  background: #ffffff;
  padding: 40px 50px;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.login-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 30px;
}

/* 浮动标签表单样式 */
.form-group {
  position: relative;
  margin-bottom: 25px;
}
.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  background-color: #fff;
  transition: border-color 0.2s;
}
.form-group label {
  position: absolute;
  top: 13px;
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
  color: #0071e3;
  background-color: #ffffff;
  padding: 0 5px;
}
.form-group input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 125, 250, 0.2);
}

/* 消息、按钮和页脚样式 */
.error-message {
  color: #d93025;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
  min-height: 20px;
}
.login-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: #0071e3;
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.login-button:hover {
  background-color: #0077ed;
}
.login-button:disabled {
  background-color: #a0a0a5;
  cursor: not-allowed;
}
.login-footer {
  margin-top: 25px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}
.login-footer a {
  color: #0066cc;
  text-decoration: none;
}
.login-footer a:hover {
  text-decoration: underline;
}

/* 注册覆盖层和动画样式 */
.register-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.register-modal-enter-active,
.register-modal-leave-active {
  transition: all 0.2s ease-out;
}
.register-modal-enter-from,
.register-modal-leave-to {
  opacity: 0;
}
.register-modal-enter-from .register-box {
  transform: scale(0.75);
}
</style>