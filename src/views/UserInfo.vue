<template>
  <div class="container">
    <Header :avatar="userInfo.avatar"></Header>
    <div class="main_container">
      <el-card class="userInfo-card">
        <i class="el-icon-setting" @click="editUserInfo"></i>
        <div class="userInfo">
          <el-avatar :size="150" :src="userInfo.avatar"></el-avatar>
          <el-upload
            ref="upload"
            action="http://127.0.0.1:3000/my/uploadAvatar"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :show-file-list="false"
            :limit="1"
            :data="{ id }"
            name="avatar"
            :headers="headers"
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
      <el-card
        class="userMessage-card"
        v-if="$store.state.userInfo.identity === '学生' ? true : false"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="first">
            <span slot="label"
              ><i class="iconfont icon-zuoye1"></i> 作业信息</span
            >
            <div class="homework">
              <div
                class="homeworkItem"
                v-for="(item, index) in HomeWorkList"
                :key="index"
              >
                <div class="workTitle">{{ item.work_name }}</div>
                <div class="workContent">{{ item.work_details }}</div>
                <div class="workMessage">
                  <p class="teacher">{{ item.teacher_name }}</p>
                  发布于
                  <p class="time">{{ item.work_time }}</p>
                </div>
                <div class="endtime">截止至{{ item.end_time }}</div>
                <el-button
                  type="primary"
                  @click="openWorkDetails(item.work_id)"
                  size="mini"
                  :disabled="item.finishStatus === 1 ? true : false"
                  >{{
                    item.finishStatus === 1 ? "已提交" : "提交作业"
                  }}</el-button
                >
                <div class="teacher_eva">
                  <div class="eva_content">老师批改:{{ item.eva_content }}</div>
                  <div class="stars">
                    <el-rate
                      v-model="item.stars"
                      :colors="colors"
                      :disabled="true"
                    ></el-rate>
                  </div>
                </div>
                <el-divider></el-divider>
              </div>
            </div>
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
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label"
              ><i class="iconfont icon-tongzhi"></i> 老师通知</span
            >
            <div class="notice">
              <div
                class="noticeItem"
                v-for="(item, index) in Notice"
                :key="index"
              >
                <div class="theme">{{ item.notice_theme }}</div>
                <div class="content">{{ item.notice_details }}</div>

                <div class="noticeMessage">
                  <p class="teacher">{{ item.teacher_name }}</p>
                  发布于
                  <p class="time">{{ item.details_time }}</p>
                </div>
                <el-divider></el-divider>
              </div>
            </div>
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
          </el-tab-pane>
          <el-tab-pane name="third">
            <span slot="label"
              ><i class="iconfont icon-pingjia1"></i> 老师评价</span
            >
            <div class="evaluate">
              <div
                class="evaluateItem"
                v-for="(item, index) in EvaList"
                :key="index"
              >
                <div class="content">{{ item.content }}</div>

                <div class="courseStars">
                  课堂表现:
                  <el-rate
                    v-model="item.course_stars"
                    :colors="colors"
                    :disabled="true"
                  ></el-rate>
                </div>
                <div class="workStars">
                  作业表现:
                  <el-rate
                    v-model="item.work_stars"
                    :colors="colors"
                    :disabled="true"
                  ></el-rate>
                </div>
                <div class="thinkStars">
                  思想表现:
                  <el-rate
                    v-model="item.think_stars"
                    :colors="colors"
                    :disabled="true"
                  ></el-rate>
                </div>
                <div class="evaluateMessage">
                  <div class="teacher">{{ item.teacher_name }}</div>
                  <div class="time">{{ item.public_time }}</div>
                </div>
                <el-divider></el-divider>
              </div>
            </div>
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
          </el-tab-pane>
          <el-tab-pane name="fourth">
            <span slot="label"
              ><i class="iconfont icon-kaoshiguanli"></i> 考试成绩</span
            >
            <div class="score">
              <div
                class="scoreItem"
                v-for="(item, index) in ExamList"
                :key="index"
              >
                <div class="examTitle">
                  {{ item.exam_name }}
                </div>
                <div class="examContent">
                  {{ item.exam_message }}
                </div>
                <div class="footer">
                  <el-button
                    type="primary"
                    round
                    size="mini"
                    @click="openExamScore(item.exam_id)"
                    >查看成绩</el-button
                  >
                  <p>考试时间:{{ item.start_time }}~{{ item.end_time }}</p>
                </div>
                <el-divider></el-divider>
              </div>
            </div>
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
          </el-tab-pane>
          <el-tab-pane name="fifth">
            <span slot="label"><i class="el-icon-date"></i> 日程安排</span>
            <div class="activity">
              <el-calendar v-model="nowDate">
                <template slot="dateCell" slot-scope="{ data }">
                  <div class="day" @click="editTest(data.day)">
                    {{ data.day.split("-").slice(2)[0] }}
                    <div
                      class="activity"
                      v-for="item in calendarData"
                      :key="item.id"
                    >
                      <div v-if="item.actime.indexOf(data.day) > -1">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </template>
              </el-calendar>
            </div>
          </el-tab-pane>
          <el-tab-pane name="six">
            <span slot="label"
              ><i class="iconfont icon-kecheng1"></i> 我的课程</span
            >
            <div class="myCourse">
              <el-table border style="width: 100%" :data="MyCourseList">
                <el-table-column
                  type="index"
                  label="序号"
                  fixed
                  width="100px"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="课程号"
                  prop="course_id"
                  fixed
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="课程名称"
                  prop="course_name"
                  fixed
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="课程老师"
                  prop="teacher_name"
                  fixed
                  align="center"
                ></el-table-column>
              </el-table>
            </div>
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
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-card
        class="parentsCard"
        v-if="$store.state.userInfo.identity === '家长' ? true : false"
      >
        <div class="searchChildInfo">
          <el-input
            placeholder="输入孩子学号进行搜索"
            v-model="searchValue"
            clearable
            @keyup.enter.native="search"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="search"
            ></i>
          </el-input>
        </div>
        <div class="childMessage" v-if="isSearch">
          <el-tabs v-model="activeNum" @tab-click="handleClickParents">
            <el-tab-pane name="1">
              <span slot="label"
                ><i class="iconfont icon-zuoye1"></i> 作业信息</span
              >
              <div class="homework">
                <div
                  class="homeworkItem"
                  v-for="item in ChildrenWorkList"
                  :key="item.id"
                >
                  <div class="workMessage">
                    <div class="course_name">科目:{{ item.course_name }}</div>
                    <p class="workName">作业名:{{ item.work_name }}</p>
                    <p class="workDetails">详情:{{ item.work_details }}</p>
                    <p class="workTime">发布时间:{{ item.work_time }}</p>
                    <p class="EndTime">截止时间:{{ item.end_time }}</p>
                  </div>
                  <div class="childEditInfo">
                    提交信息:
                    <div class="pic">
                      <div
                        class="picItem"
                        v-show="item.work_pic.length > 0 ? true : false"
                        v-for="pic in item.work_pic"
                        :key="pic"
                      >
                        <img :src="pic" alt="" />
                        <div class="mask">
                          <i
                            class="el-icon-search"
                            @click="handlePictureCardPreview(pic)"
                          ></i>
                        </div>
                      </div>
                    </div>
                    <p class="content">{{ item.work_content }}</p>
                    <p class="editTime">提交时间:{{ item.time }}</p>
                  </div>
                  <div class="teacher_eva">
                    <div class="eva_content">
                      老师批改:{{ item.eva_content }}
                    </div>
                    <div class="stars">
                      <el-rate
                        v-model="item.stars"
                        :colors="colors"
                        :disabled="true"
                      ></el-rate>
                    </div>
                  </div>
                  <el-divider></el-divider>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="2">
              <span slot="label"
                ><i class="iconfont icon-pingjia1"></i> 老师评价</span
              >
              <div class="evaluate">
                <div
                  class="evaluateItem"
                  v-for="item in ChildrenEvaList"
                  :key="item.id"
                >
                  <div class="content">{{ item.content }}</div>

                  <div class="courseStars">
                    课堂表现:
                    <el-rate
                      v-model="item.course_stars"
                      :colors="colors"
                      :disabled="true"
                    ></el-rate>
                  </div>
                  <div class="workStars">
                    作业表现:
                    <el-rate
                      v-model="item.work_stars"
                      :colors="colors"
                      :disabled="true"
                    ></el-rate>
                  </div>
                  <div class="thinkStars">
                    思想表现:
                    <el-rate
                      v-model="item.think_stars"
                      :colors="colors"
                      :disabled="true"
                    ></el-rate>
                  </div>
                  <div class="evaluateMessage">
                    <div class="teacher">{{ item.teacher_name }}</div>
                    <div class="time">{{ item.public_time }}</div>
                  </div>
                  <el-divider></el-divider>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="3">
              <span slot="label"
                ><i class="iconfont icon-kaoshiguanli"></i> 考试成绩</span
              >
              <div class="score">
                <div
                  class="scoreItem"
                  v-for="item in ChildrenExamList"
                  :key="item.exam_id"
                >
                  <div class="examTitle">
                    {{ item.exam_name }}
                  </div>
                  <div class="examContent">
                    {{ item.exam_message }}
                  </div>
                  <div class="footer">
                    <el-button
                      type="primary"
                      round
                      size="mini"
                      @click="openExamScoreParent(item.exam_id)"
                      >查看成绩</el-button
                    >
                    <p>考试时间:{{ item.start_time }}~{{ item.end_time }}</p>
                  </div>
                  <el-divider></el-divider>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
                <img
                  v-for="item in workForm.pic"
                  :key="item"
                  :src="item"
                  alt=""
                />
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
        <el-button type="primary" @click="commitWorkForm(workForm)"
          >确 定</el-button
        >
        <el-button @click="workDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="scoreDialog"
      :visible.sync="scoreDialog"
      title="查看成绩"
      width="40%"
      @close="closeScoreDialog"
    >
      <div class="scoreEcharts">
        <Echarts
          :propData="StuendScorePropData"
          id="Test"
          class="student_score"
        ></Echarts>
      </div>
    </el-dialog>

    <el-dialog
      title="新增活动"
      :visible.sync="activityDialog"
      width="35%"
      @close="closeactivityDialog"
    >
      <el-form
        :model="activityForm"
        :rules="activityFormRules"
        label-width="50px"
        ref="activityRef"
      >
        <el-form-item label="活动名" label-width="80px" prop="name">
          <el-input v-model="activityForm.name" class="input_short"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" label-width="80px" prop="actime">
          <el-date-picker
            v-model="activityForm.actime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitactivityForm">确 定</el-button>
        <el-button @click="activityDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="showPic" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Echarts from "../components/EchartsPic/Echarts.vue";
