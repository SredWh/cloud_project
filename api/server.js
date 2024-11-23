const express = require('express');
const path = require('path');
const cors = require('cors');  // 引入 cors 模組
const session = require('express-session');
const { login } = require('./login');
const { add_item ,show_item,delete_item} = require('./todo');
const { registerUser } = require('./register');

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
