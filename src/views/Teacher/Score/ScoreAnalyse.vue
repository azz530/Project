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
      this.$http.get('teacher/getClassScore',{params:{teacher_id:this.$store.state.userInfo.identity_id}}).then(({data:res})=>{
        if(res.status !== 200){
          return this.$message.error('获取成绩失败');
        } else {
          const ScoreData = [
            {name:'不及格',value:res.data.d},
            {name:'及格',value:res.data.c},
            {name:'良好',value:res.data.b},
            {name:'优秀',value:res.data.a}
          ];
          this.DataAnalysePropData.series[0].data = ScoreData;
        }
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