<template>
  <div class="course_container">
    <div class="tips">
      <i class="iconfont icon-gonggao"></i>
      <span>课程视频</span>
    </div>
    <div class="line"></div>
    <div class="video">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="item in 3" :key="item">
            <video class="course_video" src="https://v.cic.tsinghua.edu.cn/vod/video/2/d/282058.mp4" controls></video>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            video:[
                {src:'https://v.cic.tsinghua.edu.cn/vod/video/2/d/282058.mp4'}
            ]
        }
    }
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
      font-size: 40px;
    }
    span {
      margin-left: 10px;
    }
  }
  .line {
    height: 2px;
    width: 1260px;
    background-color: rgb(143, 142, 142);
    margin-left: 40px;
  }
  .video{
      margin-top: 40px;
      .course_video{
          width: 700px;
      }
  }
}
</style>