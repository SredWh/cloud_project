const mysql = require('mysql');

// 連接資料庫
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'to_do_list',
});

db.connect((err) => {
  if (err) {
    console.error('資料庫連接失敗: ' + err.stack);
    return;
  }
  console.log('資料庫已連接');
});
module.exports = db;