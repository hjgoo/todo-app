const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2
};

// 할 일 생성 함수
function createTodoItem(text, priority, completed = false) {
  const li = document.createElement('li');
  li.className = `todo-item ${priority}`;

  // 완료 버튼 생성
  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.setAttribute('aria-label', '완료 토글 버튼');
  completeBtn.innerHTML = completed
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b4f78e" viewBox="0 0 16 16"><path d="M13.485 1.929a.75.75 0 0 1 0 1.06L6.53 10.943 3.485 7.9a.75.75 0 0 1 1.06-1.06l1.984 1.984 5.956-5.956a.75.75 0 0 1 1.06 0z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;

  li.appendChild(completeBtn);

  // 텍스트 스팬
  const textSpan = document.createElement('span');
  textSpan.textContent = text;
  li.appendChild(textSpan);

  // 완료 상태 적용
  if (completed) {
    li.classList.add('completed');
  }

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

// 저장된 todos 불러오기
function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return [];

  return JSON.parse(saved);
}

// todos 로컬스토리지에 저장
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

// 정렬 후 화면에 렌더링
function sortAndRenderTodos() {
  const todos = loadTodos();

  // 완료 여부로 먼저 분리
  const incomplete = todos.filter(t => !t.completed);
  const complete = todos.filter(t => t.completed);

  // 중요도 순서로 정렬 (high -> medium -> low)
  incomplete.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  complete.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // 리스트 초기화
  todoList.innerHTML = '';

  // 미완료 리스트 먼저 추가
  incomplete.forEach(({ text, priority, completed }) => {
    const item = createTodoItem(text, priority, completed);
    todoList.appendChild(item);
  });

  // 완료 리스트 뒤에 추가
  complete.forEach(({ text, priority, completed }) => {
    const item = createTodoItem(text, priority, completed);
    todoList.appendChild(item);
  });
}

// 추가 버튼 클릭 이벤트
addBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;
  if (text === '') return;

  const todos = loadTodos();
  todos.push({ text, priority, completed: false });
  localStorage.setItem('todos', JSON.stringify(todos));

  todoInput.value = '';
  todoInput.focus();

  sortAndRenderTodos();
});

// Enter 키로 추가
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// 완료된 항목 모두 삭제 버튼
clearCompletedBtn.addEventListener('click', () => {
  let todos = loadTodos();
  todos = todos.filter(todo => !todo.completed);
  localStorage.setItem('todos', JSON.stringify(todos));
  sortAndRenderTodos();
});

// 중요도 선택 박스 색상 변경 함수
function updateSelectColor() {
  const val = prioritySelect.value;
  prioritySelect.className = val;
}
updateSelectColor();
prioritySelect.addEventListener('change', updateSelectColor);

// 초기 렌더링
sortAndRenderTodos();
