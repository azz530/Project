<template>
  <div class="container">
    <div class="item" v-for="item in DiscussInfo" :key="item.discuss_id">
      <div class="title" @click="toDiscussDetails(item.discuss_id)">
        <h4>{{ item.discuss_title }}</h4>
      </div>
      <div class="tags">
        <el-tag type="info" v-for="tag in item.discuss_tags" :key="tag">{{
          tag
        }}</el-tag>
      </div>
      <div class="message">
        <div class="time">{{ item.discuss_time }}</div>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    DiscussInfo: [],
  },
  name: "Discuss",
  data() {
    return {};
  },
  created() {
  },
  methods: {
    toDiscussDetails(id){
      this.$router.replace({path:'/discussDetails',query:{id}});
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  min-height: 120px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .title {
    margin: 10px 0;
    cursor: pointer;
    &:hover {
      color: rgb(64, 143, 247);
    }
  }
  .message {
    margin: 10px 0;
    .time {
      font-size: 12px;
      color: rgb(139, 138, 138);
    }
  }
}
</style>