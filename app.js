const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2
};

// 할 일 생성
function createTodoItem(text, priority, completed = false) {
  const li = document.createElement('li');
  li.className = `todo-item ${priority}`;
  if (completed) li.classList.add('completed');

  // 완료 버튼
  const checkBtn = document.createElement('button');
  checkBtn.className = 'check-btn';
  checkBtn.innerHTML = '✓';
  checkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.classList.toggle('completed');
    saveTodos();
    sortTodos();
  });

  // 텍스트
  const textSpan = document.createElement('span');
  textSpan.textContent = text;

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

  li.appendChild(checkBtn);
  li.appendChild(textSpan);
  li.appendChild(removeBtn);
  todoList.appendChild(li);
  sortTodos();
}

// 저장
function saveTodos() {
  const items = todoList.querySelectorAll('.todo-item');
  const todos = [];
  items.forEach(item => {
    const text = item.querySelector('span').textContent.trim();
    let priority = 'medium';
    if (item.classList.contains('low')) priority = 'low';
    else if (item.classList.contains('high')) priority = 'high';
    const completed = item.classList.contains('completed');
    todos.push({ text, priority, completed });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 불러오기
function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;

  const todos = JSON.parse(saved);
  todos.forEach(({ text, priority, completed }) => {
    createTodoItem(text, priority, completed);
  });
}

// 정렬 (우선순위 → 완료여부)
function sortTodos() {
  const items = Array.from(todoList.children);

  items.sort((a, b) => {
    const aCompleted = a.classList.contains('completed');
    const bCompleted = b.classList.contains('completed');

    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }

    const getPriority = el =>
        el.classList.contains('high') ? 'high' :
            el.classList.contains('medium') ? 'medium' : 'low';

    return priorityOrder[getPriority(a)] - priorityOrder[getPriority(b)];
  });

  items.forEach(item => todoList.appendChild(item));
}

// select 색상 반영
function updateSelectColor() {
  prioritySelect.classList.remove('low', 'medium', 'high');
  prioritySelect.classList.add(prioritySelect.value);
}

// 이벤트
addBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;

  if (!text) {
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
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});
prioritySelect.addEventListener('change', updateSelectColor);

// 초기 로딩
updateSelectColor();
loadTodos();
