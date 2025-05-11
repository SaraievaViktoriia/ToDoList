const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const messageDiv = document.getElementById("motivation-message");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const motivationalQuotes = [
  "Ти зможеш усе!",
  "Ще один крок до мети!",
  "Продовжуй рухатися вперед!",
  "Маленькі кроки – великі результати!",
  "Почни, і побачиш результат!"
];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `${task.completed ? "completed" : ""} priority-${task.priority}`;
    li.innerHTML = `
      <div onclick="toggleComplete(${index})">
        <span>${task.text}</span>
        <small>${task.date} — <strong>${getPriorityLabel(task.priority)}</strong></small>
      </div>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    taskList.appendChild(li);
  });
}

function getPriorityLabel(priority) {
  switch(priority) {
    case "important": return "Важливе";
    case "urgent": return "Дуже важливе";
    default: return "Звичайне";
  }
}

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

function showMotivation() {
  const quote = getRandomQuote();
  messageDiv.textContent = quote;
  messageDiv.classList.remove("hidden");

  setTimeout(() => {
    messageDiv.classList.add("hidden");
  }, 3000);
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (text) {
    const now = new Date();
    const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();

    tasks.push({ text, completed: false, date: dateStr, priority });

    showMotivation();
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

renderTasks();
