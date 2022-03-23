<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生考勤</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-dropdown split-button type="primary" @command="classChoose">
        {{ classes }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="一班">一班</el-dropdown-item>
          <el-dropdown-item command="二班">二班</el-dropdown-item>
          <el-dropdown-item command="三班">三班</el-dropdown-item>
          <el-dropdown-item command="四班">四班</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-table border style="width: 100%" :data="StdList">
          <el-table-column type="index" label="序号" fixed width="100px" align="center"></el-table-column>
          <el-table-column label="学号" prop="student_id" fixed  align="center"></el-table-column>
          <el-table-column label="姓名" prop="student_name"  align="center"></el-table-column>
          <el-table-column label="头像" prop=""  align="center"></el-table-column>
          <el-table-column label="班级" prop="class_name"  align="center"></el-table-column>
          <el-table-column label="日期" prop="" align="center"></el-table-column>
          <el-table-column label="打卡状态" prop="" width="235px" align="center">
            <template v-slot="scope">
              <el-switch v-model="scope.row.student_check" @change="changeStdCheck(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5,10]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classes: "班级选择",
      StdList: [],
      pageInfo:{
        pageNum:1,
        pageSize:5,
        total:0
      },
    };
  },
  created() {
    this.getStudentList();
  },
  methods: {
    getStudentList() {
      this.$http.get("teacher/getStudentList",{
        params:{
          pageNum:this.pageInfo.pageNum,
          pageSize:this.pageInfo.pageSize
        }
      }).then(({data:res})=>{
        if (res.status !== 200) {
          return this.$message.error("获取学生列表失败");
        } else{
          this.StdList = res.data;
          this.pageInfo.total = res.total;
        }
      });
    },
    classChoose(command) {
      this.$http.get("teacher/getClassStudentList", {
        params: {
          classes: command,
          pageNum:this.pageInfo.pageNum,
          pageSize:this.pageInfo.pageSize
        },
      }).then(({data:res})=>{
        if (res.status !== 200) {
          return this.$message.error("获取学生信息失败");
        } else {
          this.StdList = res.data;
          this.pageInfo.total = res.total;
        }
      });
    },
    //学生打卡状态改变
    changeStdCheck(userInfo) {
      this.$http.put('teacher/changeStdCheck',{ 
        student_id:userInfo.student_id,
        student_check:userInfo.student_check  
      }).then(res=>{
        if(res.data.status!==200){
          return this.$message.error("更新打卡状态失败");
        } else {
          return this.$message.success("更改成功");
        }
      });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize){
      this.pageInfo.pageSize = newSize;
      this.getStudentList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage){
      this.pageInfo.pageNum = newPage;
      this.getStudentList();
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