export default {
  components: {
    Header,
    Echarts,
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
      },
      default_avatar: "https://i02piccdn.sogoucdn.com/54b55e50edd9d56a",
      userInfo: {},
      id: this.$store.state.userInfo.id,
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
      Notice: {},
      HomeWorkList: {},
      workDialog: false,
      workForm: {},
      workFormRules: {
        work_content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      showPicList: [],
      disabled: false,
      dialogImageUrl: "",
      pictureList: [],
      ShowUploadPic: true,
      StuendScorePropData: this.$EchartsOption.studentScoreBar(),
      ExamList: [],
      scoreDialog: false,
      EvaList: [],
      activeName: "first",
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      nowDate: new Date(),
      calendarData: [],
      activityDialog: false,
      activityForm: {},
      activityFormRules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        actime: [{ required: true, message: "请选择时间", trigger: "blur" }],
      },
      searchValue: "",
      activeNum: "1",
      ChildrenWorkList: [],
      ChildrenEvaList: [],
      ChildrenExamList: [],
      showPic: "",
      isSearch: false,
      MyCourseList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      tabspage: "first",
    };
  },
  created() {
    this.getUserInfo();
    if (this.$store.state.userInfo.identity === "学生") {
      this.getHomeWork();
    }
  },
  methods: {
    getUserInfo() {
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
    getNotice() {
      this.$http
        .get("my/getNotice", {
          params: {
            student_id: this.$store.state.userInfo.identity_id,
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取班级公告失败");
          } else {
            this.Notice = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    getHomeWork() {
      this.$http
        .get("my/getHomeWork", {
          params: {
            student_id: this.$store.state.userInfo.identity_id,
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取作业信息失败");
          } else {
            this.HomeWorkList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    getExamList() {
      this.$http
        .get("my/getExamInfo", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("暂无考试信息");
          } else {
            this.ExamList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    getEvaList() {
      this.$http
        .get("my/getStdEva", {
          params: {
            student_id: this.$store.state.userInfo.identity_id,
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取老师评价失败");
          } else {
            this.EvaList = res.data;
            this.pageInfo.total = res.total;
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
        this.userInfo.avatar = res.avatarUrl;
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
    //修改用户信息
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

    closeWorkDialog() {
      this.workDialog = false;
      this.ShowUploadPic = false;
    },
    //作业详情及提交
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
    commitWorkForm() {
      let work = new FormData();
      work.append("work_id", this.workForm.work_id);
      work.append("student_id", this.userInfo.identity_id);
      work.append("work_content", this.workForm.work_content);
      this.pictureList.forEach((file) => {
        work.append("file", file.raw);
      });
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

    closeScoreDialog() {
      this.scoreDialog = false;
    },
    //查看成绩事件
    openExamScore(id) {
      this.scoreDialog = true;
      this.$http
        .get("my/getScoreData", {
          params: {
            student_id: this.$store.state.userInfo.identity_id,
            exam_id: id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            if (res.status === 402) {
              return this.$message.error("暂无成绩");
            }
            return this.$message.error("获取成绩信息失败");
          } else {
            const courseArr = res.data.map((item) => {
              return item.course_name;
            });
            const scoreArr = res.data.map((item) => {
              return item.score;
            });
            this.StuendScorePropData.xAxis.data = courseArr;
            this.StuendScorePropData.series[0].data = scoreArr;
          }
        });
    },
    getActivity() {
      this.$http
        .get("my/getActivity", {
          params: { id: this.$store.state.userInfo.id },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("未添加安排");
          } else {
            this.calendarData = res.data;
          }
        });
    },
    editTest(day) {
      let status = false;
      this.calendarData.map((i) => {
        if (i.actime === day) {
          status = true;
        }
      });
      if (status) {
        this.$message.error("该天已安排活动");
      } else {
        this.activityDialog = true;
        this.activityForm.actime = day;
      }
    },
    closeactivityDialog() {
      this.activityDialog = false;
    },
    commitactivityForm() {
      this.$refs.activityRef.validate((valid) => {
        if (valid) {
          this.$http
            .post("my/addActivity", this.activityForm, {
              params: { id: this.$store.state.userInfo.id },
            })
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("新增活动失败");
              } else {
                this.$message.success("新增活动成功");
                this.activityDialog = false;
                this.getActivity();
              }
            });
        }
      });
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      if (this.tabspage === "first") {
        this.getHomeWork();
      } else if (this.tabspage === "second") {
        this.getNotice();
      } else if (this.tabspage === "third") {
        this.getEvaList();
      } else if (this.tabspage === "fourth") {
        this.getExamList();
      } else if (this.tabspage === "six") {
        this.getMyCourseList();
      }
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      if (this.tabspage === "first") {
        this.getHomeWork();
      } else if (this.tabspage === "second") {
        this.getNotice();
      } else if (this.tabspage === "third") {
        this.getEvaList();
      } else if (this.tabspage === "fourth") {
        this.getExamList();
      } else if (this.tabspage === "six") {
        this.getMyCourseList();
      }
    },
    getMyCourseList() {
      this.$http
        .get("my/getMyCourse", {
          params: {
            student_id: this.$store.state.userInfo.identity_id,
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("获取课程失败");
          } else {
            this.MyCourseList = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    //tabs点击获取相关页数据
    handleClick(tab, event) {
      this.tabspage = tab.name;
      const initPage = {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      };
      if (tab.name === "first") {
        this.pageInfo = initPage;
        this.getHomeWork();
      } else if (tab.name === "second") {
        this.pageInfo = initPage;
        this.getNotice();
      } else if (tab.name === "third") {
        this.pageInfo = {
          pageNum: 1,
          pageSize: 5,
          total: 0,
        };
        this.getEvaList();
      } else if (tab.name === "fourth") {
        this.pageInfo = initPage;
        this.getExamList();
      } else if (tab.name === "fifth") {
        this.pageInfo = initPage;
        this.getActivity();
      } else if (tab.name === "six") {
        this.pageInfo = initPage;
        this.getMyCourseList();
      }
    },

    search() {
      if (this.searchValue) {
        let reg = /^\d{6,10}$/;
        if (reg.test(this.searchValue)) {
          this.$http
            .get("my/getChildrenInfo", {
              params: { student_id: this.searchValue },
            })
            .then(({ data: res }) => {
              if (res.status !== 200) {
                return this.$message.error("查询失败");
              } else {
                this.$message.success("查询成功");
                this.isSearch = true;
                this.ChildrenWorkList = res.workList;
                this.ChildrenEvaList = res.evaList;
                this.ChildrenExamList = res.examList;
              }
            });
        } else {
          return this.$message.error("请输入正确的学号");
        }
      }
    },
    handleClickParents(tab) {},
    handlePictureCardPreview(pic) {
      this.dialogVisible = true;
      this.showPic = pic;
    },
    openExamScoreParent(id) {
      this.scoreDialog = true;
      this.$http
        .get("my/getScoreData", {
          params: {
            student_id: this.searchValue,
            exam_id: id,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            if (res.status === 402) {
              return this.$message.error("暂无成绩");
            }
            return this.$message.error("获取成绩信息失败");
          } else {
            const courseArr = res.data.map((item) => {
              return item.course_name;
            });
            const scoreArr = res.data.map((item) => {
              return item.score;
            });
            this.StuendScorePropData.xAxis.data = courseArr;
            this.StuendScorePropData.series[0].data = scoreArr;
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
  .main_container {
    display: flex;
    .userMessage-card {
      width: 1350px;
      margin-top: 20px;
      margin-left: 50px;
      display: flex;
      .el-tabs {
        width: 1300px;
        .el-tab-pane {
          width: 1300px;
          .homework {
            padding: 30px;
            .homeworkItem {
              padding: 15px;
              .workTitle {
                font-size: 20px;
                font-weight: 600;
              }
              .workContent {
                margin-top: 20px;
                margin-left: 15px;
                font-size: 16px;
                font-weight: 400;
              }
              .workMessage {
                position: relative;
                right: -980px;
                font-size: 14px;
                display: flex;
                margin-top: 20px;
                .teacher {
                  color: rgb(115, 115, 252);
                  margin-right: 3px;
                }
                .time {
                  margin-left: 3px;
                }
              }
              .endtime {
                padding-top: 10px;
                position: relative;
                right: -980px;
              }
              .el-button {
                margin-left: 15px;
              }
              .teacher_eva {
                margin-top: 20px;
                margin-left: 20px;
                .stars {
                  padding-top: 10px;
                }
              }
            }
          }
          .notice {
            padding: 30px;
            .noticeItem {
              padding: 15px;
              .theme {
                font-size: 20px;
                font-weight: 600;
              }
              .content {
                text-indent: 2em;
                margin-top: 20px;
                font-size: 16px;
                font-weight: 400;
              }
              .noticeMessage {
                position: relative;
                right: -980px;
                font-size: 14px;
                display: flex;
                margin-top: 10px;
                .teacher {
                  color: rgb(115, 115, 252);
                  margin-right: 3px;
                }
                .time {
                  margin-left: 3px;
                }
              }
            }
          }
          .evaluate {
            padding: 30px;
            .evaluateItem {
              .courseStars {
                padding-top: 20px;
                padding-left: 10px;
                display: flex;
                .el-rate {
                  margin-left: 10px;
                }
              }
              .workStars {
                padding-top: 10px;
                padding-left: 10px;
                display: flex;
                .el-rate {
                  margin-left: 10px;
                }
              }
              .thinkStars {
                padding-top: 10px;
                padding-left: 10px;
                display: flex;
                .el-rate {
                  margin-left: 10px;
                }
              }
              .evaluateMessage {
                display: flex;
                position: relative;
                right: -1000px;
              }
            }
          }
          .score {
            padding: 30px;
            .scoreItem {
              .examTitle {
                font-size: 22px;
                font-weight: 600;
              }
              .examContent {
                text-indent: 2em;
                margin-top: 20px;
                font-size: 16px;
                font-weight: 400;
              }
              .footer {
                text-align: right;
              }
            }
          }
          .activity {
            .el-calendar {
              width: 100%;
              .day {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                .activity {
                  position: absolute;
                  left: 0;
                  top: 0;
                  color: rgb(15, 88, 247);
                  font-size: 16px;
                }
              }
            }
          }
          .myCourse {
            margin-top: 50px;
          }
        }
        .el-pagination {
          text-align: right;
          margin-right: 10px;
          margin-top: 10px;
        }
      }
    }
    .parentsCard {
      width: 1350px;
      margin-top: 20px;
      margin-left: 50px;
      .searchChildInfo {
        width: 500px;
        margin: 0 auto;
        i {
          cursor: pointer;
        }
      }
      .childMessage {
        margin-top: 20px;
        min-height: 500px;
        .homework {
          padding: 30px;
          .homeworkItem {
            .workMessage {
              font-size: 16px;
              letter-spacing: 1px;
              .workName {
                padding-bottom: 10px;
              }
              .workDetails {
                padding-bottom: 10px;
              }
              .workTime {
                text-align: right;
              }
              .EndTime {
                text-align: right;
              }
            }
            .childEditInfo {
              font-size: 16px;
              .pic {
                margin-top: 10px;
                margin-left: 10px;
                display: flex;
                .picItem {
                  width: 150px;
                  height: 150px;
                  margin-right: 20px;
                  position: relative;
                  cursor: pointer;
                  &:hover .mask {
                    opacity: 0.85;
                  }
                }
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
                  }
                }
              }
              .content {
                padding: 10px;
              }
              .editTime {
                text-align: right;
              }
            }
            .teacher_eva {
              margin-top: 20px;
              margin-left: 20px;
              .stars {
                padding-top: 10px;
              }
            }
          }
        }
        .evaluate {
          padding: 30px;
          .evaluateItem {
            .courseStars {
              padding-top: 20px;
              padding-left: 10px;
              display: flex;
              .el-rate {
                margin-left: 10px;
              }
            }
            .workStars {
              padding-top: 10px;
              padding-left: 10px;
              display: flex;
              .el-rate {
                margin-left: 10px;
              }
            }
            .thinkStars {
              padding-top: 10px;
              padding-left: 10px;
              display: flex;
              .el-rate {
                margin-left: 10px;
              }
            }
            .evaluateMessage {
              display: flex;
              position: relative;
              right: -1000px;
            }
          }
        }
        .score {
          padding: 30px;
          .scoreItem {
            .examTitle {
              font-size: 22px;
              font-weight: 600;
            }
            .examContent {
              text-indent: 2em;
              margin-top: 20px;
              font-size: 16px;
              font-weight: 400;
            }
            .footer {
              text-align: right;
            }
          }
        }
      }
    }
    .userInfo-card {
      width: 400px;
      max-height: 70vh;
      margin-top: 20px;
      margin-left: 30px;
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
  .noticeDialog {
    .noticeTitle {
      text-align: center;
      font-size: 30px;
      font-weight: 800;
    }
    .noticeContent {
      text-indent: 1cm;
      margin-top: 30px;
      font-size: 20px;
      font-weight: 400;
      color: black;
    }
    .noticeAuthor {
      margin-top: 20px;
      font-size: 20px;
      font-weight: 600;
      text-align: right;
    }
  }
  .scoreDialog {
    .scoreEcharts {
      margin: 0 auto;
      height: 400px;
      width: 500px;
    }
  }
}
</style>