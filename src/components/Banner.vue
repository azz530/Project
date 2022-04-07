<template>
  <div class="banner_container">
    <el-carousel trigger="click" height="450px">
      <el-carousel-item v-for="item in BannerList" :key="item">
        <img :src="item" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BannerList: [],
    };
  },
  created() {
    this.getBanner();
  },
  methods: {
    getBanner() {
      this.$http.get("admin/getBanner").then(({ data: res }) => {
        if (res.status !== 200) {
          return this.$message.eror("获取轮播图失败");
        } else {
          this.BannerList = res.data.picture;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.banner_container {
  width: 1300px;
  margin: 20px auto;
  img {
    height: 450px;
    width: 1300px;
  }
}
</style>