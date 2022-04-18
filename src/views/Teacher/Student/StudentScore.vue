<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生成绩</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border style="width: 100%" :data="ExamList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="考试号"
          prop="exam_id"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="考试名称"
          prop="exam_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="考试信息"
          prop="exam_message"
          align="center"
        ></el-table-column>
        <el-table-column label="考试时间" prop="" align="center">
          <template v-slot="scope">
            {{ scope.row.start_time }} ~ {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column label="成绩录入" prop="" width="250px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="成绩录入"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                @click="editExamScore(scope.row.exam_id)"
                >成绩录入</el-button
              >
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
      <el-input
        oninput="value=value.replace(/[^0-9.]/g,'')"
        v-model="Score"
        placeholder="请输入成绩"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeStdScore">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="录入成绩"
      :visible.sync="ExamScoreDialog"
      width="50%"
      @close="closeExamScoreDialog"
    >
      <el-card>
        <el-dropdown split-button type="primary" @command="classChoose">
          {{ classChose }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in classArr"
              :key="item.class_id"
              :command="item.class_id"
              >{{ item.class_name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-table border style="width: 100%" :data="StudentList">
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
            fixed
            align="center"
          ></el-table-column>
          <el-table-column
            label="班级"
            prop="class_name"
            fixed
            align="center"
          ></el-table-column>
          <el-table-column
            label="性别"
            prop="sex"
            align="center"
          ></el-table-column>
          <el-table-column label="成绩" prop="score" align="center">
          </el-table-column>
          <el-table-column label="成绩录入" prop="" align="center">
            <template v-slot="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="成绩录入"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-thumb"
                  @click="changeScore(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSmallSizeChange"
          @current-change="handleSmallCurrentChange"
          :current-page="smallPageInfo.currentPage"
          :page-sizes="[5, 10]"
          :page-size="smallPageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="smallPageInfo.total"
        >
        </el-pagination>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="ExamScoreDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classChose: "班级选择",
      ExamList: [],
      StudentList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      classArr: [],
      isShow: false,
      ScoreForm: {},
      Score: null,
      ExamScoreDialog: false,
      smallPageInfo: {
        currentPage: 1,
        pageSize: 6,
        total: 0,
      },
    };
  },
  created() {
    this.getExamList();
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
    getExamList() {
      this.$http
        .get("admin/getExamInfo", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("暂无考试信息");
          } else {
            this.ExamList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    getStudentList() {
      this.$http
        .get("teacher/getStdScore", {
          params: {
            pageNum: this.smallPageInfo.currentPage,
            pageSize: this.smallPageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取学生列表失败");
          } else {
            this.StudentList = res.data;
            this.smallPageInfo.total = res.total;
          }
        });
    },
    classChoose(command) {
      this.$http
        .get("teacher/getClassStdScore", {
          params: {
            class_id: command,
            pageNum: this.smallPageInfo.currentPage,
            pageSize: this.smallPageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取学生信息失败");
          } else {
            this.StudentList = res.data;
            this.smallPageInfo.total = res.total;
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
    changeScore(data) {
      this.isShow = true;
      this.ScoreForm.student_id = data.student_id;
      this.ScoreForm.course_id = data.course_id;
      this.Score = data.score;
    },
    closeDialog() {
      this.isShow = false;
    },
    closeExamScoreDialog() {
      this.ExamScoreDialog = false;
    },
    editExamScore(id) {
      this.ExamScoreDialog = true;
      this.getStudentList();
      this.getClass();
      this.ScoreForm.exam_id = id;
    },
    changeStdScore() {
      this.ScoreForm.score = this.Score;
      this.$http
        .put("teacher/changeStdScore", this.ScoreForm)
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("修改失败");
          } else {
            this.$message.success("修改成功");
            this.isShow = false;
            this.getStudentList();
          }
        });
    },
    handleSmallSizeChange(size){
      this.smallPageInfo.pageSize = size;
      this.getStudentList();
    },
    handleSmallCurrentChange(page) {
      this.smallPageInfo.currentPage = page;
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
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>