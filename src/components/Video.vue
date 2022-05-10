<template>
  <div class="course_container">
    <div class="tips">
      <i class="el-icon-video-camera"></i>
      <span>推荐视频</span>
    </div>
    <div class="line"></div>
    <div class="video">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="item in videoList" :key="item.id">
          <video
            class="course_video"
            :src="item.url"
            controls
          ></video>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoList: [],
    };
  },
  created() {
    this.getVideo();
  },
  methods: {
    getVideo() {
      this.$http.get("admin/getVideo").then(({ data: res }) => {
        if (res.status !== 200) {
          return this.$message.error("获取视频信息失败");
        } else {
          this.videoList = res.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.course_container {
  margin: 40px 0;
  padding: 0;
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
    background-color:rgb(121, 152, 255);
    margin-left: 40px;
  }
  .video {
    margin-top: 40px;
    .course_video {
      width: 700px;
    }
  }
}
</style>