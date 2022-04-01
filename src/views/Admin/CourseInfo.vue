<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addCourse"> 新增课程 </el-button>
      <el-table border style="width: 100%" :data="CourseList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="课程号"
          prop="course_id"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="课程名称"
          prop="course_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="课程信息"
          prop="course_message"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="" width="250px" align="center">
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
                @click="editCourse(scope.row)"
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
                @click="deleteCourse(scope.row.course_id)"
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
      title="新增老师"
      :visible.sync="addDialog"
      width="50%"
      @close="closeAddDialog"
    >
      <el-form :model="addCourseForm" :rules="CourseFormRules" ref="addRef">
        <el-form-item label="课程号" label-width="80px" prop="course_id">
          <el-input v-model="addCourseForm.course_id"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" label-width="80px" prop="course_name">
          <el-input v-model="addCourseForm.course_name"></el-input>
        </el-form-item>
        <el-form-item label="课程信息" label-width="80px" prop="course_message">
          <el-input v-model="addCourseForm.course_message"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitAddForm">确 定</el-button>
        <el-button @click="addDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改老师信息"
      :visible.sync="editDialog"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="CourseFormRules"
        label-width="50px"
        ref="editRef"
      >
        <el-form-item label="课程号" label-width="80px">
          <el-input v-model="editForm.course_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名" label-width="80px" prop="course_name">
          <el-input v-model="editForm.course_name"></el-input>
        </el-form-item>
        <el-form-item label="课程信息" label-width="80px" prop="course_message">
          <el-input v-model="editForm.course_message"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitEditForm">确 定</el-button>
        <el-button @click="editDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === "") {
        callback(new Error("请输入工号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      CourseList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      addDialog: false,
      editDialog: false,
      addCourseForm: {
        course_id: "",
        course_name: "",
        teacher_id: "",
      },
      CourseFormRules: {
        course_id: [
          { required: true, validator: validateNum, trigger: "blur" },
          { min: 6, max: 10, message: "6 到 10 个数字组合", trigger: "blur" },
        ],
        course_name: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        course_message: [
          { required: true, message: "请输入课程信息", trigger: "blur" },
        ],
      },
      TeacherList: [],
      editForm: {},
    };
  },
  created() {
    this.getCourseList();
  },
  methods: {
    getCourseList() {
      this.$http
        .get("admin/getCourseInfo", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取课程列表失败");
          } else {
            this.CourseList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getCourseList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getCourseList();
    },
    addCourse() {
      this.addDialog = true;
    },
    closeAddDialog() {
      this.$refs.addRef.resetFields();
    },
    commitAddForm() {
      this.$refs.addRef.validate((valid) => {
        if (valid) {
          this.$http
            .post("admin/addCourse", this.addCourseForm)
            .then(({ data: res }) => {
              if (res.status !== 200) {
                if (res.status === 402) {
                  return this.$message.error("该课程号已被使用");
                }
                return this.$message.error("新增课程失败");
              } else {
                this.$message.success("新增课程成功");
                this.getCourseList();
                this.addDialog = false;
              }
            });
        }
      });
    },
    editCourse(data) {
      this.editDialog = true;
      this.editForm = data;
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields();
    },
    commitEditForm() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("admin/changeCourseInfo", this.editForm)
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("修改失败");
              } else {
                this.$message.success("修改成功");
                this.getCourseList();
                this.editDialog = false;
              }
            });
        }
      });
    },
    deleteCourse(id) {
      this.$confirm("是否删除该课程", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
            this.$http
              .delete("admin/delCourse", { params: { course_id: id } })
              .then((res) => {
                if (res.status != 200) {
                  this.$message.error("删除失败");
                } else {
                  this.$message.success("删除成功");
                }
                this.getCourseList();
              });
          }
        })
        .catch((err) => err);
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