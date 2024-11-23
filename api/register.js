const db = require('./db'); // 匯入資料庫連線模組

// 註冊使用者
const registerUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO user_account (account, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('註冊錯誤:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = { registerUser };
