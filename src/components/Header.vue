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
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props:['avatar'],
  data() {
    return {
      isLogin: false,
    };
  },
  created() {},
  methods: {
    handleCommand(command) {
      if (command === "userInfo") {
        if(this.$store.state.userInfo.identity==='学生'||this.$store.state.userInfo.identity==='家长'){
          this.$router.push("/userInfo");
        } else if(this.$store.state.userInfo.identity==='admin'){
          this.$router.push("/adminInfo");
        } else if(this.$store.state.userInfo.identity === '老师') {
          this.$router.push("/teacherInfo");
        }
        
      } else {
        // window.sessionStorage.clear();全部清空
        this.$confirm("是否要退出", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then((res) => {
            if (res === "confirm") {
              window.sessionStorage.removeItem("token");
              window.sessionStorage.removeItem("state");
              this.$router.push("/login");
            }
        }).catch((err) => err);
      }
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
      rgb(219, 233, 255)
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
      .el-avatar{
        cursor: pointer;
      }
    }
  }
}
</style>