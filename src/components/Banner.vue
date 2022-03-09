<template>
  <div class="banner_container">
    <el-carousel trigger="click" height="450px">
      <el-carousel-item v-for="item in 4" :key="item">
        <img src="../assets/img/avatar.jpg" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.banner_container{
    width: 1300px;
    margin: 20px auto;
    img{
        height: 450px;
        width: 1300px;
    }
}
</style>