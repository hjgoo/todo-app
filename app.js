const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const deleteCompletedBtn = document.getElementById('delete-completed-btn');
const todoList = document.getElementById('todo-list');

// 로컬스토리지에서 불러오기
function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;

  const todos = JSON.parse(saved);
  todos.forEach(({ text, priority, completed }) => {
    createTodoItem(text, priority, completed);
  });

  sortTodos();
}

// 저장
function saveTodos() {
  const items = [...todoList.querySelectorAll('.todo-item')];
  const todos = items.map(item => ({
    text: item.querySelector('.todo-text').textContent,
    priority: getPriorityFromClass(item),
    completed: item.classList.contains('completed'),
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 할 일 아이템 생성
function createTodoItem(text, priority, completed = false) {
  const li = document.createElement('li');
  li.className = `todo-item ${priority}`;
  if (completed) li.classList.add('completed');

  // 완료 버튼
  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  if (completed) completeBtn.classList.add('checked');

  completeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.classList.toggle('completed');
    completeBtn.classList.toggle('checked');
    sortTodos();
    saveTodos();
  });

  // 텍스트
  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text;

  // 삭제 버튼
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '×';
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    saveTodos();
  });

  // 조립
  li.appendChild(completeBtn);
  li.appendChild(span);
  li.appendChild(removeBtn);
  todoList.appendChild(li);
}

// 할 일 추가 버튼
addBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;
  if (text === '') return;

  createTodoItem(text, priority);
  sortTodos();
  saveTodos();

  todoInput.value = '';
  todoInput.focus();
});

// Enter 키 입력 시 추가
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// 중요도 선택 색상 동기화 (선택 시)
function updateSelectColor() {
  const val = prioritySelect.value;
  prioritySelect.className = val;
}
prioritySelect.addEventListener('change', updateSelectColor);
updateSelectColor();

// 완료된 항목 일괄 삭제
deleteCompletedBtn.addEventListener('click', () => {
  const completedItems = todoList.querySelectorAll('.todo-item.completed');
  completedItems.forEach(item => item.remove());
  saveTodos();
});

// 정렬 함수 (완료 안 된 항목 우선, 그 안에서 중요도 순)
function sortTodos() {
  const items = [...todoList.querySelectorAll('.todo-item')];

  const getPriorityValue = (priority) => {
    if (priority === 'high') return 1;
    if (priority === 'medium') return 2;
    return 3;
  };

  items.sort((a, b) => {
    const aCompleted = a.classList.contains('completed');
    const bCompleted = b.classList.contains('completed');

    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1; // 완료된 건 아래로
    }

    const aPriority = getPriorityValue(getPriorityFromClass(a));
    const bPriority = getPriorityValue(getPriorityFromClass(b));
    return aPriority - bPriority;
  });

  items.forEach(item => todoList.appendChild(item));
}

// 클래스에서 priority 추출
function getPriorityFromClass(item) {
  if (item.classList.contains('low')) return 'low';
  if (item.classList.contains('high')) return 'high';
  return 'medium';
}

// 초기 로드
loadTodos();
