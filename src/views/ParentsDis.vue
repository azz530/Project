<template>
  <div class="container">
    <Header></Header>
    <el-card class="main">
      <div class="top">
        <div class="add">
          <el-button type="primary" size="small" @click="addDiscuss"
            >新增讨论</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <Discuss :DiscussInfo="DiscussInfo"></Discuss>
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
      title="新增建议"
      :visible.sync="addDialog"
      width="60%"
      @close="closeAddDialog"
    >
      <el-form
        ref="addRef"
        :model="discussForm"
        label-width="100px"
        :rules="DiscussRule"
      >
        <el-form-item label="建议标题:" prop="discuss_title">
          <el-input
            v-model="discussForm.discuss_title"
          ></el-input>
        </el-form-item>
        <el-form-item label="建议标签:">
          <el-tag
            :key="tag"
            v-for="tag in discussForm.discuss_tags"
            closable
            @close="handleClose(tag)"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >添加标签</el-button
          >
        </el-form-item>
        <el-form-item label="建议内容:" prop="discuss_content">
          <quill-editor v-model="discussForm.discuss_content"> </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitDiscuss">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      DiscussInfo: [],
      addDialog: false,
      discussForm: {
        discuss_tags: [],
      },
      DiscussRule: {
        discuss_title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        discuss_content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      inputVisible: false,
      inputValue: "",
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
    };
  },
  created() {
    this.getAllDiscuss();
  },
  methods: {
    getAllDiscuss() {
      this.$http
        .get("my/getAllDiscuss", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("还没有讨论信息");
          } else {
            res.data.map((item) => {
              if (item.discuss_tags) {
                item.discuss_tags = item.discuss_tags.split(",");
              }
            });
            this.DiscussInfo = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    addDiscuss() {
      this.addDialog = true;
      this.discussForm.discuss_tags = [];
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getAllDiscuss();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getAllDiscuss();
    },
    closeAddDialog() {
      this.addDialog = false;
      this.$refs.addRef.resetFields();
    },
    handleClose(tag) {
      this.discussForm.discuss_tags.splice(
        this.discussForm.discuss_tags.indexOf(tag),
        1
      );
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      let flag = true;
      if (inputValue) {
        for (let i in this.discussForm.discuss_tags) {
          if (this.discussForm.discuss_tags[i].indexOf(inputValue) > -1) {
            this.$message.error("该标签已存在");
            this.inputVisible = false;
            flag = false;
          }
        }
        if (flag) {
          this.discussForm.discuss_tags.push(inputValue);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    commitDiscuss() {
      this.discussForm.user_id = this.$store.state.userInfo.id;
      this.discussForm.discuss_tags = this.discussForm.discuss_tags.join();
      this.$http
        .post("my/addDiscuss", this.discussForm)
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("新增讨论失败");
          } else {
            this.addDialog = false;
            this.$message.success("新增讨论成功");
            this.getAllDiscuss();
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .main {
    width: 1300px;
    margin: 10px auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: right;
      .search {
        .el-input {
          width: 600px;
        }
      }
      .add {
        margin-left: 30px;
      }
    }
  }
}
</style>