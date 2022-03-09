<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main> 
      <Nav></Nav>
      <div class="main_container"> 
        <Banner></Banner> 
        <SchoolRule></SchoolRule>
        <Course></Course>
      </div> 
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import Banner from '../components/Banner.vue'
import Nav from '../components/Nav.vue'
import Header from '../components/Header.vue'
import SchoolRule from '../components/SchoolRule.vue'
import Course from '../components/Course.vue'
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
  components:{
    Banner,
    Nav,
    Header,
    SchoolRule,
    Course
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
  .el-main {
    padding: 0;
    margin: 0;
    .main_container{
      width: 1300px;
      margin: 0 auto;
    }
  }
  .el-footer {
    padding: 0;
    margin: 0;
    background-color: rgb(242, 243, 249);
  }
}
</style>