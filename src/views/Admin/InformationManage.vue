<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="Bannercard">
      <span>轮播图图片管理</span>
      <div class="picture">
        <div class="pictureList">
          <div class="tips">当前页面轮播图:</div>
          <div
            class="pictureBox"
            v-for="item in showPicList"
            :key="item"
            v-show="PicShow"
          >
            <img :src="item" alt="" />
            <div class="mask">
              <span
                class="picturePreview"
                @click="handlePictureCardPreview(item)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
            </div>
          </div>
          <div class="upload">
            <el-upload
              action="#"
              list-type="picture-card"
              :on-change="bannnerChange"
              :auto-upload="false"
              v-if="isAddStatus"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="addbutton">
          <el-button type="danger" @click="delBanner">编辑</el-button>
          <el-button type="primary" @click="commitBanner">设置</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="Notice">
      <span>校园公告管理</span>
      <el-card class="NoticeLeft">
        <div class="leftHead">
          <div class="addButton">
            <el-button
              class="NoticeAdd"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addNotice"
            ></el-button>
          </div>
        </div>
        <el-collapse @change="handleChange" accordion>
          <el-collapse-item
            v-for="item in NoticeArr"
            :key="item.id"
            :title="item.title"
            :name="item.id"
          >
            <div class="noticePic">
              <img v-for="pic in item.picture" :key="pic" :src="pic" alt="" />
            </div>
            <div class="noticeContent">
              <span>{{ item.content }}</span>
            </div>
            <div class="noticeTime">
              <div class="noticeDel">
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  circle
                  @click="delNotice(item.id)"
                ></el-button>
              </div>
              <div class="noticeSpan">
                <span>{{ item.time }}</span>
              </div>
            </div>
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
    <el-card class="Video">
      <span>视频管理</span>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <el-dialog
      title="新增新闻"
      :visible.sync="addDialog"
      width="50%"
      @close="closeaddDialog"
    >
      <el-form
        :model="NoticeForm"
        :rules="NoticeFormRules"
        label-width="100px"
        ref="addRef"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="NoticeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            action=""
            list-type="picture-card"
            :limit="4"
            :auto-upload="false"
            :on-change="handlePicChange"
            :before-upload="beforePicUpload"
            v-if="ShowUploadPic"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :rows="5"
            class="input_long"
            v-model="NoticeForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitNoticeForm">确 定</el-button>
        <el-button @click="addDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      PicShow: true,
      isAddStatus: true,
      BannerList: [],
      NoticeArr: [],
      showPicList: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      addDialog: false,
      NoticeForm: {},
      NoticeFormRules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        position: [
          {
            required: true,
            message: "请选择位置",
            trigger: ["change", "blur"],
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      ShowUploadPic: true,
      PictureList: [],
    };
  },
  created() {
    this.getNotice();
    this.getBanner();
  },
  methods: {
    getBanner() {
      this.$http.get("admin/getBanner").then(({ data: res }) => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.eror("获取轮播图失败");
        } else {
          this.showPicList = res.data.picture;
        }
      });
    },
    bannnerChange(file, fileList) {
      if (fileList.length <= 4) {
        this.BannerList = fileList;
      } else {
        this.isAddStatus = false;
        this.$message.error("一次只能上传四张图片");
        fileList.splice(-1, 1);
      }
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    delBanner() {
      this.isAddStatus = true;
      this.PicShow = false;
    },
    commitBanner() {
      let Banner = new FormData();
      console.log(this.BannerList);
      if (this.BannerList.length > 0) {
        this.BannerList.forEach((file) => {
          Banner.append("file", file.raw);
        });
        this.$http.post("admin/addBanner", Banner).then(({ data: res }) => {
          console.log(res);
          if (res.status !== 200) {
            return this.$message.error("更新轮播图失败");
          } else {
            this.$message.success("更新轮播图成功");
            this.isAddStatus = false;
            this.getBanner();
          }
        });
      } else {
        return this.$message.error("请选择图片");
      }
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
          if (res.status !== 200) {
            return this.$message.error("获取公告列表失败");
          } else {
            this.NoticeArr = res.data;
            this.pageInfo.total = res.total;
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
    handleChange(noticeID) {},
    addNotice() {
      this.addDialog = true;
      this.ShowUploadPic = true;
    },
    closeaddDialog() {
      this.addDialog = false;
      this.$refs.addRef.resetFields();
    },
    handlePicChange(file, fileList) {
      this.PictureList = fileList;
    },
    beforePicUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    commitNoticeForm() {
      let noticeForm = new FormData();
      noticeForm.append("title", this.NoticeForm.title);
      noticeForm.append("content", this.NoticeForm.content);
      this.PictureList.forEach((file) => {
        noticeForm.append("file", file.raw);
      });
      this.$http.post("admin/addNotice", noticeForm).then(({ data: res }) => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error("新增公告失败");
        } else {
          this.addDialog = false;
          this.ShowUploadPic = false;
          this.getNotice();
          this.$message.success("新增公告成功");
        }
      });
    },
    delNotice(id) {
      this.$confirm("是否删除该公告", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          if (res === "confirm") {
            this.$http
              .delete("admin/delNotice", { params: { id } })
              .then((res) => {
                if (res.status != 200) {
                  this.$message.error("删除失败");
                } else {
                  this.$message.success("删除成功");
                }
                this.getNotice();
              });
          }
        })
        .catch((err) => err);
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
  .Bannercard {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    .pictureList {
      margin-top: 20px;
      display: flex;
      img {
        height: 150px;
        width: 150px;
        border-radius: 10px;
      }
      .tips {
        font-size: 16px;
      }
      .pictureBox {
        position: relative;
        margin-left: 20px;
        &:hover .mask {
          opacity: 1;
        }
      }
      .mask {
        height: 150px;
        width: 150px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.2);
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
      }
      .picturePreview {
        cursor: pointer;
        position: absolute;
        left: 65px;
        top: 70px;
      }
      .upload {
        margin-left: 20px;
      }
    }
    .addbutton {
      text-align: right;
    }
  }
  .Notice {
    margin-top: 20px;
    .NoticeLeft {
      margin-top: 20px;
      .leftHead {
        span {
          font-size: 24px;
          font-weight: 600;
        }
        .addButton {
          text-align: right;
        }
      }
      .el-collapse {
        margin-top: 10px;
        .noticePic {
          margin-left: 5%;
          img {
            height: 120px;
            width: 150px;
            border-radius: 10px;
            margin-right: 20px;
          }
        }
        .noticePosition {
          text-align: right;
          span {
            font-size: 20px;
          }
        }
        .noticeContent {
          text-indent: 2cm;
          margin-top: 20px;
          span {
            font-size: 20px;
          }
        }
        .noticeTime {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          .noticeSpan {
            font-weight: 300;
            font-size: 16px;
            color: rgb(112, 18, 42);
            margin-right: 30px;
          }
        }
      }
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .Video{
    margin-top: 20px;
  }
}
</style>