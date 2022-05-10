<template>
  <div class="container">
    <div class="tips">
      <i class="iconfont icon-gonggao"></i>
      <span>校园公告</span>
    </div>
    <div class="line"></div>
    <div class="notice">
      <div class="notice1">
        <div class="notice1_item" v-for="item in leftNotice" :key="item.id" @click="toNoticeDetails(item.id)">
          <div class="title">
            <div class="righticon">></div>
            {{ item.title }}
          </div>
          <div class="time">({{ item.time }})</div>
        </div>
      </div>
      <div class="notice1">
        <div class="notice1_item" v-for="item in rightNotice" :key="item.id" @click="toNoticeDetails(item.id)">
          <div class="title">
            <div class="righticon">></div>
            {{ item.title }}
          </div>
          <div class="time">({{ item.time }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftNotice: [],
      rightNotice: [],
    };
  },
  created() {
    this.getNotice();
  },
  methods: {
    getNotice() {
      this.$http.get("home/getNotice").then(({ data: res }) => {
        if (res.status !== 200) {
          return this.$message.error("获取公告信息失败");
        } else {
          this.leftNotice = res.leftData;
          this.rightNotice = res.rightData;
        }
      });
    },
    toNoticeDetails(key){
      this.$router.replace({path:'/notice',query:{id:key}});
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 0;
  margin: 40px 0;
  max-height: 30vh;
  .tips {
    display: flex;
    align-items: center;
    i {
      color: rgb(121, 152, 255);
      font-size: 40px;
    }
    span {
      color: rgb(121, 152, 255);
      margin-left: 10px;
      font-size: 24px;
    }
  }
  .line {
    height: 2px;
    width: 1260px;
    background-color: rgb(121, 152, 255);
    margin-left: 40px;
  }
  .notice {
    margin-top: 20px;
    display: flex;
    .notice1 {
      margin-right: 100px;
      .notice1_item {
        width: 500px;
        display: flex;
        padding: 6px 0;
        margin-left: 40px;
        border-bottom: 1px solid rgba(235, 233, 233, 0.993);
        color: rgb(127, 127, 133);
        justify-content: space-between;
        .title {
          display: flex;
          .righticon {
            color: rgb(10, 143, 252);
            margin-right: 10px;
          }
        }
        &:hover {
          cursor: pointer;
          color: rgb(59, 137, 255);
        }
      }
    }
  }
}
</style>