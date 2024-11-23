const db = require('./db'); // 匯入資料庫連線模組

// 註冊使用者
const add_item = (new_item, new_date, user_id) => {
  return new Promise((resolve, reject) => {
    // 在這裡，user_id 應該已經由路由處理過並傳遞過來
    const query = 'INSERT INTO to_do_list (item, create_date, user_id) VALUES (?, ?, ?)';
    db.query(query, [new_item, new_date, user_id], (err, result) => {
      if (err) {
        console.error('新增失敗:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
const show_item = (user_id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM to_do_list WHERE user_id = ?';
      db.query(query, [user_id], (err, result) => {
        if (err) {
          console.error('查詢失敗:', err);
          reject(err);
        } else {
          resolve(result); // 回傳查詢的結果
        }
      });
    });
  };

  const delete_item = (user_id,t_d_id) => {
    return new Promise((resolve, reject) => {
      // 在這裡，user_id 應該已經由路由處理過並傳遞過來
      const query = 'DELETE FROM to_do_list where t_d_id=? and user_id=?';
      db.query(query, [t_d_id,user_id], (err, result) => {
        if (err) {
          console.error('刪除失敗:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  };
  
  module.exports = { add_item, show_item,delete_item };
  