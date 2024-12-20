const db = require('./db'); // 匯入資料庫連線模組
const path = require('path'); // 用於處理路徑
const fs = require('fs'); // 用於處理檔案系統操作

// 註冊上傳圖片
const add_pic = (image_path, user_id) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO image_uploads (image_path, user_id, upload_date) VALUES (?, ?, NOW())';
      db.query(query, [image_path, user_id], (err, result) => {
        if (err) {
          console.error('新增圖片失敗:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
};

// 顯示用戶上傳的所有圖片
const show_pic = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM image_uploads WHERE user_id = ?';
    db.query(query, [user_id], (err, result) => {
      if (err) {
        console.error('查詢失敗:', err);
        reject('查詢失敗');
      } else {
        resolve(result); // 回傳查詢的結果
      }
    });
  });
};

// 刪除圖片
const delete_pic = (user_id, image_id) => {
  return new Promise((resolve, reject) => {
    // 查詢圖片的路徑
    const query = 'SELECT image_path FROM image_uploads WHERE id = ? AND user_id = ?';
    db.query(query, [image_id, user_id], (err, result) => {
      if (err || result.length === 0) {
        console.error('圖片查詢失敗:', err);
        reject('圖片查詢失敗');
        return;
      }

      const imagePath = result[0].image_path;

      // 刪除資料庫中的圖片記錄
      const deleteQuery = 'DELETE FROM image_uploads WHERE id = ? AND user_id = ?';
      db.query(deleteQuery, [image_id, user_id], (err, result) => {
        if (err) {
          console.error('刪除失敗:', err);
          reject('刪除失敗');
          return;
        }

        // 刪除伺服器上的圖片檔案
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('刪除圖片檔案失敗:', err);
            reject('刪除圖片檔案失敗');
            return;
          }

          resolve(true); // 刪除成功
        });
      });
    });
  });
};

module.exports = { add_pic, show_pic, delete_pic };
