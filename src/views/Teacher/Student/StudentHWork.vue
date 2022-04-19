<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生作业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addHomeWork"> 新增作业 </el-button>
      <el-table
        border
        style="width: 100%"
        :data="HomeWorkList"
        @expand-change="getFinishStd"
      >
        <el-table-column type="expand" label="展开" width="80px" align="center">
          <template class="expand" v-slot="scope">
            <el-table
              border
              style="width: 100%"
              :data="scope.row.childrenList"
              max-height="196px"
            >
              <el-table-column
                label="学号"
                prop="student_id"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="姓名"
                prop="student_name"
                align="center"
              >
              </el-table-column>
              <el-table-column label="性别" prop="sex" fixed align="center">
              </el-table-column>
              <el-table-column
                label="班级"
                prop="class_name"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="状态"
                prop="eva_status"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                prop=""
                width="230px"
                align="center"
              >
                <template v-slot="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.eva_status==='已批改'?'修改内容':'批改作业'"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      type="primary"
                      :icon="scope.row.eva_status==='已批改'?'el-icon-edit':'el-icon-s-check'"
                      @click="checkHomeWork(scope.row.student_id)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="作业号"
          prop="work_id"
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
        <el-table-column label="状态" prop="work_status" align="center">
        </el-table-column>
        <el-table-column label="操作" prop="" width="230px" align="center">
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
                :disabled="scope.row.work_status == '已发布' ? true : false"
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
                :disabled="scope.row.work_status == '已发布' ? true : false"
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

    <el-dialog
      title="作业批改"
      :visible.sync="checkDialog"
      width="50%"
      @close="closecheckDialog"
      class="stdWorkInfo"
    >
      <div class="work_content">
        学生提交内容:{{ WorkContent }}
        <div class="work_pic">
          <div class="picItem" v-for="item in WorkPic" :key="item + ' '">
            <img :src="item" alt="" />
            <div class="mask">
              <i
                class="el-icon-search"
                @click="handlePictureCardPreview(item)"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <el-form
        :model="evaForm"
        :rules="evaRules"
        label-width="50px"
        ref="evaRef"
      >
        <el-form-item label="作业表现" label-width="80px" prop="stars">
          <el-rate v-model="evaForm.stars" :colors="colors"></el-rate>
        </el-form-item>
        <el-form-item label="评价内容" label-width="80px" prop="eva_content">
          <el-input
            type="textarea"
            :rows="3"
            v-model="evaForm.eva_content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitEva">确 定</el-button>
        <el-button @click="checkDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
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
      HomeWorkForm: {},
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
      checkDialog: false,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      work_id: "",
      evaForm: {},
      evaRules: {
        stars:[{required:true,message:'选择星星',trigger:'blur'}],
        eva_content:[{required:true,message:'请输入评价',trigger:'blur'}],
      },
      WorkContent: "",
      WorkPic: [],
      dialogImageUrl: "",
      dialogVisible: false,
      Sid:'',
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
            teacher_id: this.$store.state.userInfo.identity_id,
          },
        })
        .then(({ data: res }) => {
          res.data.map((item) => {
            item.childrenList = [];
          });
          this.HomeWorkList = res.data;
          this.pageInfo.total = res.total;
        });
    },
    getFinishStd(row) {
      this.work_id = row.work_id;
      this.$http
        .get("teacher/getFinishStd", { params: { work_id: row.work_id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("该作业暂未有学生提交");
          } else {
            this.HomeWorkList.map((item, index) => {
              if (item.work_id === row.work_id) {
                this.HomeWorkList[index].childrenList = res.data;
              }
            });
          }
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
            .post("teacher/addHomeWork", this.HomeWorkForm, {
              params: { teacher_id: this.$store.state.userInfo.identity_id },
            })
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
      this.$confirm("是否删除该作业", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
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
        })
        .catch((err) => err);
    },
    changeHwForm() {
      this.$refs.editHWRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("teacher/changeHomeWork", this.editForm)
            .then((res) => {
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
    closecheckDialog() {
      this.checkDialog = false;
      this.$refs.evaRef.resetFields();
      this.getHomeWorkList();
    },
    checkHomeWork(id) {
      this.WorkPic = [];
      this.checkDialog = true;
      this.Sid = id;
      this.$http
        .get("teacher/getStdHWorkInfo", {
          params: { work_id: this.work_id, student_id: id },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("查询失败");
          } else {
            this.WorkContent = res.data.work_content;
            this.evaForm.stars = res.data.stars;
            this.evaForm.eva_content = res.data.eva_content;
            if (res.data.work_pic) {
              this.WorkPic.push(res.data.work_pic.split(","));
            }
          }
        });
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    commitEva() {
      this.$refs.evaRef.validate((valid)=>{
        if(valid){
          this.$http.post('teacher/evaStdHWork',this.evaForm,{params:{
            work_id:this.work_id,
            student_id:this.Sid,
          }}).then(({data:res})=>{
            if(res.status!==200){
              return this.$message.error('批改作业失败');
            } else {
              this.$message.success('批改作业成功');
              this.getHomeWorkList();
              this.checkDialog = false;
            }
          })
        }
      })
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
  .stdWorkInfo {
    .work_content {
      font-size: 16px;
      padding-left: 15px;
      .work_pic {
        width: 100%;
        display: flex;
        margin: 20px 0px 0px 100px;
        .picItem {
          width: 150px;
          height: 150px;
          margin-right: 10px;
          position: relative;
          margin-bottom: 20px;
          img {
            width: 100%;
            height: 100%;
          }
          .mask {
            height: 150px;
            width: 150px;
            background: rgba(0, 0, 0, 0.63);
            opacity: 0;
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              font-size: 22px;
              color: rgba(240, 240, 248, 0.644);
              cursor: pointer;
            }
          }
          &:hover .mask {
            opacity: 0.85;
          }
        }
      }
    }
  }
}
</style>