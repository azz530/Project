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
import AsideMenu from '../components/AsideMenu.vue'
import Header from '../components/Header.vue'
export default {
  created() {
    //页面开始阶段获取导航栏的列表
  },
  data(){
    return {
      CAside:false,
    }
  },
  components:{
    AsideMenu,
    Header
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
  .el-aside{
    background-color: rgb(241, 238, 238);
  }
  .el-main {
    background-color: rgb(255, 255, 255);
  }
}
</style>