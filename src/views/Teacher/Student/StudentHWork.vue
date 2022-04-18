<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生作业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addHomeWork"> 新增作业 </el-button>
      <el-table border style="width: 100%" :data="HomeWorkList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="作业号"
          prop="work_id"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="作业名称"
          prop="work_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="作业详情"
          prop="work_details"
          align="center"
        ></el-table-column>
        <el-table-column
          label="期限(天)"
          prop="work_deadline"
          align="center"
        ></el-table-column>
        <el-table-column
          label="完成情况(人)"
          prop="finish_num"
          align="center"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="work_status"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" prop="250px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="发布"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-position"
                @click="commitHw(scope.row.work_id)"
                :disabled="scope.row.work_status=='已发布'?true:false"
              ></el-button>
            </el-tooltip>
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
                @click="editHomeWork(scope.row)"
                :disabled="scope.row.work_status=='已发布'?true:false"
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
                @click="deleteHw(scope.row.work_id)"
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
      title="新增作业"
      :visible.sync="isShow"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="HomeWorkForm"
        :rules="HomeWorkRules"
        label-width="50px"
        ref="addHWRef"
      >
        <el-form-item label="作业号" label-width="80px" prop="hw_id">
          <el-input v-model="HomeWorkForm.hw_id"></el-input>
        </el-form-item>
        <el-form-item label="作业名称" label-width="80px" prop="hw_name">
          <el-input v-model="HomeWorkForm.hw_name"></el-input>
        </el-form-item>
        <el-form-item label="作业详情" label-width="80px" prop="hw_details">
          <el-input v-model="HomeWorkForm.hw_details"></el-input>
        </el-form-item>
        <el-form-item label="期限" label-width="80px" prop="hw_deadline">
          <el-select v-model="HomeWorkForm.hw_deadline">
            <el-option label="一天" value="1"></el-option>
            <el-option label="三天" value="3"></el-option>
            <el-option label="七天" value="7"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addHW">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改作业内容"
      :visible.sync="ShoweditForm"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="50px"
        ref="editHWRef"
      >
        <el-form-item label="作业号" label-width="80px">
          <el-input v-model="editForm.work_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="作业名称" label-width="80px" prop="work_name">
          <el-input v-model="editForm.work_name"></el-input>
        </el-form-item>
        <el-form-item label="作业详情" label-width="80px" prop="work_details">
          <el-input v-model="editForm.work_details"></el-input>
        </el-form-item>
        <el-form-item label="期限" label-width="80px" prop="work_deadline">
          <el-select v-model="editForm.work_deadline">
            <el-option label="一天" value="1"></el-option>
            <el-option label="三天" value="3"></el-option>
            <el-option label="七天" value="7"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeHwForm">确 定</el-button>
        <el-button @click="ShoweditForm = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validateHWID = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === "") {
        callback(new Error("请输入作业号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      HomeWorkList: [],
      AllHWList: [],
      HomeWorkForm: {
        hw_id: "",
        hw_name: "",
        hw_details: "",
        hw_deadline: "",
      },
      HomeWorkRules: {
        hw_id: [
          { required: true, validator: validateHWID, trigger: "blur" },
          { min: 4, max: 8, message: "4 到 8 个数字组合", trigger: "blur" },
        ],
        hw_name: [{ required: true, message: "请输入作业名", trigger: "blur" }],
        hw_details: [
          { required: true, message: "请完善信息", trigger: "blur" },
        ],
        hw_deadline: [
          { required: true, message: "请选择期限", trigger: "change" },
        ],
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      isShow: false,
      ShoweditForm: false,
      editForm: {},
      editFormRules: {
        work_name: [
          { required: true, message: "请输入作业名", trigger: "blur" },
        ],
        work_details: [
          { required: true, message: "请完善信息", trigger: "blur" },
        ],
        work_deadline: [
          { required: true, message: "请选择期限", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getHomeWorkList();
  },
  methods: {
    getHomeWorkList() {
      this.$http
        .get("teacher/getHomeWork", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
            teacher_id:this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          this.HomeWorkList = res.data;
          this.pageInfo.total = res.total;
        });
    },
    addHomeWork() {
      this.isShow = true;
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getHomeWorkList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getHomeWorkList();
    },
    closeDialog() {
      this.$refs.addHWRef.resetFields();
    },
    addHW() {
      this.$refs.addHWRef.validate((valid) => {
        if (valid) {
          this.$http
            .post("teacher/addHomeWork", this.HomeWorkForm,{params:{teacher_id:this.$store.state.userInfo.identity_id,}})
            .then((res) => {
              if (res.data.status != 200) {
                if (res.data.status == 402) {
                  return this.$message.error("该作业号已存在");
                }
                return this.$message.error("新增作业失败");
              } else {
                this.$message.success("新增作业成功");
                this.getHomeWorkList();
                this.isShow = false;
              }
            });
        } else {
          return;
        }
      });
    },
    closeEditDialog() {
      this.$refs.editHWRef.resetFields();
    },
    commitHw(id) {
      this.$http.put("teacher/commitHomeWork", { id }).then((res) => {
        if (res.status != 200) {
          this.$message.error("发布失败");
        } else if (res.data.status == 404) {
          this.$message.error("已发布");
        } else {
          this.$message.success("发布成功");
        }
        this.getHomeWorkList();
      });
    },
    editHomeWork(data) {
      this.ShoweditForm = true;
      this.editForm = data;
    },
    deleteHw(id) {
      this.$confirm('是否删除该作业', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(res=>{
        if(res === 'confirm') {
          this.$http
          .delete("teacher/delHomeWork", { params: { work_id: id } })
          .then((res) => {
            if (res.status != 200) {
              this.$message.error("删除失败");
            } else {
              this.$message.success("删除成功");
            }
            this.getHomeWorkList();
          });
        }
      }).catch(err => err);
    },
    changeHwForm() {
      this.$refs.editHWRef.validate((valid) => {
        if(valid){
          this.$http.put("teacher/changeHomeWork", this.editForm).then((res) => {
            if (res.status != 200) {
              this.$message.error("修改失败");
            } else {
              this.$message.success("修改成功");
              this.ShoweditForm = false;
              this.getHomeWorkList();
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
}
</style>