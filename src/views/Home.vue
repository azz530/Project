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
  .el-header{
    padding: 0;
  }
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