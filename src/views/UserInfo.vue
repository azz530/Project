<template>
  <div class="container">
    <Header></Header>
    <div class="main_container">
      <el-row>
        <el-col :span="16">
          <el-card class="userMessage-card">
            <el-card class="homeWorkInfo"> 作业信息 </el-card>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="userInfo-card">
            <div class="userInfo">
              <el-avatar
                :size="150"
                :src="userInfo.avatar ? userInfo.avatar : default_avatar"
              ></el-avatar>
              <el-upload
                ref="upload"
                action="http://127.0.0.1:3000/admin/uploadAvatar"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
                :limit="1"
                :data="{ id }"
                name="avatar"
              >
                <el-button size="small" type="primary">修改头像</el-button>
              </el-upload>
              <p class="username">{{ userInfo.username }}</p>
              <p class="usersign">签名:{{ userInfo.usersign }}</p>
            </div>
            <div class="usermessage">
              <el-row>
                <el-col :span="8">
                  <i class="iconfont icon-cardid"></i>
                </el-col>
                <el-col :span="16">
                  <p>{{ userInfo.identity }}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <i class="iconfont icon-shengrix"></i>
                </el-col>
                <el-col :span="16">
                  <p>{{ userInfo.birthday }}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <i class="iconfont icon-dizhi"></i>
                </el-col>
                <el-col :span="16">
                  <p>{{ userInfo.address }}</p>
                </el-col>
              </el-row>
            </div>
            <div class="userTag">
              <div class="tag">用户标签</div>
              <div class="tag_contoent">
                <el-tag
                  :key="tag"
                  v-for="tag in userTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >新增标签</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
export default {
  components: {
    Header,
  },
  data() {
    return {
      default_avatar: "https://i02piccdn.sogoucdn.com/54b55e50edd9d56a",
      userInfo: {},
      id: "",
      userTags: [],
      inputVisible: false,
      inputValue: "",
      activeNames: "1",
      userLog: {},
    };
  },
  created() {
    this.getUserInfo();
    this.getUserLog();
  },
  methods: {
    getUserInfo() {
      this.userInfo = this.$store.state.userInfo;
      this.id = this.$store.state.userInfo.id;
      this.$http
        .get("my/getUserInfo", {
          params: { id: this.$store.state.userInfo.id },
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取用户信息失败");
          } else {
            this.userInfo = res.data;
            let tags = res.data.tags;
            if (tags) {
              this.userTags = tags.split(",");
            }
          }
        });
    },

    getUserLog() {
      this.$http.get("admin/getUserLog").then(({ data: res }) => {
        this.userLog = res.data;
      });
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleSuccess(res, file) {
      if (res.meta.status === 200) {
        this.userInfo.avatar = URL.createObjectURL(file.raw);
        this.$refs.upload.clearFiles(); //上传成功后删除历史记录
        this.$message.success("更换头像成功");
      }
    },

    handleClose(tag) {
      this.userTags.splice(this.userTags.indexOf(tag), 1);
      this.$http
        .put("my/delTags", this.userTags, { params: { id: this.id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            this.$message.error("删除标签失败");
          } else {
            this.$message.success("删除标签成功");
          }
        });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.$http
          .put(
            "my/addTags",
            { tags: inputValue },
            {
              params: { id: this.id },
            }
          )
          .then(({ data: res }) => {
            console.log(res);
            if (res.status !== 200) {
              if (res.status === 402) {
                return this.$message.error("该标签已存在");
              }
              return this.$message.error("新增标签失败");
            } else {
              this.userTags.push(inputValue);
              return this.$message.success("新增标签成功");
            }
          });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 0;
  padding: 0;
  .main_container {
    display: flex;
    flex-direction: row;
    .userMessage-card {
      margin-top: 20px;
      margin-left: 20px;
      height: 100vh;
    }
    .userInfo-card {
      width: 400px;
      height: 60vh;
      margin-top: 20px;
      margin-left: 30px;
      .userInfo {
        text-align: center;
        .el-avatar {
          box-shadow: 5px 10px 10px rgb(193, 194, 194);
        }
        .el-upload {
          .el-button {
            margin-top: 20px;
          }
        }
        .username {
          margin: 20px 0;
          font-size: 26px;
        }
        .usersign {
          font-size: 14px;
          font-weight: 150;
          color: rgb(65, 66, 66);
        }
      }
      .usermessage {
        margin-top: 20px;
        .el-row {
          margin-top: 10px;
        }
        .el-col {
          i {
            display: block;
            text-align: right;
            font-size: 18px;
            padding-right: 10px;
          }
          p {
            line-height: 16px;
            font-size: 16px;
            color: rgb(146, 144, 144);
          }
        }
      }
      .userTag {
        margin-top: 20px;
        border-top: 1px solid rgb(153, 152, 152);
        .tag {
          margin-top: 10px;
        }
        .tag_contoent {
          margin-top: 20px;
          .el-tag {
            margin-right: 5px;
            margin-top: 5px;
          }
        }
      }
    }
    .right-card {
      flex: 5;
      i {
        font-size: 22px;
        margin-right: 10px;
      }
      .tilte {
        font-size: 20px;
      }
    }
  }
}
</style>