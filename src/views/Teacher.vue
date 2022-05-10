<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside :width="CAside? '45px':'250px'">
        <AsideMenu @asideControll="ControllAside"></AsideMenu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    //页面开始阶段获取导航栏的列表
  },
  data(){
    return {
      CAside:false,
    }
  },
  methods: {
    ControllAside(isCollapse){
      this.CAside = isCollapse;
    }
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  .el-header{
    padding: 0;
  }
  .el-aside{
    background: linear-gradient(to bottom right, rgb(206, 232, 248), rgb(229, 236, 247));
    padding: 0;
    border-radius: 0 5px 10px 0;
  }
  .el-main {
    background-color: rgb(255, 255, 255);
  }
}
</style>