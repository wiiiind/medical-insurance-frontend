<template>
  <div class="admission-registration container-fluid mt-4">
    <h2 class="mb-4">入院登记</h2>

    <div class="card">
      <div class="card-header">
        患者入院登记表单
      </div>
      <div class="card-body">
        <form @submit.prevent="submitAdmission">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="realName" class="form-label">姓名</label>
              <input type="text" class="form-control" id="realName" v-model="admissionForm.realName" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">性别</label>
              <select class="form-select" id="gender" v-model="admissionForm.gender" required>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="cardNumber" class="form-label">身份证号</label>
              <input type="text" class="form-control" id="cardNumber" v-model="admissionForm.cardNumber" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="birthday" class="form-label">出生日期</label>
              <input type="date" class="form-control" id="birthday" v-model="admissionForm.birthday" required>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="age" class="form-label">年龄</label>
              <input type="number" class="form-control" id="age" v-model.number="admissionForm.age" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="ageType" class="form-label">年龄类型</label>
              <select class="form-select" id="ageType" v-model="admissionForm.ageType" required>
                <option value="岁">岁</option>
                <option value="月">月</option>
                <option value="天">天</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="visitDate" class="form-label">入院日期</label>
              <input type="date" class="form-control" id="visitDate" v-model="admissionForm.visitDate" required>
            </div>
            <!-- 关键修改 1: "登记方式" 改为 "结算类别" -->
            <div class="col-md-6 mb-3">
              <label for="registMethod" class="form-label">结算类别</label>
              <!-- 
                将输入框改为选择框，提供“自费”和“医保”两个选项。
                v-model 仍然绑定到 admissionForm.registMethod，接口字段名不变。
              -->
              <select class="form-select" id="registMethod" v-model="admissionForm.registMethod">
                <option value="自费">自费</option>
                <option value="医保">医保</option>
              </select>
            </div>
          </div>
          <div class="row">
             <!-- 关键修改 2: "病历号" 改为 "住院号" -->
            <div class="col-md-6 mb-3">
              <label for="caseNumber" class="form-label">住院号</label>
              <!-- v-model 仍然绑定到 admissionForm.caseNumber，接口字段名不变。 -->
              <input type="text" class="form-control" id="caseNumber" v-model="admissionForm.caseNumber">
            </div>
            <div class="col-md-6 mb-3">
              <label for="homeAddress" class="form-label">家庭住址</label>
              <input type="text" class="form-control" id="homeAddress" v-model="admissionForm.homeAddress">
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">提交登记</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as admissionApi from '@/api/admission.js'

export default {
  name: 'AdmissionRegistration',
  data() {
    return {
      admissionForm: {
        caseNumber: '',
        realName: '',
        gender: '男',
        cardNumber: '',
        birthday: '',
        age: null,
        ageType: '岁',
        homeAddress: '',
        visitDate: new Date().toISOString().slice(0, 10),
        // 将 registMethod 的默认值改为更符合业务的选项
        registMethod: '医保' 
      }
    }
  },
  methods: {
    async submitAdmission() {
      try {
        await admissionApi.createAdmission(this.admissionForm)
        alert('入院登记成功！')
        this.resetForm()
      } catch (error) {
        console.error('入院登记失败:', error)
        alert('入院登记失败，请检查输入信息。')
      }
    },
    resetForm() {
      this.admissionForm = {
        caseNumber: '',
        realName: '',
        gender: '男',
        cardNumber: '',
        birthday: '',
        age: null,
        ageType: '岁',
        homeAddress: '',
        visitDate: new Date().toISOString().slice(0, 10),
        registMethod: '医保'
      }
    }
  }
}
</script>

<style scoped>
.admission-registration {
  padding: 20px;
}
.card {
    border: 1px solid #e0e0e0;
    border-radius: .5rem;
}
</style>