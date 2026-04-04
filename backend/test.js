const http = require('http');
http.get('http://localhost:4000/api/user/profile', (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
}).on('error', e => console.log('Error', e.message));
