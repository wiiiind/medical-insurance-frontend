<template>
  <div class="member-info-management">
    <h2>参保人员信息管理</h2>
    <p>这里将展示参保人员信息的表格，并提供增删改查功能。</p>
    <!-- 参保人员信息表格 -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>姓名</th>
          <th>身份证号</th>
          <th>参保类型</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 示例数据 -->
        <tr>
          <td>1</td>
          <td>张三</td>
          <td>123456789012345678</td>
          <td>医保</td>
          <td>在职</td>
          <td>
            <button class="btn btn-sm btn-primary me-2">修改</button>
            <button class="btn btn-sm btn-danger">删除</button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>李四</td>
          <td>876543210987654321</td>
          <td>自费</td>
          <td>退休</td>
          <td>
            <button class="btn btn-sm btn-primary me-2">修改</button>
            <button class="btn btn-sm btn-danger">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 增删改查按钮 -->
    <div class="mt-3">
      <button class="btn btn-success me-2">新增人员</button>
      <button class="btn btn-info">刷新</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberInfoManagement'
}
</script>

<style scoped>
.member-info-management {
  padding: 20px;
}
</style>