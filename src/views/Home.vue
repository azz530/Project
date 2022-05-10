<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <div class="main_container">
        <Banner></Banner>
        <SchoolRule></SchoolRule>
        <Video></Video>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {

};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  background: linear-gradient(
    to bottom right,
    rgba(215, 219, 223, 0.288),
    rgba(238, 241, 241, 0.281)
  );
  .el-header {
    padding: 0;
  }
  .el-main {
    padding: 0;
    margin: 0;
    .main_container {
      width: 1300px;
      margin: 0 auto;
    }
  }
}
</style>