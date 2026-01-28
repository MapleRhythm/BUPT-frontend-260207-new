const http = require('http');

const PORT = process.env.PORT || 3001;
let blockHeight = 630760;
let centerBlockHeight = 630788;

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
  if (req.method === 'GET' && url.pathname === '/api/center-data') {
    centerBlockHeight += 1;
    const payload = {
      ueId: '265',
      targetId: '64f070:00000089',
      reason: '无线网络层',
      status: '上下文释放',
      blockHeight: centerBlockHeight,
      risk: '否'
    };
    sendJson(res, 200, payload);
    return;
  }

  sendJson(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
