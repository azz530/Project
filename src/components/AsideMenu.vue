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
          icon: "iconfont icon-kaoqin",
          name: "学生考勤",
          id:1,
          children:[
            {
              name: "学生考勤",
              path: "student_check",
              icon: "iconfont icon-kaoqin",
            }
          ]
        },
        {
          icon: "iconfont icon-xuesheng",
          name: "学生成绩",
          id: 2,
          children: [
            {
              name: "学生成绩",
              path: "student_score",
              icon: "iconfont icon-chengjiluru",
            },
          ],
        },{
          icon: "iconfont icon-zuoye",
          name: "学生作业",
          id:3,
          children:[
            {
              name: "学生作业",
              path: "student_homework",
              icon: "iconfont icon-zuoye",
            }
          ]
        },
        {
          icon:"iconfont icon-fenxi",
          name:"学生评价",
          id:4,
          children:[
            {
              name:"学生评价",
              path:"student_evaluate",
              icon:"iconfont icon-pingjia",
            },
          ]
        },
        {
          icon: "iconfont icon-zuoye1",
          name: "通知管理",
          id: 5,
          children:[
            {
              name: "通知管理",
              path: "class_notice",
              icon: "iconfont icon-zuoye1",
            },
          ]
        },
        {
          icon:"iconfont icon-fenxi",
          name:"成绩分析",
          id:6,
          children:[
            {
              name:"成绩分析",
              path:"scoreAnalyse",
              icon:"iconfont icon-icon-",
            },
          ]
        },
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
    background: linear-gradient(to bottom right, rgb(224, 224, 224), rgb(200, 224, 255));
    border-right: none;
    box-shadow: 4px 4px 10px rgba(59, 59, 59, 0.25);
    .el-menu-item{
      padding: 0;
      margin: 0;
    }
    .iconfont {
      margin-right: 15px;
      color:rgb(0, 136, 255);
    }
  }
  .aside_btn{
    background-color: rgb(217, 232, 248);
    box-shadow: 4px 4px 10px rgba(59, 59, 59, 0.25);
    text-align: center;
    color: black;
    cursor: pointer;
    .icon-youjiantou{
      font-size: 24px;
      color: rgb(20, 156, 247);
    }
  }
}
</style>