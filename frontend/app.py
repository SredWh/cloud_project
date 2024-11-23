from flask import Flask, request, jsonify, redirect, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# 資料庫連線功能
def get_db_connection():
    try:
        conn = sqlite3.connect('users.db')
        conn.row_factory = sqlite3.Row  # 返回字典型資料
        return conn
    except sqlite3.Error as e:
        print(f"資料庫連線錯誤: {e}")
        return None

# 驗證帳密
def check_credentials(username, password):
    conn = get_db_connection()
    if not conn:
        return None
    cursor = conn.cursor()
    cursor.execute("SELECT username, password FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    # 若用戶存在，檢查密碼（需存儲哈希密碼）
    if user and check_password_hash(user["password"], password):
        return user
    return None

# 註冊路由
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        username = data.get('username')
        password = data.get('password')
        
        # 檢查帳號是否已存在
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            return "帳號已存在，請選擇其他帳號", 400
        
        # 密碼加密後儲存
        hashed_password = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
        conn.close()

        # 註冊成功，跳轉回登入頁面
        return redirect(url_for('login'))

    return '''
        <form method="POST">
            帳號: <input type="text" name="username" required><br>
            密碼: <input type="password" name="password" required><br>
            <button type="submit">註冊</button>
        </form>
    '''


# 登入路由
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.form
        username = data.get('username')
        password = data.get('password')

        # 驗證帳密
        user = check_credentials(username, password)
        if user:
            return "登入成功！", 200
        else:
            # 如果登入失敗，返回錯誤訊息並提示註冊
            return jsonify({"success": False, "message": "查無帳號密碼，請先行註冊"}), 401

    return '''
        <form method="POST">
            帳號: <input type="text" name="username" required><br>
            密碼: <input type="password" name="password" required><br>
            <button type="submit">登入</button>
        </form>
    '''


if __name__ == '__main__':
    app.run(debug=True)
