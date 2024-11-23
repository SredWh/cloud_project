async function login(event) {
    event.preventDefault(); // 防止表單默認提交行為
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch('/api/user_account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // 登入成功提示
        window.location.href = result.redirect; // 根據後端返回的跳轉 URL
      } else {
        alert(result.message); // 顯示錯誤訊息
      }
    } catch (error) {
      console.error("發生錯誤：", error);
      alert("伺服器連接失敗，請稍後再試。");
    }
  }
  