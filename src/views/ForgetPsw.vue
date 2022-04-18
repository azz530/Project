<template>
  <div class="container">
    <el-row>
      <el-col :span="6">
        <el-card>
          <span>忘记密码</span>
          <el-form
            :model="Pswform"
            ref="Pswref"
            :rules="Pswrules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="Pswform.username"></el-input>
            </el-form-item>
            <el-form-item label="身份确认" prop="identity">
              <el-select v-model="Pswform.identity">
                <el-option label="学生" value="学生"></el-option>
                <el-option label="家长" value="家长"></el-option>
                <el-option label="老师" value="老师"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="学号/教师号"
              prop="identity_id"
              v-if="
                Pswform.identity === '学生' || Pswform.identity === '老师'
                  ? true
                  : false
              "
            >
              <el-input v-model="Pswform.identity_id"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="Pswform.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input
                v-model="Pswform.confirm_password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="forgetPsw">提交</el-button>
              <el-button type="info" @click="resRegForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.Pswform.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validateUserNmae = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        this.$http
          .get("api/checkUser", { params: { username: value } })
          .then(({ data: res }) => {
            if (res.status === 200) {
              callback();
            } else {
              callback(new Error("用户名不存在"));
            }
          });
      }
    };
    const validateNum = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === "") {
        callback(new Error("请输入学号/教师号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
          callback();
      }
    };
    return {
      Pswform: {},
      Pswrules: {
        username: [
          { required: true, validator: validateUserNmae, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "长度在 8 到 16 个字符",
            trigger: "blur",
          },
        ],
        confirm_password: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        identity: [
          {
            required: true,
            message: "请选择身份",
            trigger: ["change", "blur"],
          },
        ],
        identity_id: [
          { required: true, validator:validateNum, trigger: "blur" },
        ],
        userId: "",
      },
    };
  },
  methods: {
    resRegForm() {
      this.$refs.Pswref.resetFields();
    },
    forgetPsw() {
      this.$refs.Pswref.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          let { data: res } = await this.$http.post(
            "api/forgetPsw",
            this.Pswform
          );
          if (res.status !== 200) {
            if (res.status === 402) {
              return this.$message.error("身份信息错误,请重试");
            }
            this.$message.error("修改密码失败,请重试");
          } else {
            this.$message.success("修改密码成功");
            this.$router.push("/login");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background-image: url("../assets/img/login_bg.jpg");
  height: 100%;
  .el-row {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-card {
      border-radius: 15px;
      span {
        display: block;
        margin-bottom: 40px;
        font-size: 30px;
        color: rgba(77, 135, 243, 0.904);
        font-style: oblique;
      }
      .el-form {
        margin-right: 20px;
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>