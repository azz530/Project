<template>
  <div class="container">
    <el-row>
      <el-col :span="6">
        <el-card>
          <span>注册用户</span>
          <el-form
            :model="register_form"
            ref="register_reset"
            :rules="register_rules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="register_form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="register_form.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input
                v-model="register_form.confirm_password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="身份选择" prop="identity">
              <el-select v-model="register_form.identity">
                <el-option label="学生" value="学生"></el-option>
                <el-option label="家长" value="家长"></el-option>
                <el-option label="老师" value="老师"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学号/教师号" prop="identity_id" v-if="register_form.identity === '学生'||register_form.identity === '老师'?true:false">
              <el-input v-model="register_form.identity_id"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="register">提交</el-button>
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
      } else if (value !== this.register_form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validateNum = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === "") {
        callback(new Error("请输入学号/教师号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        if (this.register_form.identity) {
          this.$http
            .get("api/getUserID", {
              params: {
                identity: this.register_form.identity,
                identity_id: value,
              },
            })
            .then(({ data: res }) => {
              if (res.status !== 200) {
                if (res.status === 403) {
                  callback(new Error("该学号不存在"));
                } else if (res.status === 404) {
                  callback(new Error("该学号已被绑定"));
                } else if (res.status === 405) {
                  callback(new Error("该教师号不存在"));
                } else if (res.status === 406) {
                  callback(new Error("该教师号已被绑定"));
                }
              } else {
                callback();
              }
            });
        } else {
          callback(new Error("请选择身份"));
        }
      }
    };
    return {
      register_form: {
        username: "",
        password: "",
        confirm_password: "",
        identity: "",
        avatar: "",
      },
      register_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
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
        confirm_password: [{ required:true, validator: validatePass2, trigger: "blur" }],
        identity:[{required:true,message:'请选择身份',trigger:["change","blur"]}],
        identity_id: [
          { required: true, validator: validateNum, trigger: "blur" },
        ],
      },
      showClass: false,
    };
  },
  methods: {
    resRegForm() {
      this.$refs.register_reset.resetFields();
    },
    register() {
      //注册
      this.$refs.register_reset.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          let { data: res } = await this.$http.post(
            "api/reguser",
            this.register_form
          );
          if (res.status !== 200) {
            this.$message.error("注册失败,请重试");
          } else {
            this.$message.success("注册成功");
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