const db = require('./db'); // 匯入資料庫連線模組

// 驗證使用者登入，並返回使用者的 ID
const login = (username, password) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM user_account WHERE account = ? AND password = ?';
      db.query(query, [username, password], (err, result) => {
        if (err) {
          console.error('登入錯誤:', err);
          reject('伺服器錯誤');
        } else {
          if (result.length > 0) {
            // 找到匹配的帳號與密碼，返回 userId
            resolve(result[0].user_id); // 假設資料表中有 id 欄位
          } else {
            // 找不到匹配的帳號或密碼
            resolve(null);
          }
        }
      });
    });
  };


module.exports = { login };
