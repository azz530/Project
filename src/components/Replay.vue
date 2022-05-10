<template>
  <div class="container">
    <div class="ReplaysUser" v-for="item in ReplayInfo" :key="item.replay_id">
      <div class="top">
        <div class="avatar">
          <el-avatar :src="item.fromAvatar?item.fromAvatar:defaultAvatar"></el-avatar>
        </div>

        <div class="message">
          <div class="top">
            <div class="username">
              {{ item.fromUsername }}
            </div>
            <div class="toUsername">
              回复
              {{ item.toUsername }}
            </div>
          </div>
          <div class="footer">
            <div class="content">{{ item.replay_content }}</div>
          </div>
          <div class="time">
            {{ item.replay_time }}
            <div class="replay" @click="openReplay(item)">回复</div>
          </div>
        </div>
      </div>
      <div class="replayContent" v-if="item.showReplay">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="item.replayContent"
        >
        </el-input>
        <div class="btn">
          <el-button
            type="primary"
            @click="addReplay(item.fromUid, item.replayContent)"
            >回复</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '../assets/img/avatar.jpg';
export default {
  props: {
    ReplayInfo: [],
    currentComment:{
      type:Number
    }
  },
  data() {
    return {
      defaultAvatar,
    };
  },
  methods: {
    openReplay(item) {
      item.showReplay = true;
    },
    addReplay(id, replayContent) {
      if (replayContent) {
        this.$http
          .post("my/addReplay", {
            comments_id: this.currentComment,
            from_uid: this.$store.state.userInfo.id,
            replay_content: replayContent,
            to_uid: id,
          })
          .then(({ data: res }) => {
            if (res.status !== 200) {
              return this.$message.error("回复失败");
            } else {
              this.$message.success("回复成功");
              this.$emit("updateReplay", true);
            }
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin-top: 20px;
  margin-left: 30px;
  .ReplaysUser {
    margin:20px 10px;
    .top {
      display: flex;
      .message {
        .top {
          width: 200px;
          margin-left: 12px;
          font-size: 14px;
        }

        .time {
          display: flex;
          margin-top: 10px;
          font-size: 14px;
          color: rgb(130, 131, 133);
        }
      }
    }
    .content {
      padding-left: 10px;
      font-size: 14px;
      color: rgb(157, 158, 158);
    }
    .replay {
      text-align: center;
      margin-left: 5px;
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