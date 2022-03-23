<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>年级管理</el-breadcrumb-item>
      <el-breadcrumb-item>年级信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border style="width: 100%" :data="GradeList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="150px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="年级"
          prop="grade_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="年级组长"
          prop="teacher_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="班级数"
          prop="class_num"
          align="center"
        ></el-table-column>
        <el-table-column
          label="学生人数"
          prop="student_num"
          align="center"
        ></el-table-column>
      </el-table>
    </el-card>


  </div>
</template>

<script>
export default {
  data() {
    return {
      GradeList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
    };
  },
  created() {
    this.getGradeList();
  },
  methods: {
    getGradeList() {
      this.$http.get("admin/getGradeInfo").then(({ data: res }) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取年级列表失败");
        } else {
          this.GradeList = res.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 0;
  padding: 0;
  .el-breadcrumb {
    margin-bottom: 15px;
  }
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
    .el-table {
      margin-top: 30px;
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>