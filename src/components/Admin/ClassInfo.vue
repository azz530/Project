<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table border style="width: 100%" :data="ClassList">
        <el-table-column
          type="index"
          label="序号"
          fixed
          width="150px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="班级"
          prop="class_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="年级"
          prop="grade_name"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="班级学生人数"
          prop="student_num"
          align="center"
        ></el-table-column>
        <el-table-column
          label="班主任"
          prop="teacher_name"
          align="center"
        ></el-table-column>

        <el-table-column label="操作" prop="" width="240px" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑班级信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editClassInfo(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[4, 8]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="编辑班级信息"
      :visible.sync="editDialog"
      width="50%"
      @close="closeEditDialog"
    >
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
    return {
      ClassList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 4,
        total: 0,
      },
      editDialog:false,
    };
  },
  created() {
    this.getClassList();
  },
  methods: {
    getClassList() {
      this.$http
        .get("admin/getClassInfo", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取班级列表失败");
          } else {
            this.ClassList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },

    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getClassList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getClassList();
    },
    closeEditDialog(){
      this.$refs.editRef.resetFields();
    },
    commitEditForm(){

    },
    editClassInfo() {
      this.editDialog = true;
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