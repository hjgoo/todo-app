const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const deleteCompletedBtn = document.getElementById('delete-completed-btn');

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2
};

// 할 일 아이템 생성 함수
function createTodoItem(text, priority, completed = false) {
  const li = document.createElement('li');
  li.className = `todo-item ${priority}`;

  // 완료 버튼
  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.setAttribute('aria-label', '완료 토글');
  li.appendChild(completeBtn);

  // 텍스트
  const span = document.createElement('span');
  span.textContent = text;
  li.appendChild(span);

  // 완료 상태면 클래스 추가
  if (completed) {
    li.classList.add('completed');
  }

  // 완료 버튼 아이콘 업데이트
  updateCompleteBtn(completeBtn, completed);

  // 완료 버튼 클릭 이벤트
  completeBtn.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateCompleteBtn(completeBtn, li.classList.contains('completed'));
    sortAndRenderTodos();
    saveTodos();
  });

  // 삭제 버튼
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.setAttribute('aria-label', '삭제 버튼');
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

  return li;
}

// 완료 버튼 아이콘 업데이트
function updateCompleteBtn(btn, completed) {
  btn.innerHTML = completed
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b4f78e" viewBox="0 0 16 16"><path d="M13.485 1.929a.75.75 0 0 1 0 1.06L6.53 10.943 3.485 7.9a.75.75 0 0 1 1.06-1.06l1.984 1.984 5.956-5.956a.75.75 0 0 1 1.06 0z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;
}

// 로컬스토리지에서 todos 불러오기
function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return [];
  return JSON.parse(saved);
}

// 로컬스토리지에 저장
function saveTodos() {
  const items = todoList.querySelectorAll('.todo-item');
  const todos = [];
  items.forEach(item => {
    const text = item.querySelector('span').textContent;
    let priority = 'medium';
    if (item.classList.contains('low')) priority = 'low';
    else if (item.classList.contains('high')) priority = 'high';
    const completed = item.classList.contains('completed');
    todos.push({ text, priority, completed });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 리스트 정렬 및 렌더링
function sortAndRenderTodos() {
  const todos = loadTodos();
  todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // 완료된 건 아래로
    }
    if (a.completed) return 0; // 완료된 항목들끼리는 우선순위 상관없음
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  todoList.innerHTML = '';
  todos.forEach(({ text, priority, completed }) => {
    const li = createTodoItem(text, priority, completed);
    todoList.appendChild(li);
  });
}

// 할 일 추가
function addTodo() {
  const text = todoInput.value.trim();
  if (text === '') return;

  const priority = prioritySelect.value;
  const li = createTodoItem(text, priority, false);
  todoList.appendChild(li);
  saveTodos();
  sortAndRenderTodos();

  todoInput.value = '';
  todoInput.focus();
}

// 초기 로드 시 불러오기 및 렌더링
window.addEventListener('load', () => {
  sortAndRenderTodos();
  updateSelectColor();
});

// 중요도 선택 박스 색상 변경
function updateSelectColor() {
  const val = prioritySelect.value;
  prioritySelect.className = val;
}

prioritySelect.addEventListener('change', () => {
  updateSelectColor();
});

// 이벤트 바인딩
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

deleteCompletedBtn.addEventListener('click', () => {
  let todos = loadTodos();
  todos = todos.filter(todo => !todo.completed);
  localStorage.setItem('todos', JSON.stringify(todos));
  sortAndRenderTodos();
});
