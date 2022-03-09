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
            label-width="80px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="register_form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="register_form.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input v-model="register_form.confirm_password"></el-input>
            </el-form-item>
            <el-form-item label="身份选择"  prop="identity">
              <el-select v-model="register_form.identity">
                <el-option
                  label="学生"
                  value="student"
                ></el-option>
                <el-option
                  label="访客"
                  value="visitor"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="班级" v-if="showClass" prop="classes">
              <el-select v-model="register_form.classes">
                <el-option
                  label="一班"
                  value="first"
                ></el-option>
                <el-option
                  label="二班"
                  value="seconde"
                ></el-option>
                <el-option
                  label="三班"
                  value="third"
                ></el-option>
                <el-option
                  label="四班"
                  value="fith"
                ></el-option>
              </el-select>
            </el-form-item> -->
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
    // const validateName = (rule,value,callback) =>{
    //   let reg = /^[+]{0,1}(\d+)$/g;
    //   if(this.register_form.identity=="student"){
    //     if(value===""){
    //       callback(new Error("请输入学号"));
    //     } else if(!reg.test(value)){
    //       callback(new Error("只能输入数字"));
    //     } else{
    //       callback();
    //     }
    //   } else{
    //     if(value===""){
    //       callback(new Error("请输入用户名"));
    //     } else{
    //       callback();
    //     }
    //   }
    // };
    return {
      register_form: {
        username: "",
        password: "",
        confirm_password: "",
        identity: "",
        // classes:""
      },
      register_rules: {
        username: [
          {required:true,message:"请输入用户名",trigger:"blur"},
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
          { validator:validatePass2, trigger: "blur"},
        ],
      },
      showClass:false,
    };
  },
  methods: {
    // getSelect(identity){
    //   if(identity=="student"){
    //     this.showClass = true;
    //   } else{
    //     this.showClass = false;
    //   }
    // },
    resRegForm() {
      this.$refs.register_reset.resetFields();
    },
    register() {
      console.log(this.register_form);
      this.$refs.register_reset.validate(async(valid)=>{
        if(!valid){
          return;
        }else{
          let {data:res} = await this.$http.post('api/reguser',this.register_form);
          if(res.status !==200 ){
            this.$message.error("注册失败,请重试");
          }else{
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
      height: 450px;
      border-radius: 15px;
      span {
        display: block;
        margin-bottom: 20px;
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