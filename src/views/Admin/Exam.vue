<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>考试管理</el-breadcrumb-item>
      <el-breadcrumb-item>考试信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addExam"> 新增考试 </el-button>
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
        <el-table-column
          label="考试时间"
          prop=""
          align="center"
        >
            <template v-slot="scope">
                {{scope.row.start_time}} ~ {{scope.row.end_time}}
            </template>
        </el-table-column>
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
                @click="editExam(scope.row)"
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
                @click="deleteExam(scope.row.exam_id)"
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
      title="新增考试"
      :visible.sync="addDialog"
      width="50%"
      @close="closeAddDialog"
    >
      <el-form :model="addExamForm" :rules="ExamFormRules" ref="addRef">
        <el-form-item label="考试号" label-width="80px" prop="exam_id">
          <el-input v-model="addExamForm.exam_id"></el-input>
        </el-form-item>
        <el-form-item label="考试名称" label-width="80px" prop="exam_name">
          <el-input v-model="addExamForm.exam_name"></el-input>
        </el-form-item>
        <el-form-item label="考试信息" label-width="80px" prop="exam_message">
          <el-input v-model="addExamForm.exam_message"></el-input>
        </el-form-item>
        <el-form-item label="考试时间" label-width="80px" prop="exam_time">
          <el-date-picker
            v-model="addExamForm.exam_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitAddForm">确 定</el-button>
        <el-button @click="addDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改考试信息"
      :visible.sync="editDialog"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="ExamFormRules"
        label-width="50px"
        ref="editRef"
      >
        <el-form-item label="考试号" label-width="80px">
          <el-input v-model="editForm.exam_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="考试名称" label-width="80px" prop="exam_name">
          <el-input v-model="editForm.exam_name"></el-input>
        </el-form-item>
        <el-form-item label="考试信息" label-width="80px" prop="exam_message">
          <el-input v-model="editForm.exam_message"></el-input>
        </el-form-item>
        <el-form-item label="考试时间" label-width="80px" prop="exam_time">
          <el-date-picker
            v-model="editForm.exam_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
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
        callback(new Error("请输入课程号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      ExamList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      addDialog: false,
      editDialog: false,
      addExamForm: {},
      ExamFormRules: {
        exam_id: [
          { required: true, validator: validateNum, trigger: "blur" },
          { min: 6, max: 10, message: "6 到 10 个数字组合", trigger: "blur" },
        ],
        exam_name: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        exam_message: [
          { required: true, message: "请输入课程信息", trigger: "blur" },
        ],
      },
      editForm: {},
    };
  },
  created() {
    this.getExamList();
  },
  methods: {
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
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getExamList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getExamList();
    },
    addExam() {
      this.addDialog = true;
    },
    closeAddDialog() {
      this.$refs.addRef.resetFields();
    },
    commitAddForm() {
      console.log(this.addExamForm);
      this.$refs.addRef.validate((valid) => {
        if (valid) {
          this.$http
            .post("admin/addExam", this.addExamForm)
            .then(({ data: res }) => {
              if (res.status !== 200) {
                if (res.status === 402) {
                  return this.$message.error("该考试号已被使用");
                }
                return this.$message.error("新增考试失败");
              } else {
                this.$message.success("新增考试成功");
                this.getExamList();
                this.addDialog = false;
              }
            });
        }
      });
    },
    editExam(data) {
      this.editDialog = true;
      this.editForm = data;
      this.editForm.exam_time = [data.start_time,data.end_time];
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields();
    },
    commitEditForm() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
            console.log(this.editForm);
          this.$http
            .put("admin/changeExamInfo", this.editForm)
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("修改失败");
              } else {
                this.$message.success("修改成功");
                this.getExamList();
                this.editDialog = false;
              }
            });
        }
      });
    },
    deleteExam(id) {
      this.$confirm("是否删除该考试", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
            this.$http
              .delete("admin/delExam", { params: { exam_id: id } })
              .then((res) => {
                if (res.status != 200) {
                  this.$message.error("删除失败");
                } else {
                  this.$message.success("删除成功");
                }
                this.getExamList();
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