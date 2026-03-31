// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Add new task
function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("categorySelect").value;
  const priority = document.getElementById("prioritySelect").value;
  const dueDate = document.getElementById("dueDate").value;
  const text = input.value.trim();
  if (!text) return;

  const task = { text, category, priority, dueDate, completed: false, subtasks: [] };
  tasks.push(task);
  input.value = "";
  saveTasks();
}

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

// Add subtask
function addSubtask(index, subtaskText) {
  if (!subtaskText) return;
  tasks[index].subtasks.push({ text: subtaskText, completed: false });
  saveTasks();
}

// Toggle subtask complete
function toggleSubtask(taskIndex, subIndex) {
  tasks[taskIndex].subtasks[subIndex].completed = !tasks[taskIndex].subtasks[subIndex].completed;
  saveTasks();
}

// Render all tasks
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.classList.add(task.priority.toLowerCase());

    let subtasksHTML = task.subtasks.map((sub, j) => `
      <div>
        <input type="checkbox" ${sub.completed ? "checked" : ""} onclick="toggleSubtask(${i}, ${j})">
        <span ${sub.completed ? 'style="text-decoration: line-through;"' : ''}>${sub.text}</span>
      </div>
    `).join("");

    li.innerHTML = `
      <div class="task-header">
        <span class="task-title">${task.text} [${task.category}] - ${task.dueDate || "No due date"}</span>
        <div>
          <button onclick="toggleComplete(${i})">✔</button>
          <button onclick="deleteTask(${i})">🗑</button>
        </div>
      </div>
      <div class="subtasks">${subtasksHTML}</div>
      <input type="text" placeholder="Add subtask" onkeydown="if(event.key==='Enter'){addSubtask(${i}, this.value); this.value='';}">
    `;

    taskList.appendChild(li);
  });
}

// Filter/Search
function filterTasks() {
  const filter = document.getElementById("searchInput").value.toLowerCase();
  const lis = document.querySelectorAll("#taskList li");
  lis.forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
}

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("change", e => {
  document.body.classList.toggle("dark-mode", e.target.checked);
});

renderTasks();