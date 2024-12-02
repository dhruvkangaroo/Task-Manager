document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskModal = document.getElementById("taskModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const searchBar = document.getElementById("searchBar");
  const priorityFilter = document.getElementById("priorityFilter");
  const sortOrder = document.getElementById("sortOrder");
  const themeToggle = document.getElementById("themeToggle");

  let tasks = [];
  let isDarkMode = false;

  // Open and close modal
  addTaskBtn.addEventListener("click", () => taskModal.style.display = "flex");
  closeModalBtn.addEventListener("click", () => taskModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === taskModal) taskModal.style.display = "none";
  });

  // Add task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const desc = document.getElementById("taskDesc").value.trim();
    const dueDate = new Date(document.getElementById("dueDate").value);
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;

    const newTask = {
      id: Date.now(),
      title,
      desc,
      dueDate,
      priority,
      status,
      isCompleted: false,
    };

    tasks.push(newTask);
    taskForm.reset();
    taskModal.style.display = "none";
    renderTasks();
  });

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks
      .filter(task => {
        const search = searchBar.value.toLowerCase();
        return task.title.toLowerCase().includes(search) || task.desc.toLowerCase().includes(search);
      })
      .filter(task => {
        if (priorityFilter.value === "All") return true;
        return task.priority === priorityFilter.value;
      });

    const sortedTasks = filteredTasks.sort((a, b) => {
      if (sortOrder.value === "dateAsc") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortOrder.value === "dateDesc") return new Date(b.dueDate) - new Date(a.dueDate);
      if (sortOrder.value === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

    sortedTasks.forEach(task => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");
      if (task.isCompleted) taskItem.classList.add("completed");

      taskItem.innerHTML = `
        <div>
          <h3>${task.title}</h3>
          <p>${task.desc}</p>
          <small>Due: ${task.dueDate.toLocaleString()}</small><br>
          <small>Priority: ${task.priority}</small>
          <br><small>Status: ${task.status}</small>
        </div>
        <div class="task-actions">
          <button class="complete-btn">${task.isCompleted ? "Undo" : "Complete"}</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // Task actions
      const completeBtn = taskItem.querySelector(".complete-btn");
      const deleteBtn = taskItem.querySelector(".delete-btn");

      completeBtn.addEventListener("click", () => toggleComplete(task.id));
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      taskList.appendChild(taskItem);

      // Check for overdue tasks
      if (new Date(task.dueDate) < new Date() && !task.isCompleted) {
        alert(`Task "${task.title}" is overdue!`);
      }
    });
  }

  // Toggle task completion
  function toggleComplete(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, isCompleted: !task.isCompleted } : task);
    renderTasks();
  }

  // Delete task
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }

  // Search functionality
  searchBar.addEventListener("input", renderTasks);

  // Filter by priority
  priorityFilter.addEventListener("change", renderTasks);

  // Sort tasks
  sortOrder.addEventListener("change", renderTasks);

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark", isDarkMode);
    themeToggle.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
});
