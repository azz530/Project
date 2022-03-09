<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生作业</el-breadcrumb-item>
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
          <el-table-column label="学号" prop="student_id" fixed width="250px" align="center"></el-table-column>
          <el-table-column label="姓名" prop="student_name" width="250px" align="center"></el-table-column>
          <el-table-column label="头像" prop="" width="250px" align="center"></el-table-column>
          <el-table-column label="班级" prop="classes" width="250px" align="center"></el-table-column>
          <el-table-column label="作业" prop="" width="250px" align="center"></el-table-column>
          <el-table-column label="操作" prop="" width="235px" align="center">
          </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.pageInfo.pageindex"
        :page-sizes="[5,10]"
        :page-size="this.pageInfo.pagesize"
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
      classes: "班级选择",
      StdList: [],
      AllStdList:[],
      pageInfo:{
        pageindex:1,
        pagesize:5,
        total:0
      },
      chooseClass:"",
    };
  },
  created() {
    this.getStudentList();
  },
  methods: {
    async getStudentList() {
      const { data: res } = await this.$http.get("teacher/getStudentList");
      if (res.status !== 200) {
        return this.$message.error("获取学生列表失败");
      } else{
        this.AllStdList = res.data;
        this.changePage();
      }
    },
    async classChoose(command) {
      let { data: res } = await this.$http.get("teacher/getClassStudentList", {
        params: {
          classes: command,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("获取学生信息失败");
      } else {
        this.AllStdList = res.data;
        this.changePage();
      }
      this.chooseClass = command;
    },
    //学生打卡状态改变
    async changeStdCheck(userInfo) {
      await this.$http.put('teacher/changeStdCheck',{ 
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
    changePage(){
      this.pageInfo.total = this.AllStdList.length;
      this.pageInfo.pageindex = 1;
      this.pageInfo.pagesize = 5;
      this.StdList = this.AllStdList.filter((item,index)=>{
        return index < this.pageInfo.pagesize;
      });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize){
      this.pageInfo.pageindex = 1;
      this.pageInfo.pagesize = newSize;
      this.StdList = this.AllStdList.filter((item,index)=>{
        return index < newSize;
      });
    },
    //改变当前页数据变化
    handleCurrentChange(newPage){
      console.log(newPage);
      let currentData = this.pageInfo.pagesize*(newPage-1);//下页数据的索引
      let nextData = this.pageInfo.pagesize*newPage;//下页数据总数
      let box = [];//中间容器
      for(let i=currentData;i<nextData;i++){
        if(this.AllStdList[i]){
          box.push(this.AllStdList[i]);
        }
        this.StdList = box;
      }
      
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