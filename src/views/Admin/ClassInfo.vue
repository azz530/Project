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
              content="查看班级信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="checkClassInfo(scope.row.class_id)"
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
      title="班级信息"
      :visible.sync="checkDialog"
      width="50%"
      @close="closeCheckDialog"
    >
      <el-card class="box-card">
        <el-table border style="width: 100%" :data="ClassStdList">
          <el-table-column
            type="index"
            label="序号"
            fixed
            width="150px"
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
        </el-table>

        <el-pagination
          @current-change="handleSmallCurrentChange"
          :current-page="smallPageInfo.currentPage"
          small
          layout="prev, pager, next"
          :total="smallPageInfo.total"
        >
        </el-pagination>
      </el-card>
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
        pageSize: 6,
        total: 0,
      },
      checkDialog: false,
      ClassStdList: [],
      classStdTotal: null,
      smallPageInfo: {
        currentPage: 1,
        pageSize: 6,
        total: 0,
      },
      class_id:null,
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
          if (res.status !== 200) {
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
    closeCheckDialog() {
      this.checkDialog = false;
    },
    checkClassInfo(id) {
      this.checkDialog = true;
      this.class_id = id;
      this.getClassStd(id);
    },
    getClassStd(class_id) {
      this.$http
        .get("admin/getClassStudent", {
          params: {
            pageNum: this.smallPageInfo.currentPage,
            pageSize: this.smallPageInfo.pageSize,
            class_id: class_id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取班级学生失败");
          } else {
            this.ClassStdList = res.data;
            this.smallPageInfo.total = res.total;
          }
        });
    },
    handleSmallCurrentChange(page) {
      this.smallPageInfo.currentPage = page;
      this.getClassStd(this.class_id);
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