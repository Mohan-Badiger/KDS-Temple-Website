import http from "http";
import fs from "fs";

http.get('http://127.0.0.1:4000/api/user/profile', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => fs.writeFileSync('test_output.txt', 'STATUS: ' + res.statusCode + '\nDATA: ' + data));
}).on('error', (err) => fs.writeFileSync('test_output.txt', 'ERROR: ' + err.message));
