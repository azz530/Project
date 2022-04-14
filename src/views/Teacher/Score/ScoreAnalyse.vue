<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>成绩分析</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="mainCard">
      <div class="box" v-for="item in ExamArr" :key="item.exam_id">
        <div class="title">{{ item.exam_name }}</div>
        <div class="time">{{ item.start_time }}</div>
        <el-button
          type="primary"
          size="small"
          @click="openScoreEcharts(item.exam_id)"
          >成绩数据图</el-button
        >
        <el-divider></el-divider>
      </div>
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
      class="scoreDialog"
      :visible.sync="scoreDialog"
      title="查看成绩"
      width="40%"
      @close="closeScoreDialog"
    >
      <div class="scoreEcharts">
        <Echarts
          :propData="DataAnalysePropData"
          id="ScoreAnalyse"
          class="ScoreAnalyse"
        ></Echarts>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Echarts from "../../../components/EchartsPic/Echarts.vue";
export default {
  components: {
    Echarts,
  },
  data() {
    return {
      ExamArr: [],
      DataAnalysePropData: this.$EchartsOption.ScoreAnalyse(),
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      scoreDialog: false,
    };
  },
  mounted() {},
  created() {
    this.getExamList();
  },
  methods: {
    getExamList() {
      this.$http
        .get("admin/getExamInfo", {
          params: {
            pageNum: this.pageInfo.pageNum,
            pageSize: this.pageInfo.pageSize,
          },
        })
        .then(({ data: res }) => {
          if (res.status !== 200) {
            return this.$message.error("暂无考试信息");
          } else {
            this.ExamArr = res.data;
            this.pageInfo.total = res.total;
          }
        });
    },
    getClassScore(id) {
      this.$http
        .get("teacher/getAllScore", {
          params: {
            teacher_id: this.$store.state.userInfo.identity_id,
            exam_id: id,
          },
        })
        .then(({ data: res }) => {
          console.log(res);
          if (res.status !== 200) {
            return this.$message.error("获取成绩失败");
          } else {
            console.log(res);
            const ScoreData = [
              { name: "不及格(<60)", value: res.data.d },
              { name: "及格(60~70)", value: res.data.c },
              { name: "良好(70~90)", value: res.data.b },
              { name: "优秀(90~100)", value: res.data.a },
            ];
            this.DataAnalysePropData.series[0].data = ScoreData;
          }
        });
    },
    openScoreEcharts(id) {
      this.scoreDialog = true;
      this.getClassScore(id);
    },
    //改变每页数据展示规格变化
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getExamList();
    },
    //改变当前页数据变化
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getExamList();
    },
    closeScoreDialog() {
      this.scoreDialog = false;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .mainCard {
    margin-top: 20px;
    .box {
      padding: 20px;
      font-size: 20px;
      position: relative;
      .time {
        position: absolute;
        right: 30px;
        padding: 0px 20px;
        color: rgb(31, 164, 253);
      }
      .el-button{
        margin-top: 10px;
      }
    }
    .el-pagination {
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .scoreDialog {
    .scoreEcharts {
      margin: 0 auto;
      height: 500px;
      width: 700px;
    }
  }
}
</style>