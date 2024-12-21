const db = require('./db'); // 匯入資料庫連線模組
const path = require('path'); // 用於處理路徑
const fs = require('fs'); // 用於處理檔案系統操作
const Minio = require('minio'); // 匯入 MinIO 模組

// 初始化 MinIO 客戶端
const minioClient = new Minio.Client({
  endPoint: 'minio-service.minio.svc.cluster.local', // MinIO 的內部服務地址
  port: 9000, // MinIO 服務的端口
  useSSL: false, // 根據是否使用 HTTPS 調整
  accessKey: 'your-access-key', // MinIO 的訪問密鑰
  secretKey: 'your-secret-key', // MinIO 的密鑰
});

// Bucket 名稱
const bucketName = 'your-bucket-name';

// 確保 Bucket 存在
async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Bucket '${bucketName}' 不存在，正在創建...`);
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket '${bucketName}' 創建成功！`);
    }
  } catch (error) {
    console.error('Error checking or creating bucket:', error);
  }
}

// 將圖片上傳到 MinIO
const uploadToMinio = (imagePath, fileName) => {
  return new Promise((resolve, reject) => {
    minioClient.fPutObject(bucketName, fileName, imagePath, (err, etag) => {
      if (err) {
        console.error('上傳到 MinIO 失敗:', err);
        reject(err);
      } else {
        console.log(`圖片成功上傳到 MinIO：${fileName}`);
        resolve(true);
      }
    });
  });
};

// 註冊上傳圖片
const add_pic = async (image_path, user_id) => {
  const fileName = path.basename(image_path); // 提取檔案名
  try {
    // 確保 MinIO bucket 存在
    await ensureBucketExists();

    // 將圖片上傳到 MinIO
    await uploadToMinio(image_path, fileName);

    // 插入資料庫記錄
    const query = 'INSERT INTO image_uploads (image_path, user_id, upload_date) VALUES (?, ?, NOW())';
    return new Promise((resolve, reject) => {
      db.query(query, [fileName, user_id], (err, result) => {
        if (err) {
          console.error('新增圖片失敗:', err);
          reject(err);
        } else {
          console.log('圖片已新增到資料庫:', fileName);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('圖片處理失敗:', error);
    throw error; // 傳遞錯誤到上層處理
  }
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
