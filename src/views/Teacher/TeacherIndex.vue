<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main_container">
      <el-card class="left-card">
        <div class="userInfo">
          <i class="el-icon-setting" @click="editUserInfo"></i>
          <el-avatar
            :size="150"
            :src="userInfo.avatar ? userInfo.avatar : default_avatar"
          ></el-avatar>
          <el-upload
            ref="upload"
            action="http://127.0.0.1:3000/my/uploadAvatar"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :limit="1"
            :data="{ id }"
            :headers="headers"
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
              <i
                :class="
                  userInfo.sex === '女'
                    ? 'iconfont icon-xingbienv'
                    : 'iconfont icon-nan'
                "
              ></i>
            </el-col>
            <el-col :span="16">
              <p>{{ userInfo.sex }}</p>
            </el-col>
          </el-row>
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
      <el-card class="right-card">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item name="1">
            <template slot="title">
              <i class="iconfont icon-xuesheng"></i>
              <p class="tilte">用户操作</p>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="item in userLog"
                :key="item.id"
                :timestamp="item.log_time"
                placement="top"
              >
                <el-card>
                  <h4>{{ item.log_classify }}</h4>
                  <p>{{ item.log_classify }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-dialog
        title="修改个人信息"
        :visible.sync="editDialog"
        width="35%"
        @close="closeEditDialog"
      >
        <el-form
          :model="editForm"
          :rules="userFormRules"
          label-width="50px"
          ref="editRef"
        >
          <el-form-item label="用户名" label-width="80px" prop="username">
            <el-input
              v-model="editForm.username"
              class="input_short"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" label-width="80px" prop="sex">
            <el-select v-model="editForm.sex">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" label-width="80px" prop="birthday">
            <el-date-picker
              v-model="editForm.birthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="签名" label-width="80px">
            <el-input
              type="textarea"
              :rows="2"
              class="input_long"
              v-model="editForm.usersign"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址" label-width="80px" prop="address">
            <el-input
              type="textarea"
              :rows="5"
              class="input_long"
              v-model="editForm.address"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="commitEditForm">确 定</el-button>
          <el-button @click="editDialog = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers:{
        'Authorization':this.$store.state.token,
      },
      default_avatar: "https://i02piccdn.sogoucdn.com/54b55e50edd9d56a",
      userInfo: {},
      id: "",
      userTags: [],
      inputVisible: false,
      inputValue: "",
      activeNames: "1",
      userLog: {},
      editDialog: false,
      editForm: {
        username: "",
        sex: "",
        birthday: null,
        usersign: "",
        address: "",
      },
      userFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        sex: [
          {
            required: true,
            message: "选择性别",
            trigger: ["change", "blur"],
            type: "string",
          },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getUserInfo();
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
          if (res.status !== 200) {
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
      if (res.status === 200) {
        this.userInfo.avatar = res.avatarUrl;
        this.$store.commit("setUserInfo", {
          username: this.$store.state.userInfo.username,
          id: this.$store.state.userInfo.id,
          identity: this.$store.state.userInfo.identity,
          avatar: this.userInfo.avatar,
          usersign: this.$store.state.userInfo.usersign,
        });
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
        this.userTags.push(inputValue);
        this.$http
          .put(
            "my/addTags",
            { tags: inputValue },
            {
              params: { id: this.id },
            }
          )
          .then(({ data: res }) => {
            if (res.status !== 200) {
              return this.$message.error("新增标签失败");
            } else {
              return this.$message.success("新增标签成功");
            }
          });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    editUserInfo() {
      this.editDialog = true;
      this.editForm.username = this.userInfo.username;
      this.editForm.usersign = this.userInfo.usersign;
      this.editForm.sex = this.userInfo.sex;
      this.editForm.address = this.userInfo.address;
      this.editForm.birthday = this.userInfo.birthday;
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields();
    },
    commitEditForm() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("my/changeUserInfo", this.editForm, {
              params: { id: this.id },
            })
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("修改信息失败");
              } else {
                this.$message.success("修改信息成功");
                this.getUserInfo();
                this.editDialog = false;
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 0;
  padding: 0;
  .el-breadcrumb {
    margin-bottom: 15px;
  }
  .main_container {
    display: flex;
    flex-direction: row;
    .left-card {
      flex: 3;
      margin-right: 30px;
      height: 60vh;
      .userInfo {
        text-align: center;
        position: relative;
        .el-icon-setting{
          cursor: pointer;
          position: absolute;
          left: 0;
        }
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