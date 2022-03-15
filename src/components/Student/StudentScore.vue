<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生成绩</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-dropdown split-button type="primary" @command="classChoose">
        {{ course }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="语文">语文</el-dropdown-item>
          <el-dropdown-item command="数学">数学</el-dropdown-item>
          <el-dropdown-item command="英语">英语</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-table border style="width: 100%" :data="ScoreList">
          <el-table-column type="index" label="序号" fixed width="100px" align="center"></el-table-column>
          <el-table-column label="学号" prop="student_id" fixed width="250px" align="center"></el-table-column>
          <el-table-column label="姓名" prop="student_name" width="250px" align="center"></el-table-column>
          <el-table-column label="班级" prop="classes" width="250px" align="center"></el-table-column>
          <el-table-column label="科目" prop="course_name" width="235px" align="center"></el-table-column>
          <el-table-column label="成绩" prop="score" width="250px" align="center"></el-table-column>
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
      course: "科目选择",
      ScoreList: [],
      pageInfo:{
        pageNum:1,
        pageSize:5,
        total:0
      },
    };
  },
  created() {
    this.getScoreList();
  },
  methods: {
    getScoreList() {
      this.$http.get("teacher/getStdScore",{
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
    classChoose(command) {
      this.$http.get("teacher/getCourseStdScore", {
        params: {
          course_name: command,
          pageNum:this.pageInfo.pageNum,
          pageSize:this.pageInfo.pageSize
        },
      }).then(({data:res})=>{
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error("获取学生信息失败");
        } else {
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