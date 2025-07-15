<template>
  <div class="member-reimbursement">
    <h2>参保人员费用报销</h2>
    <p>这里将是参保人员费用报销的功能。</p>
    <form>
      <div class="mb-3">
        <label for="reimbursementMemberName" class="form-label">参保人员姓名</label>
        <input type="text" class="form-control" id="reimbursementMemberName" placeholder="请输入参保人员姓名">
      </div>
      <div class="mb-3">
        <label for="totalAmount" class="form-label">总金额</label>
        <input type="number" class="form-control" id="totalAmount" readonly value="100.00">
      </div>
      <div class="mb-3">
        <label for="reimbursementAmount" class="form-label">报销金额</label>
        <input type="number" class="form-control" id="reimbursementAmount" readonly value="70.00">
      </div>
      <button type="submit" class="btn btn-primary">执行报销</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MemberReimbursement'
}
</script>

<style scoped>
.member-reimbursement {
  padding: 20px;
}
</style>