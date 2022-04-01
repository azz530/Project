<template>
  <div class="tab">
    <div :id="id" class="tab_canavas"></div>
  </div>
</template>

<script>
import *as echarts from 'echarts';
export default {
    props:['propData','id'],
    data(){
      return{
        myChart:null,
      }
    },
    watch: {
      propData: { //监听的对象
        deep: true, //深度监听设置为 true
        handler: function(newV, oldV) {
          if (newV) {
            //propData更新时
            this.myChart.setOption(newV);
          }
        }
      }
    },
    mounted(){
      if(this.id){
        let myChart = echarts.init(document.getElementById(this.id));
        this.myChart = myChart;
        this.myChart.setOption(this.propData);
        window.addEventListener('resize', ()=> {
          this.myChart.resize()
        })
      }
    },
    methods:{

    },
}
</script>

<style lang="less" scoped>
.tab {
  width: 100%;
  height: 100%;
  .tab_canavas{
    width: 100%;
    height: 100%;
  }
}
</style>