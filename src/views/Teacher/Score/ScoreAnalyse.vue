<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>成绩分析</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="mainCard">
      <Echarts
        :propData="DataAnalysePropData"
        id="ScoreAnalyse"
        class="ScoreAnalyse"
      ></Echarts>
    </el-card>
    
  </div>
</template>

<script>
import Echarts from "../../../components/EchartsPic/Echarts.vue";
import UserCard from '../../../components/UserCard.vue'
export default {
  components: {
    Echarts,
    UserCard
  },
  data() {
    return {
      DataAnalysePropData: this.$EchartsOption.ScoreAnalyse(),
    };
  },
  mounted() {},
  created() {
    this.getClassScore();
  },
  methods: {
    getClassScore(){
      this.$http.get('teacher/getClassScore',{params:{teacher_id:this.$store.state.userInfo.identity_id}}).then(res=>{
        console.log(res);
      })
    },

  },
};
</script>

<style lang="less" scoped>
.container {
  .mainCard {
    margin-top: 20px;
    .ScoreAnalyse {
      width: 100%;
      height: 600px;
    }
  }
}
</style>