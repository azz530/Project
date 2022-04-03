<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生考勤</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
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
      <el-table border style="width: 100%" :data="StdEvaList">
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
        <el-table-column label="操作" prop="" width="135px" align="center">
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
          <el-input v-model="editForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeStdEva">确 定</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classes: "班级选择",
      StdEvaList: [],
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
      isAddEvaluate:false,
      addEvaSid:null,
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
            this.StdEvaList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    classChoose(command) {
      this.$http
        .get("teacher/getClassStudentEva", {
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
            this.StdEvaList = res.data;
            this.pageInfo.total = res.total;
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
      if (data.id) {
        this.isAddEvaluate = false;
        this.$http
          .get("teacher/getStudentEvaById", { params: { id:data.id } })
          .then(({ data: res }) => {
            if (res.status !== 200) {
              this.$message.error("获取评价失败");
            } else {
              this.editForm = res.data;
            }
          });
      } else {
          this.isAddEvaluate = true;
          this.addEvaSid = data.student_id;
          this.editForm = {};
      }
    },
    closeDialog() {
      this.isShow = false;
    },
    changeStdEva() {
      if(this.isAddEvaluate){
          this.$http.post('teacher/addEvaluate',this.editForm,{
          params: { teacher_id: this.$store.state.userInfo.identity_id,
          student_id:this.addEvaSid },
        }).then(({data:res})=>{
            console.log(res);
            if(res.status !== 200){
                return this.$message.error('新增评价失败');
            } else {
                this.$message.success('新增评价成功');
                this.isShow = false;
                this.getStudentEva();
            }
        })
      } else {
      this.$http
        .post("teacher/editEvaluate", this.editForm)
        .then(({ data: res }) => {
          console.log(res);
          if (res.status !== 200) {
            return this.$message.error("编辑评价失败");
          } else {
            this.$message.success("编辑评价成功");
            this.isShow = false;
            this.getStudentEva();
          }
        });
      }
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