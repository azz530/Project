<template>
  <div class="main_nav">
    <el-menu mode="horizontal" text-color="#fff">
      <el-menu-item index="1">安全知识</el-menu-item>
      <el-menu-item index="2">通知公告</el-menu-item>
      <el-menu-item index="3">校园风光</el-menu-item>
      <el-menu-item index="4">教师团队</el-menu-item>
      <el-menu-item index="5">学生成绩</el-menu-item>
      <el-menu-item index="6">活动专区</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.main_nav {
  height: 8%;
  background-color: rgb(4, 185, 125);
  display: flex;
  justify-content: center;
  align-items: center;
  .el-menu {
    background-color: rgb(4, 185, 125);
    text-decoration: none;
    border: none;
    .el-menu-item {
      text-decoration: none;
      margin-left: 50px;
      font-size: 18px;
    }
  }
}
</style>