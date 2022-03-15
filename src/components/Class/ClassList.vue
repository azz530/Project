<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级学生</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
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
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="student_name"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="sex" width="200px" align="center">
        </el-table-column>
        <el-table-column
          label="出生日期"
          prop="birthday"
          width="186px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="班级"
          prop="classes"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="家庭住址"
          prop="address"
          width="350px"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" prop="" width="150px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editStdInfo(scope.row)"
                size="medium"
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
      title="修改学生信息"
      :visible.sync="StdInfoDialog"
      width="38%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        label-width="50px"
        ref="editStdRef"
        :rules="editForm_Rules"
      >
        <el-form-item label="学号" label-width="80px">
          <el-input
            class="input_short"
            v-model="editForm.student_id"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="student_name">
          <el-input
            class="input_short"
            v-model="editForm.student_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px" prop="sex">
          <el-select v-model="editForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" label-width="80px" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班级" label-width="80px" prop="classes">
          <el-select v-model="editForm.classes">
            <el-option label="一班" value="一班"></el-option>
            <el-option label="二班" value="二班"></el-option>
            <el-option label="三班" value="三班"></el-option>
            <el-option label="四班" value="四班"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家庭住址" label-width="80px" prop="address">
          <el-input
            type="textarea"
            :rows="5"
            class="input_long"
            v-model="editForm.address"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitForm">确 定</el-button>
        <el-button @click="StdInfoDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      StudentList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      StdInfoDialog: false,
      editForm: {},
      editForm_Rules: {
        student_name: [
          { required: true, message: "姓名必填", trigger: "blur" },
        ],
        sex: [{ required: true, message: "选择性别", trigger: ["change","blur"],type:'string' }],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "blur" },
        ],
        classes: [{ required: true, message: "请选择班级", trigger: "change" }],
        address: [
          { required: true, message: "请输入家庭地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getStudentList();
  },
  methods: {
    getStudentList() {
      this.$http
        .get("teacher/getStudentList", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          this.StudentList = res.data;
          this.pageInfo.total = res.total;
        });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getStudentList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getStudentList();
    },
    closeEditDialog() {
      this.$refs.editStdRef.resetFields();
    },
    editStdInfo(data) {
      this.StdInfoDialog = true;
      this.editForm = data;
    },
    commitForm() {
      this.$refs.editStdRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("teacher/changeStdInfo", this.editForm)
            .then(({ data: res }) => {
              console.log(res);
              if (res.status != 200) {
                this.$message.error("修改失败");
              } else {
                this.$message.success("修改成功");
                this.StdInfoDialog = false;
                this.getStudentList();
              }
            });
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
    border-radius: 20px;
    .el-table {
      margin-top: 30px;
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .el-form {
    .input_short {
      width: 50%;
    }
    .input_long {
      width: 80%;
    }
  }
}
</style>