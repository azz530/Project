<template>
  <div class="container">
    <Header :avatar="userInfo.avatar"></Header>
    <div class="main_container">
      <el-card class="userMessage-card">
        <el-row type="flex">
          <el-card class="homework">
            <div class="homeworkTitle">作业信息</div>
            <div class="homeworkContent">
              <el-timeline>
                <el-timeline-item
                  v-for="item in HomeWorkList"
                  :key="item.work_id"
                  :timestamp="item.work_time"
                  placement="top"
                  @click.native="openWorkDetails(item.work_id)"
                >
                  <el-card>
                    <p class="course_name">科目:{{item.course_name}}</p>
                    <h4>{{ item.work_name }}</h4>
                    <p>期限:{{ item.work_deadline }}天</p>
                    <span
                      >{{ item.teacher_name }}发布于{{
                        item.details_time
                      }}</span
                    >
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>
          <el-card class="notice">
            <div class="noticeTitle">老师通知</div>
            <div class="noticeContent">
              <el-timeline>
                <el-timeline-item
                  v-for="item in Notice"
                  :key="item.notice_id"
                  :timestamp="item.notice_time"
                  placement="top"
                  @click.native="openNoticeDetails(item)"
                >
                  <el-card>
                    <h4>{{ item.notice_theme }}</h4>
                    <p>{{ item.notice_details }}</p>
                    <span
                      >{{ item.teacher_name }}发布于{{
                        item.details_time
                      }}</span
                    >
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="score">
            <div class="text">学习成绩
              <Echarts :propData="StuendScorePropData" id="Test" class="student_score"></Echarts>
            </div>
            
          </el-card>
        </el-row>
      </el-card>
      <el-card class="userInfo-card">
        <i class="el-icon-setting" @click="editUserInfo"></i>
        <div class="userInfo">
          <el-avatar
            :size="150"
            :src="userInfo.avatar ? userInfo.avatar : default_avatar"
          ></el-avatar>
          <el-upload
            ref="upload"
            action="http://127.0.0.1:3000/my/uploadAvatar"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :limit="1"
            :data="{ id }"
            :headers="headers"
            name="avatar"
          >
            <el-button size="small" type="primary">修改头像</el-button>
          </el-upload>
          <p class="username">{{ userInfo.username }}</p>
          <p class="usersign">签名:{{ userInfo.usersign }}</p>
        </div>
        <div class="usermessage">
          <el-row>
            <el-col :span="8">
              <i
                :class="
                  userInfo.sex === '女'
                    ? 'iconfont icon-xingbienv'
                    : 'iconfont icon-nan'
                "
              ></i>
            </el-col>
            <el-col :span="16">
              <p>{{ userInfo.sex }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <i class="iconfont icon-cardid"></i>
            </el-col>
            <el-col :span="16">
              <p>{{ userInfo.identity }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <i class="iconfont icon-shengrix"></i>
            </el-col>
            <el-col :span="16">
              <p>{{ userInfo.birthday }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <i class="iconfont icon-dizhi"></i>
            </el-col>
            <el-col :span="16">
              <p>{{ userInfo.address }}</p>
            </el-col>
          </el-row>
        </div>
        <div class="userTag">
          <div class="tag">用户标签</div>
          <div class="tag_contoent">
            <el-tag
              :key="tag"
              v-for="tag in userTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
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
              >新增标签</el-button
            >
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="修改个人信息"
      :visible.sync="editDialog"
      width="35%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="userFormRules"
        label-width="50px"
        ref="editRef"
      >
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="editForm.username" class="input_short"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px" prop="sex">
          <el-select v-model="editForm.sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" label-width="80px" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签名" label-width="80px">
          <el-input
            type="textarea"
            :rows="2"
            class="input_long"
            v-model="editForm.usersign"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="80px" prop="address">
          <el-input
            type="textarea"
            :rows="5"
            class="input_long"
            v-model="editForm.address"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitEditForm">确 定</el-button>
        <el-button @click="editDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="请确认学号"
      :visible.sync="checkDialog"
      width="35%"
      @close="closeCheckDialog"
    >
      <el-form
        :model="checkForm"
        :rules="checkFormRules"
        label-width="50px"
        ref="checkRef"
      >
        <el-form-item label="学号" label-width="80px" prop="identity_id">
          <el-input
            v-model="checkForm.identity_id"
            class="input_short"
          ></el-input>
          <el-button type="primary" round @click="checkIdentity"
            >确认学号</el-button
          >
        </el-form-item>
        <el-form-item label="姓名" label-width="80px">
          <el-input
            v-model="checkForm.student_name"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="班级" label-width="80px">
          <el-input
            v-model="checkForm.class_name"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="年级" label-width="80px">
          <el-input
            v-model="checkForm.grade_name"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitCheckForm">确 定</el-button>
        <el-button @click="checkDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="workDialog"
      title="提交作业"
      :visible.sync="workDialog"
      width="35%"
      @close="closeWorkDialog"
      z-index="1000"
    >
      <el-form :model="workForm" :rules="workFormRules" label-width="50px">
        <el-form-item label="作业号" label-width="80px">
          <el-input
            v-model="workForm.work_id"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="作业名" label-width="80px">
          <el-input
            v-model="workForm.work_name"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="作业详情" label-width="80px">
          <el-input
            v-model="workForm.work_details"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="截至日期" label-width="80px">
          <el-input
            v-model="workForm.end_time"
            class="input_short"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片" label-width="80px">
          <div class="work_pic">
            <el-row type="flex">
              <el-col>
                <img v-for="item in workForm.pic" :key="item" :src="item" alt="" />
              </el-col>
            </el-row>
          </div>
          <el-upload
            action=""
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handlePicChange"
            :before-upload="beforePicUpload"
            v-if="ShowUploadPic"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" label-width="80px" prop="work_content">
          <el-input
            type="textarea"
            :rows="5"
            class="input_long"
            v-model="workForm.work_content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitWorkForm(workForm)" :disabled="this.workForm.work_status?true:false"
          >确 定</el-button
        >
        <el-button @click="workDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="noticeDialog"
      :visible.sync="noticeDialog"
      title="班级公告"
      width="35%"
      @close="closeNDialog"
      z-index="1000"
    >
      <div class="noticeTitle">{{NoticeDetails.notice_theme}}</div>
      <div class="noticeContent">{{NoticeDetails.notice_details}}</div>
      <div class="noticeAuthor">{{NoticeDetails.teacher_name}}</div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Echarts from '../components/EchartsPic/Echarts.vue'
export default {
  components: {
    Header,
    Echarts
  },
  data() {
    const validateNum = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === "") {
        callback(new Error("请输入学号"));
      } else if (!reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      headers: {
        Authorization: this.$store.state.token,
        "Content-Type": "multipart/form-data",
      },
      default_avatar: "https://i02piccdn.sogoucdn.com/54b55e50edd9d56a",
      userInfo: {},
      id: "",
      userTags: [],
      inputVisible: false,
      inputValue: "",
      activeNames: "1",
      userLog: {},
      editDialog: false,
      editForm: {
        username: "",
        sex: "",
        birthday: null,
        usersign: "",
        address: "",
      },
      userFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        sex: [
          {
            required: true,
            message: "选择性别",
            trigger: ["change", "blur"],
            type: "string",
          },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      checkDialog: false,
      checkForm: {
        identity_id: "",
        class_name: "",
        grade_name: "",
        student_name: "",
      },
      checkFormRules: {
        identity_id: [
          { required: true, validator: validateNum, trigger: "blur" },
        ],
      },
      Notice: {},
      HomeWorkList: {},
      workDialog: false,
      workForm: {},
      workFormRules: {
        work_content:[{
          required:true,message:'请输入内容',trigger:'blur'
        }]
      },
      dialogVisible: false,
      showPicList: [],
      disabled: false,
      dialogImageUrl: "",
      pictureList: [],
      ShowUploadPic: true,
      noticeDialog:false,
      NoticeDetails:{},
      StuendScorePropData:this.$EchartsOption.studentScoreBar(),
    };
  },
  created() {
    this.getUserInfo();
    this.getNotice();
    this.getHomeWork();
  },
  mounted(){
    this.getScoreData();
  },
  beforeUpdate() {
    this.checkUserId();
  },
  methods: {
    getUserInfo() {
      this.id = this.$store.state.userInfo.id;
      this.$http
        .get("my/getUserInfo", {
          params: { id: this.id },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取用户信息失败");
          } else {
            this.userInfo = res.data;
            let tags = res.data.tags;
            if (tags) {
              this.userTags = tags.split(",");
            }
          }
        });
    },
    //用户头像修改
    beforeAvatarUpload(file) {
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
    handleSuccess(res, file) {
      if (res.status === 200) {
        this.userInfo.avatar = URL.createObjectURL(file.raw);
        this.$store.commit("setUserInfo", {
          username: this.$store.state.userInfo.username,
          id: this.$store.state.userInfo.id,
          identity: this.$store.state.userInfo.identity,
          identity_id: this.$store.state.userInfo.identity_id,
          avatar: this.userInfo.avatar,
          usersign: this.$store.state.userInfo.usersign,
        });
        this.$refs.upload.clearFiles(); //上传成功后删除历史记录
        this.$message.success("更换头像成功");
      }
    },

    //用户标签
    handleClose(tag) {
      this.userTags.splice(this.userTags.indexOf(tag), 1);
      this.$http
        .put("my/delTags", this.userTags, { params: { id: this.id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            this.$message.error("删除标签失败");
          } else {
            this.$message.success("删除标签成功");
          }
        });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.$http
          .put(
            "my/addTags",
            { tags: inputValue },
            {
              params: { id: this.id },
            }
          )
          .then(({ data: res }) => {
            console.log(res);
            if (res.status !== 200) {
              if (res.status === 402) {
                return this.$message.error("该标签已存在");
              }
              return this.$message.error("新增标签失败");
            } else {
              this.userTags.push(inputValue);
              return this.$message.success("新增标签成功");
            }
          });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    editUserInfo() {
      this.editDialog = true;
      this.editForm.username = this.userInfo.username;
      this.editForm.usersign = this.userInfo.usersign;
      this.editForm.sex = this.userInfo.sex;
      this.editForm.address = this.userInfo.address;
      this.editForm.birthday = this.userInfo.birthday;
    },
    closeEditDialog() {
      this.$refs.editRef.resetFields();
    },
    commitEditForm() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("my/changeUserInfo", this.editForm, {
              params: { id: this.id },
            })
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("修改信息失败");
              } else {
                this.$message.success("修改信息成功");
                this.getUserInfo();
                this.editDialog = false;
              }
            });
        }
      });
    },
    closeCheckDialog() {
      this.$refs.checkRef.resetFields();
      this.checkDialog = false;
    },
    checkUserId() {
      if (this.userInfo.identity === "student") {
        if (
          this.userInfo.identity_id === "" ||
          this.userInfo.identity_id === null
        ) {
          this.checkDialog = true;
        } else {
          this.checkDialog = false;
        }
      }
    },
    checkIdentity() {
      if (this.checkForm.identity_id) {
        this.$http
          .get("my/checkIdentity", {
            params: { student_id: this.checkForm.identity_id },
          })
          .then(({ data: res }) => {
            if (res.status !== 200) {
              if (res.status === 402) {
                return this.$message.error("该学号已被绑定");
              }
              return this.$message.error("认证失败");
            } else {
              this.$message.success("认证成功");
              this.checkForm.class_name = res.data.class_name;
              this.checkForm.grade_name = res.data.grade_name;
              this.checkForm.student_name = res.data.student_name;
            }
          });
      } else {
        return this.$message.error("请输入学号");
      }
    },
    commitCheckForm() {
      this.$refs.checkRef.validate((valid) => {
        if (valid) {
          this.$http
            .put("my/commitIDResult", this.checkForm, {
              params: { id: this.id },
            })
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("确认学号失败");
              } else {
                this.$message.success("确认学号成功");
                this.checkDialog = false;
                this.$router.go(0);
              }
            });
        }
      });
    },

    getNotice() {
      this.$http
        .get("my/getNotice", { params: { student_id: this.$store.state.userInfo.identity_id } })
        .then(({ data: res }) => {
          console.log(res);
          if (res.status !== 200) {
            return this.$message.error("获取班级公告失败");
          } else {
            this.Notice = res.data;
          }
        });
    },
    getHomeWork() {
      this.$http
        .get("my/getHomeWork", { params: { student_id: this.$store.state.userInfo.identity_id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取作业信息失败");
          } else {
            this.HomeWorkList = res.data;
          }
        });
    },
    closeWorkDialog() {
      this.workDialog = false;
      this.ShowUploadPic = false;
    },
    openWorkDetails(id) {
      this.workDialog = true;
      this.ShowUploadPic = true;
      this.$http
        .get("my/getDetailsHW", { params: { work_id: id } })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取作业详情失败");
          } else {
            this.workForm = res.data;
            if (res.data.work_pic) {
              this.workForm.pic = res.data.work_pic.split(",");
            }
            if(res.data.work_status){
              return this.$message.warning('你已提交该作业');
            }
          }
        });
    },
    commitWorkForm() {
      let work = new FormData();
      work.append("work_id", this.workForm.work_id);
      work.append("student_id", this.userInfo.identity_id);
      work.append("work_content", this.workForm.work_content);
      this.pictureList.forEach((file) => {
        work.append("file", file.raw);
      });

      // console.log(work);
      this.$http.post("my/commitHomeWork", work).then(({ data: res }) => {
        if (res.status !== 200) {
          return this.$message.error("提交作业失败");
        } else {
          this.$message.success("提交作业成功");
          this.workDialog = false;
          this.workForm.picture = res.picurl;
        }
      });
    },
    handlePicChange(file, fileList) {
      this.pictureList = fileList;
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
    handleRemove(file) {},
    closeNDialog(){
      this.noticeDialog = false;
    },
    openNoticeDetails(data){
      this.noticeDialog = true;
      this.NoticeDetails = data;
    },
    getScoreData(){  
      this.$http.get('my/getScoreData',{params:{student_id:this.$store.state.userInfo.identity_id}}).then(({data:res})=>{
        if(res.status !== 200){
          return this.$message.error('获取成绩信息失败');
        } else {
          const courseArr = res.data.map((item)=>{
            return item.course_name;
          })
          const scoreArr = res.data.map((item)=>{
            return item.score;
          })
          this.StuendScorePropData.xAxis.data = courseArr;
          this.StuendScorePropData.series[0].data = scoreArr;
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
  position: relative;
  .main_container {
    display: flex;
    .userMessage-card {
      margin-top: 20px;
      margin-left: 20px;
      display: flex;
      .homework {
        width: 450px;
        max-height: 430px;
        cursor: pointer;
        .homeworkTitle {
          margin-top: 5px;
          font-size: 22px;
        }
        .homeworkContent {
          margin-top: 20px;
          .el-card {
            min-height: 70px;
            position: relative;
            .course_name{
              font-size: 14px;
              position: absolute;
              left: 4px;
              top: 4px;
              color: rgb(66, 66, 248);
            }
            p {
              position: absolute;
              right: 4px;
              top: 4px;
            }
            span {
              position: absolute;
              right: 4px;
              bottom: 4px;
              margin-left: 30px;
              font-weight: 300;
              font-size: 10px;
            }
            .el-icon-check{
              position: absolute;
              right: 4px;
              bottom: 25px;
            }
          }
        }
        &:hover {
          overflow-y: auto;
        }
      }
      .notice {
        min-width: 900px;
        max-width: 1000px;
        max-height: 400px;
        margin-left: 20px;
        position: relative;
        cursor: pointer;
        .noticeTitle {
          margin-top: 5px;
          font-size: 22px;
        }
        .noticeContent {
          margin-top: 20px;
          p {
            margin-left: 10px;
            margin-top: 5px;
            font-size: 12px;
            font-weight: 400;
            color: rgb(2, 2, 2);
          }
          span {
            position: absolute;
            bottom: 4px;
            right: 10px;
            font-size: 12px;
            font-weight: 300;
          }
        }
        &:hover {
          overflow-y: auto;
        }
      }
      .score{
        margin-top: 30px;
        .student_score{
          width: 100%;
          height: 600px;
        }
      }
    }
    .userInfo-card {
      width: 400px;
      height: 60vh;
      margin-top: 20px;
      margin-left: 30px;
      position: fixed;
      right: 20px;
      .el-icon-setting {
        cursor: pointer;
      }
      .userInfo {
        text-align: center;
        .el-avatar {
          box-shadow: 5px 10px 10px rgb(193, 194, 194);
        }
        .el-upload {
          .el-button {
            margin-top: 20px;
          }
        }
        .username {
          margin: 20px 0;
          font-size: 26px;
        }
        .usersign {
          font-size: 14px;
          font-weight: 150;
          color: rgb(65, 66, 66);
        }
      }
      .usermessage {
        margin-top: 20px;
        .el-row {
          margin-top: 10px;
        }
        .el-col {
          i {
            display: block;
            text-align: right;
            font-size: 18px;
            padding-right: 10px;
          }
          p {
            line-height: 16px;
            font-size: 16px;
            color: rgb(146, 144, 144);
          }
        }
      }
      .userTag {
        margin-top: 20px;
        border-top: 1px solid rgb(153, 152, 152);
        .tag {
          margin-top: 10px;
        }
        .tag_contoent {
          margin-top: 20px;
          .el-tag {
            margin-right: 5px;
            margin-top: 5px;
          }
        }
      }
    }
  }
  .el-dialog {
    .el-form {
      .input_short {
        width: 40%;
      }
      .input_long {
        width: 80%;
      }
    }
  }
  .workDialog {
    .work_pic {
      max-width: 500px;
      img {
        display: inline-block;
        width: 150px;
        height: 150px;
        border-radius: 8px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .noticeDialog{
    .noticeTitle{
      text-align: center;
      font-size: 30px;
      font-weight: 800;
    }
    .noticeContent{
      text-indent: 1cm;
      margin-top: 30px;
      font-size: 20px;
      font-weight: 400;
      color: black;
    }
    .noticeAuthor{
      margin-top: 20px;
      font-size: 20px;
      font-weight: 600;
      text-align: right;
    }
  }
}
</style>