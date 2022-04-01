<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生成绩</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-dropdown split-button type="primary" @command="classChoose">
        {{ classChose }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in classArr"
            :key="item.class_id"
            :command="item.class_id"
            >{{ item.class_name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-table border style="width: 100%" :data="ScoreList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="学号"
          prop="student_id"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="student_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="班级"
          prop="class_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="科目"
          prop="course_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="成绩"
          prop="score"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="" width="250px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改成绩"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="changeScore(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5, 10]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.pageInfo.total"
      >
      </el-pagination>
    </el-card>
        <el-dialog
      title="修改成绩"
      :visible.sync="isShow"
      width="15%"
      @close="closeDialog"
    >
      <el-input oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="StdScore" placeholder="请输入成绩"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeStdScore">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classChose: "班级选择",
      ScoreList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      classArr: [],
      isShow:false,
      StdScore:null,
      Sid:null,
    };
  },
  created() {
    this.getScoreList();
    this.getClass();
  },
  methods: {
    getClass() {
      this.$http
        .get("teacher/getClass", {
          params: { teacher_id: this.$store.state.userInfo.identity_id },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取班级失败");
          } else {
            this.classArr = res.data;
          }
        });
    },
    getScoreList() {
      this.$http
        .get("teacher/getStdScore", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取学生列表失败");
          } else {
            this.ScoreList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    classChoose(command) {
      this.$http
        .get("teacher/getClassStdScore", {
          params: {
            class_id: command,
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
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
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getScoreList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getScoreList();
    },
    changeScore(data){
      this.isShow = true;
      this.Sid = data.student_id;
      this.StdScore = data.score;
    },
    closeDialog(){
      this.isShow = false;
    },
    changeStdScore(){
      console.log(this.Sid);
      this.$http.put('teacher/changeStdScore',{
        student_id:this.Sid,
        score:this.StdScore,
      }).then(({data:res})=>{
        console.log(res);
        if(res.status !== 200){
          return this.$message.error('修改失败');
        } else {
          this.$message.success('修改成功');
          this.isShow = false;
          this.getScoreList();
        }
      })
    }
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