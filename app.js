const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span onclick="toggleComplete(${index})">${todo.text}</span>
      <button onclick="deleteTodo(${index})">삭제</button>
    `;
    list.appendChild(li);
  });
}

function addTodo(text) {
  todos.push({ text, completed: false });
  saveAndRender();
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRender();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
  }
});

renderTodos();

