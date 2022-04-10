<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="16">
        <el-col :span="7">
          <el-input
            placeholder="输入用户id或用户名进行搜素"
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
      </el-row>
      <el-table border style="width: 100%" :data="UserList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户身份"
          prop="identity"
          align="center"
        ></el-table-column>
        <el-table-column
          label="学号/教师号"
          prop="identity_id"
          align="center"
        ></el-table-column>
        <el-table-column
          label="性别"
          prop="sex"
          align="center"
        ></el-table-column>
        <el-table-column
          label="生日"
          prop="birthday"
          align="center"
        ></el-table-column>
        <el-table-column
          label="地址"
          prop="address"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="" width="240px" align="center">
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
                @click="editStd(scope.row.id)"
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
                @click="deleteUser(scope.row.id)"
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
    <el-card class="userData"> </el-card>

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialog"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="50px"
        ref="editRef"
      >
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="100px" prop="sex">
          <el-select v-model="editForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份" label-width="100px" prop="identity">
          <el-select v-model="editForm.identity">
            <el-option label="老师" value="老师"></el-option>
            <el-option label="学生" value="学生"></el-option>
            <el-option label="家长" value="家长"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="学号/教师号"
          label-width="100px"
          prop="identity_id"
        >
          <el-input v-model="editForm.identity_id"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" label-width="100px" prop="address">
          <el-input
            type="textarea"
            :rows="5"
            class="input_long"
            v-model="editForm.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期" label-width="100px" prop="birthday">
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
        callback(new Error("请输入学号/教师号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        this.$http
          .get("my/getUserID", {
            params: { identity: this.editForm.identity, identity_id: value },
          })
          .then(({ data: res }) => {
            console.log(res);
            if (res.status !== 200) {
              if (res.status === 403) {
                callback(new Error("该学号不存在"));
              } else if (res.status === 404) {
                callback(new Error("该学号已被绑定"));
              } else if (res.status === 405) {
                callback(new Error("该教师号不存在"));
              } else if (res.status === 406) {
                callback(new Error("该教师号已被绑定"));
              }
            } else {
              callback();
            }
          });
      }
    };
    return {
      UserList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      searchValue: "",
      editDialog: false,
      editForm: {},
      editFormRules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" },
        ],
        sex: [
          {
            required: true,
            message: "选择性别",
            trigger: ["change", "blur"],
            type: "string",
          },
        ],
        identity: [
          {
            required: true,
            message: "选择身份",
            trigger: ["change", "blur"],
            type: "string",
          },
        ],
        identity_id: [
          {
            required: true,
            validator: validateNum,
            trigger: "blur",
          },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入家庭地址", trigger: "blur" },
        ],
      },
      classList: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http
        .get("admin/getUserList", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取学生列表失败");
          } else {
            this.UserList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getUserList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getUserList();
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields();
    },
    editStd(id) {
      this.editDialog = true;
      this.$http
        .get("admin/getUserById", { params: { id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取用户信息失败");
          } else {
            this.editForm = res.data;
          }
        });
    },
    commitEditForm() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          this.$http.put("admin/changeUserInfo", this.editForm).then((res) => {
            if (res.data.status !== 200) {
              return this.$message.error("修改失败");
            } else {
              this.$message.success("修改成功");
              this.getUserList();
              this.editDialog = false;
            }
          });
        }
      });
    },
    deleteUser(id) {
      this.$confirm("是否删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
            this.$http
              .delete("admin/delUser", { params: { id } })
              .then((res) => {
                if (res.status != 200) {
                  this.$message.error("删除失败");
                } else {
                  this.$message.success("删除成功");
                }
                this.getUserList();
              });
          }
        })
        .catch((err) => err);
    },
    search() {
      if (this.searchValue) {
        this.$http
          .get("admin/searchUser", { params: { str: this.searchValue } })
          .then(({ data: res }) => {
            console.log(res);
            if (res.status !== 200) {
              return this.$message.error("查询失败");
            } else {
              this.UserList = res.data;
            }
          });
      } else {
        return this.$message.error("请输入");
      }
    },
    closeSearch() {
      this.getUserList();
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
  .box-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    .el-table {
      margin-top: 30px;
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .userData {
    margin-top: 30px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
}
</style>