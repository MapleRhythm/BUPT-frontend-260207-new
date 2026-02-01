const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
let blockHeight = 630760;

// TPS 和链生长率数据存储
const DATA_POINTS = 720;
const INTERVAL_SECONDS = 10;

// 初始化 TPS 数据
let tpsData = [];
let growthData = [];

// 生成平滑随机数据
function generateSmoothRandomData(base, variance, count) {
  const data = [];
  let currentValue = base;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * variance;
    currentValue += change;
    // 保持在合理范围内
    if (currentValue < base - variance) currentValue = base - variance;
    if (currentValue > base + variance) currentValue = base + variance;
    data.push(Math.round(currentValue));
  }
  return data;
}

// 初始化数据
function initializeData() {
  const now = Date.now();
  const startTime = now - (DATA_POINTS - 1) * INTERVAL_SECONDS * 1000;
  
  // 生成 TPS 数据 (11500-12000)
  const tpsValues = generateSmoothRandomData(11750, 500, DATA_POINTS);
  
  // 生成链生长率数据 (123-130)
  const growthValues = generateSmoothRandomData(126.5, 7, DATA_POINTS);
  
  for (let i = 0; i < DATA_POINTS; i++) {
    const timestamp = startTime + i * INTERVAL_SECONDS * 1000;
    const date = new Date(timestamp);
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    
    tpsData.push({
      time: `${hour}:${minute}:${second}`,
      value: tpsValues[i]
    });
    
    growthData.push({
      time: `${hour}:${minute}:${second}`,
      value: growthValues[i]
    });
  }
}

// 写入日志文件
function writeLog(timestamp, tps) {
  const logPath = path.join(__dirname, 'tps.log');
  const logEntry = `${timestamp},${tps}\n`;
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}

// 更新数据（每10秒调用一次）
function updateData() {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const timestamp = `${hour}:${minute}`;
  
  // 生成新的 TPS 值
  const lastTps = tpsData[tpsData.length - 1].value;
  const tpsChange = (Math.random() - 0.5) * 100;
  let newTps = lastTps + tpsChange;
  if (newTps < 11500) newTps = 11500 + Math.random() * 100;
  if (newTps > 12000) newTps = 12000 - Math.random() * 100;
  newTps = Math.round(newTps);
  
  // 生成新的链生长率值
  const lastGrowth = growthData[growthData.length - 1].value;
  const growthChange = (Math.random() - 0.5) * 4;
  let newGrowth = lastGrowth + growthChange;
  if (newGrowth < 123) newGrowth = 123 + Math.random() * 2;
  if (newGrowth > 130) newGrowth = 130 - Math.random() * 2;
  newGrowth = Math.round(newGrowth);
  
  // 移除最旧的数据，添加新数据
  const second = now.getSeconds().toString().padStart(2, '0');
  const newTime = `${hour}:${minute}:${second}`;
  
  tpsData.shift();
  tpsData.push({ time: newTime, value: newTps });
  
  growthData.shift();
  growthData.push({ time: newTime, value: newGrowth });
  
  // 打印当前时间点的 TPS 数据
  console.log(`[${newTime}] TPS: ${newTps}, Growth: ${newGrowth}`);
  
  // 写入日志文件
  writeLog(timestamp, newTps);
}

// 初始化数据
initializeData();

// 每10秒更新一次数据
setInterval(updateData, INTERVAL_SECONDS * 1000);

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // TPS 数据 API
  if (req.method === 'GET' && url.pathname === '/api/tps-data') {
    const payload = {
      tps: tpsData,
      growth: growthData
    };
    sendJson(res, 200, payload);
    return;
  }
  
  // 左侧数据 API
  if (req.method === 'GET' && url.pathname === '/api/left-data') {
    blockHeight += 1;
    const payload = {
      ue: 'UEB',
      timestamp: Math.floor(Date.now() / 1000),
      blockHeight,
      status: '证书验证通过'
    };
    sendJson(res, 200, payload);
    return;
  }
  
  // 中间数据 API
  if (req.method === 'GET' && url.pathname === '/api/center-data') {
    blockHeight += 1;
    const payload = {
      ueId: '265',
      targetId: '64f070:00000089',
      reason: '无线网络层',
      status: '上下文释放',
      blockHeight,
      risk: '否'
    };
    sendJson(res, 200, payload);
    return;
  }

  sendJson(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`TPS data initialized with ${DATA_POINTS} points`);
});
