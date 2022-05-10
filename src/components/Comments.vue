<template>
  <div class="container">
    <div
      class="CommentsUser"
      v-for="item in CommentsInfo"
      :key="item.comments_id"
    >
      <div class="top">
        <div class="avatar">
          <el-avatar :src="item.avatar"></el-avatar>
        </div>

        <div class="message">
          <div class="username">
            {{ item.username }}
          </div>
          <div class="time">
            {{ item.comments_time }}
          </div>
        </div>
      </div>

      <div class="content" v-html="item.comments_content"></div>
      <div class="replay" @click="openReplay(item)">回复</div>
        
      <Replay :ReplayInfo="item.replay" :currentComment="item.comments_id" v-on:updateReplay="updateReplays" v-if="item.replay"></Replay>
      <div class="replayContent" v-if="item.showReplay">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="item.replayContent"
        >
        </el-input>
        <div class="btn">
          <el-button type="primary" @click="replay(item.id,item.comments_id,item.replayContent)">回复</el-button>
        </div>
      </div>

      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    CommentsInfo: [],
  },
  data() {
    return {
    };
  },
  methods: {
    openReplay(item) {
      item.showReplay = true;
    },
    replay(id,comments_id,replayContent){
        if(replayContent){
            this.$http.post('my/addReplay',{
                comments_id:comments_id,
                from_uid:this.$store.state.userInfo.id,
                replay_content:replayContent,
                to_uid:id,
            }).then(({data:res})=>{
                if(res.status !== 200){
                    return this.$message.error('回复失败');
                } else {
                    this.$message.success('回复成功');
                    this.$emit('updateComments',true);
                }
            })
        }
    },
    updateReplays(){
        this.$emit('updateComments',true);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .CommentsUser {
    .top {
      display: flex;
      .message {
        width: 200px;
        margin-left: 12px;
        .time {
          font-size: 14px;
          color: rgb(130, 131, 133);
        }
      }
    }
    .content {
      margin: 20px 0;
      padding-left: 10px;
    }
    .replay {
      text-align: center;
      margin-left: 20px;
      width: 40px;
      &:hover {
        cursor: pointer;
        color: rgb(76, 128, 241);
        background-color: rgb(241, 238, 238);
        border-radius: 5px;
      }
    }
    .replayContent {
      margin-top: 20px;
      .el-input {
        width: 200px;
      }
      .btn {
        text-align: right;
        margin-top: 10px;
      }
    }
  }
}
</style>