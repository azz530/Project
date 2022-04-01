<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>班级公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addNotice"> 新增公告 </el-button>
      <el-table border style="width: 100%" :data="NoticeList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="公告号"
          prop="notice_id"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="公告主题"
          prop="notice_theme"
          align="center"
        ></el-table-column>
        <el-table-column
          label="公告内容"
          prop="notice_details"
          align="center"
        ></el-table-column>
        <el-table-column
          label="发布日期"
          prop="notice_time"
          align="center"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="notice_status"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" prop="" width="300px" align="center">
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
                @click="issueNotice(scope.row.notice_id)"
                :disabled="scope.row.notice_status=='已发布'?true:false"
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
                @click="editNotice(scope.row)"
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
                @click="deleteNt(scope.row.notice_id)"
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
      title="新增公告"
      :visible.sync="isShow"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="NoticeForm"
        :rules="NoticeRules"
        label-width="50px"
        ref="addNoticeRef"
      >
        <el-form-item label="公告号" label-width="80px" prop="notice_id">
          <el-input v-model="NoticeForm.notice_id"></el-input>
        </el-form-item>
        <el-form-item label="公告主题" label-width="80px" prop="notice_theme">
          <el-input v-model="NoticeForm.notice_theme"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" label-width="80px" prop="notice_details">
          <el-input v-model="NoticeForm.notice_details"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNoticeForm">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改公告内容"
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
        <el-form-item label="公告号" label-width="80px">
          <el-input v-model="editForm.notice_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="公告主题" label-width="80px" prop="notice_theme">
          <el-input v-model="editForm.notice_theme"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" label-width="80px" prop="notice_details">
          <el-input v-model="editForm.notice_details"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitNtForm">确 定</el-button>
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
        callback(new Error("请输入公告号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      NoticeList: [],
      NoticeForm: {
        notice_id: "",
        notice_name: "",
        notice_details: "",
      },
      NoticeRules: {
        notice_id: [
          { required: true, validator: validateHWID, trigger: "blur" },
          { min: 4, max: 8, message: "4 到 8 个数字组合", trigger: "blur" },
        ],
        notice_theme: [{ required: true, message: "请输入公告主题", trigger: "blur" }],
        notice_details: [
          { required: true, message: "请完善公告内容", trigger: "blur" },
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
        notice_theme: [
          { required: true, message: "请输入公告主题", trigger: "blur" },
        ],
        notice_details: [
          { required: true, message: "请完善公告内容", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getNoticeList();
  },
  methods: {
    getNoticeList() {
      this.$http
        .get("teacher/getNotice", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          this.NoticeList = res.data;
          this.pageInfo.total = res.total;
        });
    },
    addNotice() {
      this.isShow = true;
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getNoticeList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getNoticeList();
    },
    closeDialog() {
      this.$refs.addNoticeRef.resetFields();
    },
    addNoticeForm() {
      this.isShow = false;
      this.$refs.addNoticeRef.validate((valid) => {
        if (valid) {
          this.$http
            .post("teacher/addNotice", this.NoticeForm,{params:{teacher_id:this.$store.state.userInfo.identity_id,}})
            .then((res) => {
              if (res.data.status != 200) {
                if (res.data.status == 402) {
                  return this.$message.error("该公告号已存在");
                }
                return this.$message.error("新增公告失败");
              } else {
                this.$message.success("新增公告成功");
                this.getNoticeList();
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
    issueNotice(id) {
      this.$confirm('是否发布该公告', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(res=>{
        this.$http.put("teacher/commitNotice", { id }).then((res) => {
            if (res.status != 200) {
            this.$message.error("发布失败");
            } else if (res.data.status == 404) {
            this.$message.error("已发布");
            } else {
            this.$message.success("发布成功");
            }
            this.getNoticeList();
        });
      }).catch(err=>err);
    },
    editNotice(data) {
      this.ShoweditForm = true;
      this.editForm = data;
    },
    deleteNt(id) {
      this.$confirm('是否删除该公告', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(res=>{
        console.log(res);
        if(res === 'confirm') {
          this.$http
          .delete("teacher/delNotice", { params: { notice_id: id } })
          .then((res) => {
            if (res.status != 200) {
              this.$message.error("删除失败");
            } else {
              this.$message.success("删除成功");
            }
            this.getNoticeList();
          });
        }
      }).catch(err => err);
    },
    commitNtForm() {
      this.$refs.editHWRef.validate((valid) => {
        if(valid){
          this.$http.put("teacher/changeNotice", this.editForm).then((res) => {
            if (res.status != 200) {
              this.$message.error("修改失败");
            } else {
              this.$message.success("修改成功");
              this.ShoweditForm = false;
              this.getNoticeList();
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