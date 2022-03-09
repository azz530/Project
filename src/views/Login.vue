<template>
  <div class="login_page">
    <div class="login_box">
      <div class="user_avatar">
          <img src="../assets/img/avatar.jpg" alt="">
      </div>
      <el-form class="login_form" :model="loginForm" :rules="login_rules" ref="login_reset">
        <el-form-item class="login_user_name" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item class="login_user_password" prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="login_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <router-link to="/register" class="reguser">去注册</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm:{
        username: '',
        password: ''
      },
      //登录验证规则
      login_rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.login_reset.resetFields();
    },
    login() { //登录
      this.$refs.login_reset.validate(async(valid)=>{
        if(!valid) {
          return ;
        }
        let {data:res} = await this.$http.post('api/login',this.loginForm); //发起登录请求,将接口返回数据解构赋值
        if(res.status !==200 ){ //登录弹窗
          this.$message.error('登录失败');
        } else {
          this.$message.success('登录成功');
          window.sessionStorage.setItem('token',res.token); //将token存储到sessionStorage
          this.$router.push('/home');
        }
        //获取后端传的token 验证token进行登录   
        
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_page {
  background-image: url("../assets/img/login_bg.jpg");
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    height: 450px;
    width: 600px;
    background-color: rgb(228, 231, 233);
    border-radius: 30px;
    .user_avatar {
      height: 150px;
      width: 150px;
      background-color: red;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      margin-left: -75px;
      img{
          height: 150px;
          width: 150px;
          border-radius: 50%;
      }
    }
    .login_form{
        position: relative;
        top: 40%;
        .login_user_name{
            width: 80%;
            margin-left: 10%;
        }
        .login_user_password{
            width: 80%;
            margin-left: 10%;
        }
        .login_btn{
            margin-left: 40%;
            margin-top: 5%;
            .reguser{
              text-decoration: none;
              color: rgb(88, 119, 255);
              margin-left: 20px;
            }
        }
    }
  }
}
</style>