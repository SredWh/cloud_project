const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  // 引入 cors 模組
const session = require('express-session');
const { login } = require('./login');
const { add_item ,show_item,delete_item} = require('./todo');
const { registerUser } = require('./register');
const { add_pic ,show_pic,delete_pic} = require('./upload_pic');

const app = express();
const port = 3000;
// 設置session中間件
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,  // 在 HTTP 下設為 false
    sameSite: 'None',
  }
}));

// 設置 CORS 允許所有來源
app.use(cors({
  origin: 'http://localhost',  // 允許前端端口
  credentials: true                // 允許跨域請求傳送 Cookies
}));
app.use(express.json()); // 解析 JSON 請求
app.use(express.static(path.join(__dirname, '../public'))); // 提供靜態文件

// 註冊 API
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // 呼叫 db.js 中的 registerUser 函式來處理註冊
  try {
    const success = await registerUser(username, password);
    if (success) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: '註冊失敗，請重試。' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
});
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 呼叫 login 函式進行登入驗證
    const user_id = await login(username, password);
    
    if (user_id) {
      // 登入成功，儲存 userId 到 session
      req.session.user_id = user_id;
      
      res.json({ success: true, message: '登入成功' , user_id: user_id   });
    } else {
      // 登入失敗
      res.json({ success: false, message: '登入失敗，請重試。' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
});
app.post('/api/add_item', (req, res) => {
  const { new_item, new_date ,user_id} = req.body;
 

  if (!user_id) {
    return res.status(400).json({ success: false, message: '請登入' });
  }

  // 呼叫 add_item 函式來新增待辦事項
  add_item(new_item, new_date, user_id)
    .then(() => {
      res.json({ success: true, message: '新增成功' });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: '伺服器錯誤，請稍後再試。' });
    });
});
//顯示事項
app.post('/api/show_item', async (req, res) => {
  const { user_id } = req.body;
 
  if (!user_id) {
    return res.status(400).json({ success: false, message: '請登入' });
  }
  try {
    
    const user_item = await show_item(user_id);
    // console.log(user_item);
    if (user_item) {
      // 登入成功，儲存 userId 到 session
      
      
      res.json({ success: true, items: user_item   });
    } else {
      // 登入失敗
      res.json({ success: false, message: '沒有找到任何待辦事項' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
});

app.post('/api/delete_item', async (req, res) => {
  const { user_id,item_id } = req.body;
  console.log(req.body);
  if (!user_id || !item_id) {
    return res.status(400).json({ success: false, message: '請登入' });
  }
  try {
    
    const success = await delete_item(user_id,item_id);
   
    if (success) {
      
      
      res.json({ success: true  });
    } else {
      // 登入失敗
      res.json({ success: false, message: '刪除失敗' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
});
// pic
// 將 uploads 資料夾設為靜態資源目錄
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 設置圖片存儲位置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 圖片將存儲在 uploads 資料夾
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
// 設置圖片上傳限制
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; // 允許的檔案格式
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允許上傳 JPEG 或 PNG 格式的圖片'));
    }
  },
});

// 路由
app.post('/api/add_pic', upload.single('image'), (req, res) => {
  const user_id = req.body.user_id;
  const image_path = req.file ? req.file.path : null; // 獲取圖片的存儲路徑

  if (!user_id || !image_path) {
    return res.status(400).json({ success: false, message: '用戶 ID 或圖片缺失' });
  }

  // 將圖片資料存儲到資料庫
  add_pic(image_path, user_id)
    .then(() => {
      res.json({ success: true, message: '圖片新增成功' });
    })
    .catch((err) => {
      console.error('新增圖片失敗:', err);
      res.status(500).json({ success: false, message: '伺服器錯誤，請稍後再試。' });
    });
});
//顯示pic
// API - 顯示圖片
app.post('/api/show_pic', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, message: '請登入' });
  }
  try {
    const user_images = await show_pic(user_id);
    if (user_images) {
      const baseUrl = req.protocol + '://' + req.get('host');
      const imagesWithUrl = user_images.map(image => ({
        ...image,
        url: `${baseUrl}/${image.image_path}`,
      }));

      res.json({ success: true, images: imagesWithUrl });
    } else {
      res.json({ success: false, message: '沒有找到任何圖片' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
});

app.post('/api/delete_pic', async (req, res) => {
  const { imageId,user_id} = req.body;
  console.log(imageId);
  console.log(req.body);
  if (!user_id || !imageId ) {
    return res.status(400).json({ success: false, message: '請登入' });
  }
  try {
    
    const success = await delete_pic(user_id,imageId);
   
    if (success) {
      
      
      res.json({ success: true  });
    } else {
      
      res.json({ success: false, message: '刪除失敗' });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    res.json({ success: false, message: '伺服器錯誤，請稍後再試。' });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
