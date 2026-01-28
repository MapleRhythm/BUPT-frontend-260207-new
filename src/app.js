document.addEventListener('DOMContentLoaded', function(){
  new Vue({
    el: '#app',
    data(){
      return {
        collapsed: false,
        dialogVisible: false,
        dialogTitle: '详情',
        chartShown: false,
        headers:['无线网络分布式协同认证','无线网络数据可信交互','无线网络用户数据隐私保护'],
        leftRecord: null,
        leftRecordKey: '',
        gifDurationMs: 11100,
        gifIntervalId: null,
        gifTickRunning: false,
        centerRecord: null,
        centerRecordKey: '',
        centerGifDurationMs: 12020,
        centerGifIntervalId: null,
        centerGifTickRunning: false,
        apiBase: 'http://localhost:3001'
      }
    },
    mounted(){
      this.initCharts();
      this.startGifLoop();
      this.startCenterGifLoop();
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
        // 生成当前时间以及往前推11个10分钟的时间点
        const generateTimeData = () => {
          const times = [];
          const now = new Date();
          for (let i = 11; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 10 * 60 * 1000);
            const hour = time.getHours().toString().padStart(2, '0');
            const minute = time.getMinutes().toString().padStart(2, '0');
            times.push(`${hour}:${minute}`);
          }
          return times;
        };
        const tpsXData = generateTimeData();
        const tpsYData = [11550, 11620, 11580, 11600, 11750, 11620, 11700, 11450, 11600, 11700, 11750, 11620];
        
        // 计算TPS数据范围和上下限
        const tpsMin = 8000;
        const tpsMax = 13000;
        const tpsRange = tpsMax - tpsMin;
        const tpsPadding = tpsRange * 0.1; // 0.1倍的数据范围作为padding，总范围为1.2倍
        const tpsYMin = tpsMin - tpsPadding;
        const tpsYMax = tpsMax + tpsPadding;
        
        tpsChart.setOption({
          backgroundColor: 'transparent',
          title: {
            text: 'TPS曲线',
            left: 'center',
            top: '0%',
            textStyle: {
              color: '#C4CAF3',
              fontSize: 20,
              fontFamily: '"Microsoft YaHei", sans-serif'
            },
            padding: [20, 0, 0, 0]
          },
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
            //name: "时间",
            //nameLocation: "bottom",
            //nameTextStyle: { color: "#00FFF6", fontSize: 12 },
            axisLabel: { color: "#C4CAF3", fontSize: 12 },
            axisLine: { show: true, lineStyle: { color: "rgba(1, 202, 251, 0.4)", width: 1 } },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: "value",
            name: "TPS",
            min: tpsMin,
            max: tpsMax,
            interval: 1000,//function(max, min) { return Math.ceil((max - min) / 4); },
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
        const growthXData = generateTimeData();
        const growthYData = [123, 125, 122, 124, 126, 124, 125, 123, 121, 127, 130, 127];
        
        // 计算链生长率数据范围和上下限
        const growthMin = 90;
        const growthMax = 140;
        const growthRange = growthMax - growthMin;
        const growthPadding = growthRange * 0.1; // 0.1倍的数据范围作为padding，总范围为1.2倍
        const growthYMin = growthMin - growthPadding;
        const growthYMax = growthMax + growthPadding;
        
        growthChart.setOption({
          backgroundColor: 'transparent',
          title: {
            text: '链生长率',
            left: 'center',
            top: '0%',
            textStyle: {
              color: '#C4CAF3',
              fontSize: 20,
              fontFamily: '"Microsoft YaHei", sans-serif'
            },
            padding: [20, 0, 0, 0]
          },
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
            //name: "时间",
            //nameLocation: "bottom",
            //nameTextStyle: { color: "#00FFF6", fontSize: 12 },
            axisLabel: { color: "#C4CAF3", fontSize: 12 },
            axisLine: { show: true, lineStyle: { color: "rgba(1, 202, 251, 0.4)", width: 1 } },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: "value",
            name: "出块时间 (ms)",
            min: growthMin,
            max: growthMax,
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
      },
      startGifLoop(){
        const img = document.getElementById('left-gif');
        if (!img) return;
        const baseSrc = img.getAttribute('src') || '';
        const restart = async () => {
          if (this.gifTickRunning) return;
          this.gifTickRunning = true;
          await this.fetchLeftData();
          img.setAttribute('src', '');
          img.setAttribute('src', baseSrc);
          this.gifTickRunning = false;
        };
        this.fetchLeftData();
        if (this.gifIntervalId) {
          clearInterval(this.gifIntervalId);
        }
        this.gifIntervalId = setInterval(restart, this.gifDurationMs);
      },
      async fetchLeftData(){
        try{
          const resp = await fetch(`${this.apiBase}/api/left-data`, { cache: 'no-store' });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          const record = {
            ue: data.ue || 'UEB',
            timestamp: data.timestamp,
            blockHeight: data.blockHeight,
            status: data.status || '证书验证通过'
          };
          this.leftRecord = record;
          this.leftRecordKey = `${record.timestamp}-${record.blockHeight}`;
        }catch(err){
          console.warn('[left-data] fetch failed', err);
        }
      },
      startCenterGifLoop(){
        const img = document.getElementById('center-gif');
        if (!img) return;
        const baseSrc = img.getAttribute('src') || '';
        const restart = async () => {
          if (this.centerGifTickRunning) return;
          this.centerGifTickRunning = true;
          await this.fetchCenterData();
          img.setAttribute('src', '');
          img.setAttribute('src', baseSrc);
          this.centerGifTickRunning = false;
        };
        this.fetchCenterData();
        if (this.centerGifIntervalId) {
          clearInterval(this.centerGifIntervalId);
        }
        this.centerGifIntervalId = setInterval(restart, this.centerGifDurationMs);
      },
      async fetchCenterData(){
        try{
          const resp = await fetch(`${this.apiBase}/api/center-data`, { cache: 'no-store' });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          const record = {
            ueId: data.ueId || '265',
            targetId: data.targetId || '64f070:00000089',
            reason: data.reason || '无线网络层',
            status: data.status || '上下文释放',
            blockHeight: data.blockHeight,
            risk: data.risk || '否'
          };
          this.centerRecord = record;
          this.centerRecordKey = `${record.blockHeight}-${record.ueId}`;
        }catch(err){
          console.warn('[center-data] fetch failed', err);
        }
      }
    }
  })
});
