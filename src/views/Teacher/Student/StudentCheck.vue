<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生考勤</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-dropdown split-button type="primary" @command="classChoose">
        {{ classes }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in classArr" :key="item.class_id" :command="item.class_id">{{item.class_name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-table border style="width: 100%" :data="StdList">
          <el-table-column type="index" label="序号" fixed width="100px" align="center"></el-table-column>
          <el-table-column label="学号" prop="student_id" fixed  align="center"></el-table-column>
          <el-table-column label="姓名" prop="student_name"  align="center"></el-table-column>
          <el-table-column label="性别" prop="sex"  align="center"></el-table-column>
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
      classArr:[],
    };
  },
  created() {
    this.getStudentList();
    this.getClass();
  },
  methods: {
    getClass(){
      this.$http.get('teacher/getClass',{params:{teacher_id:this.$store.state.userInfo.identity_id}}).then(({data:res})=>{
        console.log(res);
        if(res.status !== 200){
          return this.$message.error('获取班级失败');
        } else {
          this.classArr = res.data;
        }
      })
    },
    getStudentList() {
      this.$http.get("teacher/getStudentList",{
        params:{
          pageNum:this.pageInfo.pageNum,
          pageSize:this.pageInfo.pageSize,
          teacher_id:this.$store.state.userInfo.identity_id,
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
          class_id: command,
          pageNum:this.pageInfo.pageNum,
          pageSize:this.pageInfo.pageSize,
          teacher_id:this.$store.state.userInfo.identity_id,
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