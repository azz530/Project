<template>
  <div class="header_container">
    <div class="header_icon">
        <span>教学平台</span>
    </div>
    <div class="header_user">
      <el-avatar src="../assets/img/avatar.png"></el-avatar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin:false
    }
  },
  created(){

  },
  methods:{
    toLogin(){
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="less" scoped>
.header_container {
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
  .header_user {
    display: flex;
    align-items: center;
    margin-right: 100px;
  }
}
</style>