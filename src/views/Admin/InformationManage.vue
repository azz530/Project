<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="Bannercard">
      <span>轮播图图片管理</span>
      <div class="picture">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </el-card>
    <el-card class="Notice">
      <span>校园公告管理</span>
      <el-card class="NoticeRow">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <el-collapse-item
            v-for="item in NoticeArr"
            :key="item.id"
            :title="item.title"
            :name="item.id"
          >
            <span>{{item.content}}</span>
            <span>{{item.time}}</span>
          </el-collapse-item>
        </el-collapse>
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
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      NoticeArr: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      activeNames: '1',
    };
  },
  created() {
    this.getNotice();
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getNotice() {
      this.$http
        .get("admin/getNotice", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
            console.log(res);
          if (res.status !== 200) {
            return this.$message.error("获取公告列表失败");
          } else {
            this.NoticeArr = res.data;
          }
        });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getNotice();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getNotice();
    },
    handleChange(val) {
        console.log(val);
    }
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
  .Bannercard {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    .picture {
      margin-top: 20px;
    }
  }
  .Notice {
    margin-top: 20px;
    .NoticeRow {
      margin-top: 20px;
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>