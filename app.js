const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// 로컬스토리지에서 데이터 불러오기
function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;

  const todos = JSON.parse(saved);
  todos.forEach(({ text, priority, completed }) => {
    createTodoItem(text, priority, completed);
  });
}

// 할 일 생성 함수
function createTodoItem(text, priority, completed = false) {
  const li = document.createElement('li');
  li.className = `todo-item ${priority}`;
  li.textContent = text;

  if (completed) {
    li.classList.add('completed');
  }

  // 완료 토글
  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTodos();
  });

  // 삭제 버튼
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 
      .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 
      2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `;

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    todoList.removeChild(li);
    saveTodos();
  });

  li.appendChild(removeBtn);
  todoList.appendChild(li);
}

// 로컬스토리지 저장
function saveTodos() {
  const items = todoList.querySelectorAll('.todo-item');
  const todos = [];
  items.forEach(item => {
    const text = item.childNodes[0].nodeValue.trim();
    let priority = 'medium';
    if (item.classList.contains('low')) priority = 'low';
    else if (item.classList.contains('high')) priority = 'high';
    const completed = item.classList.contains('completed');
    todos.push({ text, priority, completed });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 추가 버튼
addBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;

  if (text === '') {
    alert('할 일을 입력해주세요!');
    return;
  }

  createTodoItem(text, priority);
  saveTodos();

  todoInput.value = '';
  todoInput.focus();
  prioritySelect.value = 'medium';
  updateSelectColor();
});

// Enter 키로 추가
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// select 색상 업데이트
function updateSelectColor() {
  prioritySelect.classList.remove('low', 'medium', 'high');
  prioritySelect.classList.add(prioritySelect.value);
}
updateSelectColor();
prioritySelect.addEventListener('change', updateSelectColor);

// 초기 로딩
loadTodos();
