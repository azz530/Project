<template>
  <div class="page">
    <el-row>
      <el-col class="avatar">
        <el-dropdown @command="handleCommand">
          <el-avatar
            :size="40"
            :src="this.$store.state.userInfo.avatar"
          ></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
            <el-dropdown-item command="changePw">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog
      title="修改密码"
      :visible.sync="PwDialog"
      width="30%"
      @close="closePWDialog"
    >
      <el-form
        :model="PwForm"
        :rules="PwFormRules"
        label-width="100px"
        ref="pwRef"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="PwForm.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="PwForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认新密码"
          prop="checkPassword"
        >
          <el-input v-model="PwForm.checkPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitPW">确 定</el-button>
        <el-button @click="PwDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["avatar"],
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.PwForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validatePsw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        this.$http.get('api/checkPsw',{params:{
          id:this.$store.state.userInfo.id,
          oldPassword:this.PwForm.oldPassword
        }}).then(({data:res})=>{
          if(res.status !== 200){
            if(res.status === 401){
              callback(new Error('密码错误'));
            }
          }else {
            callback();
          }
        })
      }
    };
    return {
      isLogin: false,
      PwDialog: false,
      PwForm: {},
      PwFormRules: {
        oldPassword: [{required: true, validator: validatePsw, trigger: "blur"}],
        newPassword: [{required: true, message: "请输入密码", trigger: "blur"}],
        checkPassword: [{required: true, validator: validatePass2, trigger: "blur"}],
      },
    };
  },
  created() {},
  methods: {
    handleCommand(command) {
      if (command === "userInfo") {
        if (
          this.$store.state.userInfo.identity === "学生" ||
          this.$store.state.userInfo.identity === "家长"
        ) {
          this.$router.push("/userInfo");
        } else if (this.$store.state.userInfo.identity === "管理员") {
          this.$router.push("/adminInfo");
        } else if (this.$store.state.userInfo.identity === "老师") {
          this.$router.push("/teacherInfo");
        }
      } else if (command === "changePw") {
        this.PwDialog = true;
      } else {
        this.$confirm("是否要退出", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((res) => {
            if (res === "confirm") {
              window.sessionStorage.removeItem("token");
              window.sessionStorage.removeItem("state");
              this.$router.push("/login");
            }
          })
          .catch((err) => err);
      }
    },
    closePWDialog() {
      this.PwDialog = false;
      this.$refs.pwRef.resetFields();
    },
    commitPW() {
      this.$refs.pwRef.validate((valid)=>{
        if(valid){
          this.$http.put('api/changePsw',this.PwForm,{params:{id:this.$store.state.userInfo.id}}).then(({data:res})=>{
            if(res.status!==200){
              return this.$message.error('修改密码失败');
            } else {
              this.$message.success('修改密码成功');
              this.PwDialog = false;
            }
          })
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  margin: 0;
  padding: 0;
  .el-row {
    height: 60px;
    background: linear-gradient(
      to bottom right,
      rgb(245, 251, 255),
      rgba(219, 238, 255, 0.795)
    );
    .title {
      height: 100%;
      line-height: 60px;
      text-align: center;
      .tips {
        font-size: 24px;
        font-style: oblique;
        color: rgba(77, 135, 243, 0.904);
      }
    }
    .avatar {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: right;
      padding-right: 2%;
      .el-avatar {
        cursor: pointer;
      }
    }
  }
}
</style>