document.addEventListener('DOMContentLoaded', function(){
  new Vue({
    el: '#app',
    data(){
      return {
        collapsed: false,
        dialogVisible: false,
        dialogTitle: '详情',
        chartShown: false,
        headers:['无线网络分布式协同认证','无线网络数据可信交互','无线网络用户数据隐私保护']
      }
    },
    mounted(){
      this.initCharts();
    },
    methods:{
      togglePreview(){ this.collapsed = !this.collapsed },
      openHelp(){ window.open('https://example.com','_blank') },
      openDialog(i){ this.dialogTitle = this.headers[i]; this.dialogShown(i) },
      dialogShown(i){ this.dialogVisible = true; this.chartShown = false },
      showChart(i){
        this.dialogTitle = this.headers[i] + ' - 图表示例';
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.chartShown = true;
          var chartDom = document.getElementById('chart');
          var myChart = echarts.init(chartDom);
          var option = {
            title: {text: this.headers[i], left:'center', textStyle:{color:'#fff'}},
            tooltip: {},
            xAxis: {data: ['A','B','C','D','E','F'], axisLine:{lineStyle:{color:'#6fb3ff'}}},
            yAxis: {axisLine:{lineStyle:{color:'#6fb3ff'}}},
            series: [{type: 'bar', data: [5, 20, 36, 10, 10, 20], itemStyle:{color:'#4fd1ff'}}]
          };
          myChart.setOption(option);
        })
      },
      initCharts(){
        // 初始化 TPS 折线图
        var tpsChart = echarts.init(document.getElementById('tps-chart'));
        
        // 参照references样式的TPS图表
        const tpsXData = ["14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35"];
        const tpsYData = [8450, 8520, 8480, 8600, 8550, 8620, 8700, 8650, 8720, 8800, 8750, 8820];
        
        // 计算TPS数据范围和上下限
        const tpsMin = Math.min(...tpsYData);
        const tpsMax = Math.max(...tpsYData);
        const tpsRange = tpsMax - tpsMin;
        const tpsPadding = tpsRange * 0.1; // 0.1倍的数据范围作为padding，总范围为1.2倍
        const tpsYMin = tpsMin - tpsPadding;
        const tpsYMax = tpsMax + tpsPadding;
        
        tpsChart.setOption({
          backgroundColor: 'transparent',
          grid: { top: "20%", bottom: "20%", right: "5%", left: "8%" },
          tooltip: { 
            trigger: "axis",
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: 'rgba(1, 202, 251, 0.4)',
            textStyle: { color: '#C4CAF3' }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: tpsXData,
            name: "时间",
            nameLocation: "bottom",
            nameTextStyle: { color: "#00FFF6", fontSize: 12 },
            axisLabel: { color: "#C4CAF3", fontSize: 12 },
            axisLine: { show: true, lineStyle: { color: "rgba(1, 202, 251, 0.4)", width: 1 } },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: "value",
            name: "TPS",
            min: Math.floor(tpsYMin),
            max: Math.ceil(tpsYMax),
            interval: 200,//function(max, min) { return Math.ceil((max - min) / 4); },
            nameLocation: "middle",
            nameTextStyle: { color: "#00FFF6", fontSize: 12, rotate: 0 },
            axisLabel: { color: "#C4CAF3", fontSize: 12 },
            axisLine: { show: true, lineStyle: { color: "rgba(1, 202, 251, 0.4)" } },
            splitLine: {
              show: true,
              lineStyle: { type: "dashed", color: "rgba(1, 202, 251, 0.4)" }
            }
          },
          series: [{
            name: "TPS",
            type: "line",
            smooth: true,
            showSymbol: false,
            clip: true,
            lineStyle: { width: 2, color: "#3ae6d5" },
            data: tpsYData
          }]
        });

        // 初始化链生长率折线图
        var growthChart = echarts.init(document.getElementById('growth-chart'));
        
        // 参照references样式的链生长率图表
        const growthXData = ["14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35"];
        const growthYData = [120, 125, 122, 130, 128, 132, 135, 133, 138, 140, 139, 142];
        
        // 计算链生长率数据范围和上下限
        const growthMin = Math.min(...growthYData);
        const growthMax = Math.max(...growthYData);
        const growthRange = growthMax - growthMin;
        const growthPadding = growthRange * 0.1; // 0.1倍的数据范围作为padding，总范围为1.2倍
        const growthYMin = growthMin - growthPadding;
        const growthYMax = growthMax + growthPadding;
        
        growthChart.setOption({
          backgroundColor: 'transparent',
          grid: { top: "20%", bottom: "20%", right: "5%", left: "8%" },
          tooltip: { 
            trigger: "axis",
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: 'rgba(1, 202, 251, 0.4)',
            textStyle: { color: '#C4CAF3' }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: growthXData,
            name: "时间",
            nameLocation: "bottom",
            nameTextStyle: { color: "#00FFF6", fontSize: 12 },
            axisLabel: { color: "#C4CAF3", fontSize: 12 },
            axisLine: { show: true, lineStyle: { color: "rgba(1, 202, 251, 0.4)", width: 1 } },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: "value",
            name: "block/s",
            min: Math.floor(growthYMin),
            max: Math.ceil(growthYMax),
            interval: 10,//function(max, min) { return Math.ceil((max - min) / 4); },
            nameLocation: "middle",
            nameTextStyle: { color: "#00FFF6", fontSize: 12, rotate: 0 },
            axisLabel: { color: "#C4CAF3", fontSize: 12 },
            axisLine: { show: true, lineStyle: { color: "rgba(1, 202, 251, 0.4)" } },
            splitLine: {
              show: true,
              lineStyle: { type: "dashed", color: "rgba(1, 202, 251, 0.4)" }
            }
          },
          series: [{
            name: "链生长率",
            type: "line",
            smooth: true,
            showSymbol: false,
            clip: true,
            lineStyle: { width: 2, color: "#3ae6d5" },
            data: growthYData
          }]
        });

        // 响应式调整
        window.addEventListener('resize', function(){
          tpsChart.resize();
          growthChart.resize();
        });
      }
    }
  })
});