const echartsTool = {
    studentScoreBar:() => {
        return {
            tooltip:{
                trigger:'axis',
                formatter:function(arg){
                    let str = `<div style="margin: 0px 0 0;line-height:1;">`
                    str += `<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${arg[0].axisValue}<span style="display:inline-block">${arg[0].value}分</span></div>`
                    return str;
                }
            },
            xAxis:{
                type:'category',
                data:[],
            },
            yAxis:{
                type:'value',
            },
            series:[
                {
                    name:'各科成绩',
                    data:[],
                    type:'bar',
                    barWidth:66,
                    label:{//数据柱的文字标识
                        show:true,
                        position:'top',
                        color:'#00aeec'                
                    },
                    itemStyle:{
                        BorderRadius:[10,10,0,0],//每个数据柱的弧度
                        color:'#66b1ff'
                    }
                },
            ],
        }
    },
    ScoreAnalyse:()=>{
        return {
            title:{
                text:'成绩分析'
            },
            series:[
                {
                    name:'学生成绩图',
                    data:[{name:'不及格',value:20},{name:'及格',value:20},{name:'良好',value:40},{name:'优秀',value:30}],
                    type:'pie',
                    label:{
                        show:true,
                        formatter:function(arg){
                            let str = arg.name + ' ' + arg.value + '人,' + arg.percent + '%';
                            return str;
                        }
                    }
                },
            ],
        }
    }
}
export default echartsTool;