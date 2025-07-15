<template>
  <div class="member-expense-query">
    <h2>参保人员费用查询</h2>
    <p>这里将展示参保人员的费用查询功能。</p>
    <form class="row g-3">
      <div class="col-auto">
        <label for="memberName" class="visually-hidden">参保人员姓名</label>
        <input type="text" class="form-control" id="memberName" placeholder="请输入参保人员姓名">
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3">查询</button>
      </div>
    </form>

    <!-- 费用查询结果表格 -->
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>费用类型</th>
          <th>项目名称</th>
          <th>金额</th>
          <th>日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 示例数据 -->
        <tr>
          <td>1</td>
          <td>药品</td>
          <td>阿莫西林胶囊</td>
          <td>12.50</td>
          <td>2023-01-15</td>
          <td><button class="btn btn-sm btn-info">查看详情</button></td>
        </tr>
        <tr>
          <td>2</td>
          <td>诊疗项目</td>
          <td>血常规</td>
          <td>20.00</td>
          <td>2023-01-16</td>
          <td><button class="btn btn-sm btn-info">查看详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'MemberExpenseQuery'
}
</script>

<style scoped>
.member-expense-query {
  padding: 20px;
}
</style>