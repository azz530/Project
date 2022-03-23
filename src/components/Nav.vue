<template>
  <div class="main_nav">
    <ul class="navList">
      <li
        class="navListItem"
        v-for="item in NavList"
        :key="item.id"
        @click="NavLink(item.path)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      NavList: [
        {
          id: 1,
          name: "首页",
          path: "",
        },
        {
          id: 2,
          name: "班级公告",
          path: "",
        },
        {
          id: 3,
          name: "作业列表",
          path: "",
        },
        {
          id: 4,
          name: "成绩列表",
          path: "",
        },
        {
          id: 5,
          name: "课程信息",
          path: "",
        },
        {
          id: 6,
          name: "个人中心",
          path: "/userInfo",
        },
      ],
    };
  },
  methods: {
    NavLink(path) {
      this.$router.replace(path);
    },
  },
};
</script>

<style lang="less" scoped>
.main_nav {
  height: 8%;
  background: rgb(163, 233, 250);
  display: flex;
  justify-content: center;
  .navList {
    display: flex;
    .navListItem {
      display: inline-block;
      margin: auto 0;
      text-align: center;
      width: 150px;
      &:hover {
        cursor: pointer;
        color: rgb(9, 105, 248);
      }
    }
  }
}
</style>