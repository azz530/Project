<template>
  <div class="container">
    <Header></Header>
    <div class="content main">
      <div class="left">
        <div class="nav">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>校园公告</el-breadcrumb-item>
            <el-breadcrumb-item>正文</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="title">
          {{ NoticeDetails.title }}
        </div>
        <div class="info">发布时间:{{ NoticeDetails.time }}</div>
        <el-divider></el-divider>
        <div class="pic1">
          <img v-if="NoticeDetailsPic" :src="NoticeDetailsPic" alt="" />
        </div>
        <div class="text">
          {{ NoticeDetails.content }}
        </div>
      </div>
      <div class="right">
        <div class="rightTitle">
          <i class="iconfont icon-gonggao"></i>
          最新动态
        </div>
        <div class="otherNotice">
          <el-timeline>
            <el-timeline-item
              v-for="item in OtherNoticeList"
              :key="item.id"
              color="rgb(68, 91, 164)"
            >
              <div class="title" @click="toNoticeDetails(item.id)">
                {{ item.title }}
              </div>
              <div class="time">
                {{ item.time }}
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
export default {
  inject: ["routerRefresh"],
  data() {
    return {
      NoticeDetails: {},
      NoticeDetailsPic: [],
      OtherNoticeList: [],
    };
  },
  created() {
    this.getNoticeById();
    this.getOtherNotice();
  },
  methods: {
    getNoticeById() {
      this.$http
        .get("home/getNoticeById", { params: { id: this.$route.query.id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取公告详情失败");
          } else {
            this.NoticeDetails = res.data;
            if (res.data.picture.length > 0) {
              this.NoticeDetailsPic = res.data.picture.split(",");
            }
          }
        });
    },
    getOtherNotice() {
      this.$http
        .get("home/getOtherNotice", { params: { id: this.$route.query.id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取其他公告详情失败");
          } else {
            this.OtherNoticeList = res.data;
          }
        });
    },
    toNoticeDetails(key) {
      this.$router.replace({ path: "/notice", query: { id: key } });
      setTimeout(() => {
        this.getNoticeById();
        this.getOtherNotice();
      }, 500);
    },
  },
  components: {
    Header,
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  background: linear-gradient(
    to bottom right,
    rgba(189, 226, 250, 0.288),
    rgba(219, 253, 255, 0.281)
  );
  .main {
    width: 1300px;
    margin: 0 auto;
  }
  .content {
    margin-top: 10px;
    background: linear-gradient(
      to bottom right,
      rgba(245, 246, 247, 0.555),
      rgba(130, 169, 247, 0.116)
    );
    min-height: 60vh;
    display: flex;
    padding-top: 20px;
    .left {
      width: 900px;
      .nav {
        .el-breadcrumb {
          font-size: 16px;
        }
      }
      .title {
          text-indent: 2cm;
          width: 800px;
        font-size: 36px;
        text-align: center;
        margin-top: 10px;
      }
      .info {
        text-align: right;
        margin-right: 5%;
      }
      .pic1 {
        text-align: center;
        margin-top: 20px;
        img {
          max-width: 400px;
          max-height: 300px;
        }
      }
      .text {
        margin-top: 40px;
        text-indent: 2cm;
      }
    }
    .right {
      width: 400px;
      .rightTitle {
        padding: 40px 0 0 30px;
        font-size: 24px;
        i {
          color: rgb(8, 67, 155);
          font-size: 50px;
        }
      }
      .otherNotice {
        padding: 20px 0 0 40px;
        .el-timeline-item {
          .title {
            font-size: 14px;
            cursor: pointer;
          }
          .time {
            color: rgb(64, 151, 250);
          }
        }
      }
    }
  }
}
</style>