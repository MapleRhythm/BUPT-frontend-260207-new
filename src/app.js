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
      }
    }
  })
});