<template>
  <div class="container">
    <Header></Header>
    <div class="main">
      <div class="left_content">
        <el-card>
          <div class="tags">
            讨论标签:
            <el-tag
              type="info"
              v-for="tag in DiscussDetails.discuss_tags"
              :key="tag"
              >{{ tag }}</el-tag
            >
            <el-divider></el-divider>
          </div>
          <div class="article_content">
            <h2 class="title">{{ DiscussDetails.discuss_title }}</h2>
            <div class="content" v-html="DiscussDetails.discuss_content"></div>
            <el-divider></el-divider>
          </div>
        </el-card>
        <el-card class="discuss">
          <div class="top">
            <h2>讨论区</h2>
            <el-button size="small" type="primary" @click="addComments">发表评论</el-button>
          </div>
          <el-divider></el-divider>
          <Comments
            :CommentsInfo="CommentsInfo"
            v-on:updateComments="updateComment"
          ></Comments>
        </el-card>
      </div>
      <div class="right_content">
        <el-card>
          <div class="top">
            建议信息:
            <el-divider></el-divider>
          </div>
          <div class="message">
            <div class="author">
              作者:
              <el-avatar :size="30" :src="DiscussDetails.avatar?DiscussDetails.avatar:defaultAvatar"></el-avatar>
              {{ DiscussDetails.username }}
            </div>
            <div class="time">
              发布时间:<span>{{ DiscussDetails.discuss_time }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog title="发表评论" :visible.sync="addDialog" width="60%">
      <quill-editor v-model="discuss_comments"> </quill-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitComments">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import defaultAvatar from '../assets/img/avatar.jpg';
export default {
  name: "ArticleDetails",
  data() {
    return {
      DiscussDetails: {},
      CommentsInfo: {},
      addDialog: false,
      discuss_comments: "",
      defaultAvatar,
    };
  },
  created() {
    this.getDiscussDetails();
    this.getDiscussComments();
  },
  methods: {
    getDiscussDetails() {
      this.$http
        .get("my/getDiscussDetails", {
          params: { discuss_id: this.$route.query.id },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取评论详情失败");
          } else {
            if (res.data.discuss_tags) {
              res.data.discuss_tags = res.data.discuss_tags.split(",");
            }
            this.DiscussDetails = res.data;
          }
        });
    },

    getDiscussComments() {
      this.$http
        .get("my/getDiscussComments", {
          params: { discuss_id: this.$route.query.id },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取评论失败");
          } else {
            res.data.map((item) => {
              item.showReplay = false;
              item.replayContent = "";
              item.replay.map((i) => {
                i.showReplay = false;
                i.replayContent = "";
              });
            });
            this.CommentsInfo = res.data;
          }
        });
    },
    updateComment() {
      this.getDiscussComments();
    },
    addComments() {
      this.addDialog = true;
    },
    commitComments() {
      if (this.discuss_comments) {
        this.$http
          .post("my/addDiscussComments", {
            discuss_id: this.$route.query.id,
            comments_content: this.discuss_comments,
            id: this.$store.state.userInfo.id,
          })
          .then(({ data: res }) => {
            if (res.status !== 200) {
              return this.$message.error("发表评论失败");
            } else {
              this.$message.success("发表评论成功");
              this.getDiscussComments();
              this.addDialog = false;
            }
          });
      } else {
        return this.$message.error("未添加内容");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .main {
    display: flex;
    .left_content {
      width: 65vw;
      min-height: 80vh;
      margin-top: 30px;
      margin-left: 40px;
      .tags {
        .el-tag {
          margin-left: 10px;
        }
      }
      .article_content {
        .title {
          text-align: center;
        }
        .content {
          margin-top: 20px;
          text-indent: 2em;
        }
      }
      .discuss {
        margin-top: 30px;
        .top{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
      }
    }
    .right_content {
      margin-left: 60px;
      margin-top: 30px;
      width: 20vw;
      .message {
        .author {
          font-size: 16px;
          display: flex;
          align-items: center;
          .el-avatar {
            margin: 0px 10px;
          }
        }
        .time {
          margin: 10px 0;
          font-size: 16px;
          span {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>