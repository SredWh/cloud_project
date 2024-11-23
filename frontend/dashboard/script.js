// 新增項目
function addItem() {
  const input = document.getElementById('newItem');
  const dateInput = document.getElementById('newDate');
  const list = document.getElementById('todoList');

  const value = input.value.trim();
  const dateValue = dateInput.value;

  if (value === '' || dateValue === '') {
    alert('請填寫完整的待辦事項和日期！');
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
    <div class="checkbox" onclick="toggleDone(this)"></div>
    <span>${value}</span>
    <small>${dateValue}</small>
    <i onclick="removeItem(this)">×</i>
  `;
  list.appendChild(li);
  input.value = '';
  dateInput.value = '';
}

// 刪除項目
function removeItem(element) {
  element.parentElement.remove();
}

// 切換完成狀態
function toggleDone(element) {
  const li = element.parentElement;
  element.classList.toggle('checked');
  li.classList.toggle('done');
}
