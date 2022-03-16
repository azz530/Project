<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>年级管理</el-breadcrumb-item>
      <el-breadcrumb-item>年级信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border style="width: 100%" :data="ScoreList">
          <el-table-column type="index" label="序号" fixed  width="100px" align="center"></el-table-column>
          <el-table-column label="年级" prop="grade" fixed align="center"></el-table-column>
          <el-table-column label="年级组长" prop="leader" fixed align="center"></el-table-column>
          <el-table-column label="班级数" prop="class_num" align="center"></el-table-column>
          <el-table-column label="学生人数" prop="student_num" align="center"></el-table-column>
          <el-table-column label="操作" prop="" width="250px" align="center"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5,10]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.pageInfo.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      GradeList: [],
      pageInfo:{
        pageNum:1,
        pageSize:5,
        total:0
      },
    };
  },
  created() {
    this.getGradeList();
  },
  methods: {
    getGradeList() {
      this.$http.get("admin/getGrade",{
        params:{
          pageNum:this.pageInfo.pageNum,
          pageSize:this.pageInfo.pageSize
        }
      }).then(({data:res})=>{
        if (res.status !== 200) {
          return this.$message.error("获取学生列表失败");
        } else{
          this.ScoreList = res.data;
          this.pageInfo.total = res.total;
        }
      });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize){
      this.pageInfo.pageSize = newSize;
      this.getScoreList(); 
    },
    //改变当前页数据变化
    handleCurrentChange(newPage){
      this.pageInfo.pageNum = newPage;
      this.getScoreList();
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
    .el-pagination{
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>