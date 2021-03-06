<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
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
              content="修改学生信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editStd(scope.row)"
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
      :visible.sync="editStdDialog"
      width="50%"
      @close="closeEditStdDialog"
    >
      <el-form
        :model="editForm"
        :rules="editStdFormRules"
        label-width="50px"
        ref="editStdRef"
      >
        <el-form-item label="学号" label-width="80px">
          <el-input v-model="editForm.student_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="student_name">
          <el-input v-model="editForm.student_name"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px" prop="sex">
          <el-select v-model="editForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitEditStdForm">确 定</el-button>
        <el-button @click="editStdDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classes: "班级选择",
      StdList: [],
      searchValue: "",
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      classArr: [],
      editStdDialog: false,
      editForm: {},
      editStdFormRules: {
        student_name: [
          { required: true, message: "姓名必填", trigger: "blur" },
        ],
        sex: [
          {
            required: true,
            message: "选择性别",
            trigger: ["change", "blur"],
            type: "string",
          },
        ],
        class_name: [
          { required: true, message: "请选择班级", trigger: "change" },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入家庭地址", trigger: "blur" },
        ],
      },
      commandTem: "",
      chooseClass: false,
    };
  },
  created() {
    this.getStudentList();
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
    getStudentList() {
      this.$http
        .get("teacher/getStudentList", {
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
            this.StdList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    classChoose(command) {
      this.commandTem = command;
      this.chooseClass = true;
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
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;

      if (this.chooseClass) {
        this.classChoose(this.commandTem);
      } else {
        this.getStudentList();
      }
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      if (this.chooseClass) {
        this.classChoose(this.commandTem);
      } else {
        this.getStudentList();
      }
    },
    closeEditStdDialog() {
      this.editStdDialog = false;
      this.$refs.editStdRef.resetFields();
    },
    editStd(data) {
      this.editStdDialog = true;
      this.editForm = data;
    },
    commitEditStdForm() {
      this.$refs.editStdRef.validate((valid) => {
        if (valid) {
          this.$http.put("teacher/changeStdInfo", this.editForm).then((res) => {
            if (res.data.status !== 200) {
              return this.$message.error("修改失败");
            } else {
              this.$message.success("修改成功");
              this.getStudentList();
              this.editStdDialog = false;
            }
          });
        }
      });
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