<template>
  <div class="login_page">
    <el-row>
      <el-col :span="6">
        <el-card id="login_card">
          <div class="text">
            <span>欢迎登录</span>
            <p>清风教学平台</p>
          </div>
          <el-form
            :model="loginForm"
            :rules="login_rules"
            ref="login_reset"
            label-width="65px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                prefix-icon="el-icon-user"
                v-model="loginForm.username"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                prefix-icon="el-icon-lock"
                v-model="loginForm.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="身份">
              <el-select v-model="loginForm.identity">
                <el-option label="管理员" value="admin"></el-option>
                <el-option label="老师" value="teacher"></el-option>
                <el-option label="学生" value="student"></el-option>
                <el-option label="家长" value="parents"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="login_btn">
                <el-button type="primary" class="login" @click="login"
                  >登录</el-button
                >
                <el-button type="info" class="reset" @click="resetLoginForm"
                  >重置</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <div class="tips">
            <router-link to="/register" class="reguser">注册账号</router-link>
            <router-link to="/register" class="lose">忘记密码</router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        identity: "",
      },
      //登录验证规则
      login_rules: {
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
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.login_reset.resetFields();
    },
    login() {
      //登录
      this.$refs.login_reset.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let { data: res } = await this.$http.post("api/login", this.loginForm); //发起登录请求,将接口返回数据解构赋值
        if (res.status !== 200) {
          //登录弹窗
          this.$message.error("登录失败");
        } else {
          this.$message.success("登录成功");

          let token = res.token;
          this.$store.commit("setToken", token);
          this.$store.commit("setLoginStatus", true);

          window.sessionStorage.setItem("token", res.token); //将token存储到sessionStorage
          let userInfo = jwtDecode(res.token);
          this.$store.commit('setUserInfo',{
            username:userInfo.username,
            id:userInfo.id,
            identity:userInfo.identity,
            identity_id:userInfo.identity_id,
            avatar:userInfo.avatar,
            usersign:userInfo.usersign
          });
          if(userInfo.identity == 'teacher'){
            this.$router.push("/teacher");
          } else if(userInfo.identity == 'parents' || userInfo.identity == 'student') {
            this.$router.push('/home');
          } else if(userInfo.identity == 'admin') {
            this.$router.push('/admin');
          }
          
        }
        //获取后端传的token 验证token进行登录
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_page {
  background-image: url("../assets/img/login_bg.jpg");
  height: 100%;
  .el-row {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-card {
      height: 520px;
      width: 450px;
      border-top: 2px solid rgb(19, 145, 248);
      border-radius: 20px;
      .text {
        font-size: 30px;
        color: rgba(77, 135, 243, 0.904);
        font-style: oblique;
        padding-top: 20px;
      }
      .el-form {
        margin-top: 70px;
        margin-right: 20px;
        .el-select {
          width: 100%;
        }
        .login_btn {
          margin-top: 10px;
          .login {
            width: 100px;
            margin-right: 80px;
          }
          .reset {
            width: 100px;
          }
        }
      }
      .tips {
        text-align: right;
        margin-right: 20px;
        .reguser {
          color: rgb(48, 48, 253);
          margin-right: 10px;
        }
        .reguser:hover {
          color: red;
        }
        .lose{
          color: rgb(110, 110, 112);
        }
      }
    }
  }
}
</style>