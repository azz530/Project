<template>
  <div class="asideMenu_container">
    <div class="aside_btn" @click="asideControll">
      <i class="iconfont icon-youjiantou"></i>
    </div>
    <el-menu
      background-color="#eaeaeb"
      text-color="#3a3e41"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
    >
      <el-submenu
        :index="item.id + ''"
        v-for="item in menu_items"
        :key="item.id"
      >
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="citem.path"
            v-for="citem in item.children"
            :key="citem.id"
          >
            <i :class="citem.icon"></i>
            <span>{{ citem.name }}</span>
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
      menu_items: [
        {
          icon: "iconfont icon-xuesheng",
          name: "学生管理",
          id: 1,
          children: [
            {
              name: "学生考勤",
              path: "student_check",
              icon: "iconfont icon-kaoqin",
            },
            {
              name: "学生作业",
              path: "student_homework",
              icon: "iconfont icon-zuoye",
            },
            {
              name: "学生成绩",
              path: "student_score",
              icon: "iconfont icon-chengjiluru",
            },
          ],
        },
        {
          icon: "iconfont icon-kechengguanli",
          name: "课程管理",
          id: 2,
          children: [
            {
              name: "课程选择",
              path: "course_choose",
              icon: "iconfont icon-xuanze",
            },
            {
              name:"课程作业",
              path:"course_work",
              icon:"iconfont icon-zuoye1",
            },
            {
              name:"课程信息",
              path:"course_information",
              icon:"iconfont icon-kecheng",
            }
          ],
        },
        {
          icon:"iconfont icon-fenxi",
          name:"数据模块",
          id:3,
          children:[
            {
              name:"成绩分析",
              path:"data_score",
              icon:"iconfont icon-icon-",
            },
            {
              name:"学生评价",
              path:"data_evaluate",
              icon:"iconfont icon-pingjia",
            },
            {
              name:"成绩曲线",
              path:"course_information",
              icon:"iconfont icon-quxiantu",
            }
          ]
        }
      ],
      isCollapse:false
    };
  },
  methods: {
    asideControll(){
      this.isCollapse = !this.isCollapse;
      this.$emit("asideControll",this.isCollapse);
    }
  },
};
</script>

<style lang="less" scoped>
.asideMenu_container {
  margin: 0;
  padding: 0;
  .el-menu {
    border-right: none;
    .iconfont {
      margin-right: 15px;
    }
  }
  .aside_btn{
    background-color: rgb(225, 228, 228);
    text-align: center;
    color: black;
    cursor: pointer;
    .icon-youjiantou{
      font-size: 24px;
    }
  }
}
</style>