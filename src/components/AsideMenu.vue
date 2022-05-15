<template>
  <div class="asideMenu_container">
    <div class="aside_btn" @click="asideControll">
      <i class="iconfont icon-youjiantou"></i>
    </div>
    <el-menu
      text-color="#0088ff"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      active-text-color="#0088ff"
    >
      <el-submenu :index="item.id + ''" v-for="item in MenuList" :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          {{ item.name }}
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="citem.path"
            v-for="citem in item.children"
            :key="citem.id"
          >
            {{ citem.name }}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      MenuList: [],
      isCollapse: false,
    };
  },
  created(){
    this.getMenuList()
  },
  methods: {
    asideControll() {
      this.isCollapse = !this.isCollapse;
      this.$emit("asideControll", this.isCollapse);
    },
    getMenuList() {
      if (this.$store.state.userInfo.identity === "管理员") {
        this.MenuList = [
          {
            icon: "iconfont icon-xuesheng",
            name: "学生管理",
            id: 1,
            children: [
              {
                name: "学生信息",
                path: "admin_std",
              },
            ],
          },
          {
            icon: "iconfont icon-banjiguanli",
            name: "班级管理",
            id: 2,
            children: [
              {
                name: "班级信息",
                path: "admin_class",
              },
            ],
          },
          {
            icon: "iconfont icon-kecheng1",
            name: "课程管理",
            id: 3,
            children: [
              {
                name: "课程信息",
                path: "admin_course",
              },
            ],
          },
          {
            icon: "iconfont icon-kaoshiguanli",
            name: "考试管理",
            id: 4,
            children: [
              {
                name: "考试信息",
                path: "exam",
              },
            ],
          },
          {
            icon: "iconfont icon-jiaolian1",
            name: "老师管理",
            id: 5,
            children: [
              {
                name: "老师信息",
                path: "admin_teacher",
              },
            ],
          },
          {
            icon: "iconfont icon-yonghuguanli_huaban",
            name: "用户管理",
            id: 6,
            children: [
              {
                name: "用户信息",
                path: "user_manage",
              },
            ],
          },
          {
            icon: "iconfont icon-xinxi",
            name: "信息管理",
            id: 7,
            children: [
              {
                name: "首页信息",
                path: "information_manage",
              },
            ],
          },
        ];
      } else if (this.$store.state.userInfo.identity === "老师") {
        this.MenuList = [
          {
            icon: "iconfont icon-wodexuesheng",
            name: "学生管理",
            id: 1,
            children: [
              {
                name: "学生信息",
                path: "student_check",
              },
            ],
          },
          {
            icon: "iconfont icon-chengjiluru",
            name: "成绩管理",
            id: 2,
            children: [
              {
                name: "学生成绩",
                path: "student_score",
              },
            ],
          },
          {
            icon: "iconfont icon-zuoye1",
            name: "作业管理",
            id: 3,
            children: [
              {
                name: "学生作业",
                path: "student_homework",
              },
            ],
          },
          {
            icon: "iconfont icon-pingjia1",
            name: "评价管理",
            id: 4,
            children: [
              {
                name: "学生评价",
                path: "student_evaluate",
              },
            ],
          },
          {
            icon: "iconfont icon-tongzhi",
            name: "通知管理",
            id: 5,
            children: [
              {
                name: "通知信息",
                path: "class_notice",
              },
            ],
          },
          {
            icon: "iconfont icon-fenxi",
            name: "成绩分析",
            id: 6,
            children: [
              {
                name: "成绩分析",
                path: "scoreAnalyse",
              },
            ],
          },
        ];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.asideMenu_container {
  margin: 0;
  padding: 0;
  .el-menu {
    background: linear-gradient(
      to bottom right,
      rgb(241, 239, 239),
      rgb(200, 224, 255)
    );
    border-right: none;
    box-shadow: 4px 4px 10px rgba(59, 59, 59, 0.25);
    .el-menu-item {
      padding: 0;
      margin: 0;
    }
    .iconfont {
      margin-right: 15px;
      color: rgb(0, 136, 255);
    }
    /deep/.el-menu-item-group__title{
      padding: 0 !important;
    }
  }
  .aside_btn {
    background-color: rgb(217, 232, 248);
    box-shadow: 4px 4px 10px rgba(59, 59, 59, 0.25);
    text-align: center;
    color: black;
    cursor: pointer;
    .icon-youjiantou {
      font-size: 24px;
      color: rgb(20, 156, 247);
    }
  }
}
</style>