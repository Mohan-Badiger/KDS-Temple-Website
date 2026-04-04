const http = require('http');
const fs = require('fs');
http.get('http://localhost:4000/api/user/profile', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => fs.writeFileSync('response.txt', res.statusCode + ' ' + data));
}).on('error', err => fs.writeFileSync('response.txt', 'ERR: ' + err.message));
