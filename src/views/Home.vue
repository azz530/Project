<template>
  <el-container class="home_container">
    <el-header>
      <div class="home_icon">
        <span>教学平台</span>
      </div>
      <div class="home_user">
        <img src="../assets/img/avatar.jpg" alt="" />
        <a href="#">登录</a>
      </div>
    </el-header>
    <el-main>
      <div class="main_nav">
        <el-menu
          mode="horizontal"
          text-color="#fff"
        >
          <el-menu-item index="1">安全知识</el-menu-item>
          <el-submenu index="2">
            <template slot="title">通知公告</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="3">消息中心</el-menu-item>
          <el-menu-item index="4"
            ><a href="#" target="_blank"
              >订单管理</a
            ></el-menu-item
          >
        </el-menu>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    // logout(){
    // 退出登录 弹出窗口 清空sessionStorage 返回登录页面
    //     window.sessionStorage.clear();全部清空
    //     window.sessionStorage.removeItem('token');
    //     this.$router.push('/login');
    // }
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100vh;
  .el-header {
    background: url("../assets/img/header_bg.jpg");
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 24px;
      color: rgb(81, 174, 255);
      margin-left: 100px;
    }
    .home_user {
      display: flex;
      align-items: center;
      margin-right: 100px;
      img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
      }
      a {
        text-decoration: none;
        margin-left: 10px;
      }
    }
  }
  .el-main {
    padding: 0;
    margin: 0;
    .main_nav {
      height: 8%;
      background-color: rgb(4, 185, 125);
      display: flex;
      justify-content: center;
      align-items: center;
      .el-menu{
        background-color: rgb(4, 185, 125);
        text-decoration: none;
        border: none;
        .el-submenu{
          text-decoration: none;
        }
        .el-menu-item{
          text-decoration: none;
        }
      }
    }
  }
  .el-footer {
    padding: 0;
    margin: 0;
    background-color: rgb(190, 189, 189);
  }
}
</style>