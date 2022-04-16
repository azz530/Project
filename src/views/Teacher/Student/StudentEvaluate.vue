<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生考勤</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button @click="addEva" type="primary"> 新增评价 </el-button>
      <el-table border style="width: 100%" :data="EvaList">
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
          label="评价"
          prop="content"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column label="课堂表现" prop="" align="center">
          <template v-slot="scope">
            <el-rate
              v-model="scope.row.course_stars"
              :colors="colors"
              disabled
            ></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="作业表现" prop="" align="center">
          <template v-slot="scope">
            <el-rate
              v-model="scope.row.work_stars"
              :colors="colors"
              disabled
            ></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="思想表现" prop="" align="center">
          <template v-slot="scope">
            <el-rate
              v-model="scope.row.think_stars"
              :colors="colors"
              disabled
            ></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="public_time" align="center">
        </el-table-column>
        <el-table-column label="操作" prop="" width="150px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editEvaluate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delEvaluate(scope.row.id)"
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
        :total="pageInfo.total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="修改成绩"
      :visible.sync="isShow"
      width="30%"
      @close="closeDialog"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        label-width="50px"
        ref="editRef"
      >
        <el-form-item label="课堂表现" label-width="80px" prop="">
          <el-rate v-model="editForm.course_stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="作业表现" label-width="80px" prop="">
          <el-rate v-model="editForm.work_stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="思想表现" label-width="80px" prop="">
          <el-rate v-model="editForm.think_stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="评价内容" label-width="80px" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            v-model="editForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeStdEva">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增评价"
      class="StdListDialog"
      :visible.sync="addDialog"
      width="70%"
      @close="closeAddDialog"
    >
      <el-row :gutter="16">
        <el-col :span="7">
          <el-input
            placeholder="输入学号或姓名进行搜索"
            v-model="searchValue"
            clearable
            @keyup.enter.native="search"
            @clear="closeSearch"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="3">
          <el-dropdown split-button type="primary" @command="classChoose">
            {{ classes }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in classArr"
                :key="item.class_id"
                :command="item.class_id"
                >{{ item.class_name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <el-table border style="width: 100%" :data="StdList">
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
          label="性别"
          prop="sex"
          align="center"
        ></el-table-column>
        <el-table-column
          label="班级"
          prop="class_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="出生日期"
          prop="birthday"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="" width="235px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="新增评价"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="addStdEvaluate(scope.row.student_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleDialogSizeChange"
        @current-change="handleDialogCurrentChange"
        :current-page="DialogpageInfo.pageNum"
        :page-sizes="[5, 10]"
        :page-size="DialogpageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="DialogpageInfo.total"
      >
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增评价"
      :visible.sync="addStdEvaDialog"
      width="30%"
      @close="closeAddStdEvaDialog"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        label-width="50px"
        ref="addRef"
      >
        <el-form-item label="课堂表现" label-width="80px" prop="">
          <el-rate v-model="addForm.course_stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="作业表现" label-width="80px" prop="">
          <el-rate v-model="addForm.work_stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="思想表现" label-width="80px" prop="">
          <el-rate v-model="addForm.think_stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="评价内容" label-width="80px" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            v-model="addForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addStdEvaForm">确 定</el-button>
        <el-button @click="addStdEvaDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classes: "班级选择",
      EvaList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      classArr: [],
      value2: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      editForm: {},
      editRules: {},
      isShow: false,
      addDialog: false,
      addForm: {},
      addRules: {},
      StdList: [],
      DialogpageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      searchValue: "",
      addStdEvaDialog: false,
      Sid: "",
    };
  },
  created() {
    this.getStudentEva();
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
    getStudentEva() {
      this.$http
        .get("teacher/getStudentEva", {
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
            this.EvaList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    classChoose(command) {
      this.$http
        .get("teacher/getClassStudentList", {
          params: {
            class_id: command,
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取学生信息失败");
          } else {
            this.StdList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    getStudentList() {
      this.$http
        .get("teacher/getStudentList", {
          params: {
            pageNum: this.DialogpageInfo.pageNum,
            pageSize: this.DialogpageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取学生列表失败");
          } else {
            this.StdList = res.data;
            this.DialogpageInfo.total = res.total;
          }
        });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getStudentEva();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getStudentEva();
    },
    editEvaluate(data) {
      this.isShow = true;
      this.editForm = data;
    },
    closeDialog() {
      this.isShow = false;
    },
    changeStdEva() {
      this.$http
        .post("teacher/editEvaluate", this.editForm)
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("编辑评价失败");
          } else {
            this.$message.success("编辑评价成功");
            this.isShow = false;
            this.getStudentEva();
          }
        });
    },
    delEvaluate(id) {
      this.$confirm("是否删除该评价", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
            this.$http
              .delete("teacher/delEvaluate", { params: { id, } })
              .then((res) => {
                if (res.status != 200) {
                  this.$message.error("删除失败");
                } else {
                  this.$message.success("删除成功");
                }
                this.getStudentEva();
              });
          }
        })
        .catch((err) => err);
    },
    addEva() {
      this.addDialog = true;
      this.getStudentList();
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    //改变每页数据展示规格变化
    handleDialogSizeChange(newSize) {
      this.DialogpageInfo.pageSize = newSize;
      this.getStudentList();
    },
    //改变当前页数据变化
    handleDialogCurrentChange(newPage) {
      this.DialogpageInfo.pageNum = newPage;
      this.getStudentList();
    },
    addStdEvaluate(id) {
      this.addStdEvaDialog = true;
      this.Sid = id;
    },
    search() {
      if (this.searchValue) {
        this.$http
          .get("teacher/searchStd", {
            params: {
              str: this.searchValue,
              teacher_id: this.$store.state.userInfo.identity_id,
            },
          })
          .then(({ data: res }) => {
            if (res.status !== 200) {
              return this.$message.error("查询失败");
            } else {
              this.StdList = res.data;
            }
          });
      } else {
        return this.$message.error("请输入");
      }
    },
    closeSearch() {
      this.getStudentList();
    },
    closeAddStdEvaDialog() {
      this.addStdEvaDialog = false;
    },
    addStdEvaForm() {
      this.$http
        .post("teacher/addEvaluate", this.addForm, {
          params: {
            teacher_id: this.$store.state.userInfo.identity_id,
            student_id: this.Sid,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("新增评价失败");
          } else {
            this.$message.success("新增评价成功");
            this.addStdEvaDialog = false;
            this.getStudentEva();
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
  .StdListDialog {
    .el-table {
      margin-top: 20px;
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>