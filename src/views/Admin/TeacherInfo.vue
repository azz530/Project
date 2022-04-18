<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>老师管理</el-breadcrumb-item>
      <el-breadcrumb-item>老师信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="16">
        <el-col :span="7">
          <el-input
            placeholder="输入教师号或姓名进行搜索"
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
          <el-button type="primary" @click="addTeacher"> 添加老师 </el-button>
        </el-col>
      </el-row>
      <el-table border style="width: 100%" :data="TeacherList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="工号"
          prop="teacher_id"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="teacher_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="性别"
          prop="sex"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="出生日期"
          prop="birthday"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="家庭住址"
          prop="address"
          fixed
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
                @click="editTeacher(scope.row)"
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
                @click="deleteTeacher(scope.row.teacher_id)"
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
      <el-form
        :model="addTeacherForm"
        :rules="TeacherFormRules"
        ref="addTeacherRef"
      >
        <el-form-item label="工号" label-width="80px" prop="teacher_id">
          <el-input v-model="addTeacherForm.teacher_id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="teacher_name">
          <el-input v-model="addTeacherForm.teacher_name"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px" prop="sex">
          <el-select v-model="addTeacherForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" label-width="80px" prop="birthday">
          <el-date-picker
            v-model="addTeacherForm.birthday"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭住址" label-width="80px" prop="address">
          <el-input
            type="textarea"
            :rows="5"
            class="input_long"
            v-model="addTeacherForm.address"
          ></el-input>
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
        :rules="TeacherFormRules"
        label-width="50px"
        ref="editRef"
      >
        <el-form-item label="工号" label-width="80px">
          <el-input v-model="editForm.teacher_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="teacher_name">
          <el-input v-model="editForm.teacher_name"></el-input>
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
      TeacherList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      searchValue: "",
      addDialog: false,
      addTeacherForm: {},
      TeacherFormRules: {
        teacher_id: [
          { required: true, validator: validateNum, trigger: "blur" },
          { min: 6, max: 10, message: "6 到 10 个数字组合", trigger: "blur" },
        ],
        teacher_name: [
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
        birthday: [
          {
            required: true,
            message: "请选择年级",
            trigger: ["change", "blur"],
          },
        ],
        address: [
          {
            required: true,
            message: "请选择年级",
            trigger: "blur",
          },
        ],
      },
      editDialog: false,
      editForm: {},
    };
  },
  created() {
    this.getTeacherList();
  },
  methods: {
    addTeacher() {},
    getTeacherList() {
      this.$http
        .get("admin/getTeacherInfo", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取教师列表失败");
          } else {
            this.TeacherList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getTeacherList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getTeacherList();
    },
    addTeacher() {
      this.addDialog = true;
      this.getCourse();
    },
    closeAddDialog() {
      this.$refs.addTeacherRef.resetFields();
    },
    commitAddForm() {
      this.$refs.addTeacherRef.validate((valid) => {
        if (valid) {
          this.$http
            .post("admin/addTeacher", this.addTeacherForm)
            .then((res) => {
              if (res.data.status !== 200) {
                if (res.data.status === 402) {
                  return this.$message.error("该工号已被使用");
                }
                return this.$message.error("新增失败");
              } else {
                this.$message.success("新增成功");
                this.getTeacherList();
                this.addDialog = false;
              }
            });
        }
      });
    },
    editTeacher(data) {
      this.editDialog = true;
      this.editForm = data;
      this.getCourse();
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields();
    },
    commitEditForm() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("admin/changeTeacherInfo", this.editForm)
            .then((res) => {
              if (res.status !== 200) {
                return this.$message.error("修改失败");
              } else {
                this.$message.success("修改成功");
                this.getTeacherList();
                this.editDialog = false;
              }
            });
        }
      });
    },
    deleteTeacher(id) {
      this.$confirm("是否删除该老师", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
            this.$http
              .delete("admin/delTeacher", { params: { teacher_id: id } })
              .then((res) => {
                if (res.status != 200) {
                  this.$message.error("删除失败");
                } else {
                  this.$message.success("删除成功");
                }
                this.getTeacherList();
              });
          }
        })
        .catch((err) => err);
    },
    search() {
      if (this.searchValue) {
        this.$http
          .get("admin/searchTeacher", { params: { str: this.searchValue } })
          .then(({ data: res }) => {
            if (res.status !== 200) {
              return this.$message.error("查询失败");
            } else {
              this.TeacherList = res.data;
            }
          });
      } else {
        return this.$message.error("请输入");
      }
    },
    closeSearch() {
      this.getTeacherList();
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