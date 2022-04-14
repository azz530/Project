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
              name: "学生信息",
              path: "admin_std",
            },
          ],
        },
        {
          icon: "iconfont icon-fenxi",
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
          icon: "iconfont icon-fenxi",
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
          icon: "iconfont icon-fenxi",
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
          icon: "iconfont icon-fenxi",
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
          icon: "iconfont icon-kechengguanli",
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
          icon: "iconfont icon-kechengguanli",
          name: "信息管理",
          id: 7,
          children: [
            {
              name: "首页信息",
              path: "information_manage",
            },
          ],
        },
        {
          icon: "iconfont icon-fenxi",
          name: "个人中心",
          id: 8,
          children: [
            {
              name: "个人信息",
              path: "adminInfo",
            },
          ],
        },
      ],
      isCollapse: false,
    };
  },
  methods: {
    asideControll() {
      this.isCollapse = !this.isCollapse;
      this.$emit("asideControll", this.isCollapse);
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
      rgb(224, 224, 224),
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