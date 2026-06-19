const newTaskBtn = document.querySelector(".new-task");
const addTaskBtn = document.querySelector(".add-task");
const form = document.querySelector(".form");
const taskTitleInput = document.getElementById("taskTitle");
const taskCategorySelect = document.getElementById("taskCategory");
const taskPrioritySelect = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const countTotal = document.getElementById("countTotal");
const countPending = document.getElementById("countPending");
const countDone = document.getElementById("countDone");
const toggleCheckbox = document.getElementById("toggle");

let tasks = [];

newTaskBtn.addEventListener("click", () => {
    form.style.display = "inline";
});

addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
    form.style.display = "none";
});

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const title = taskTitleInput.value.trim();

    if (title === "") {
        alert("Please enter a task title");
        return;
    }

    const newTask = {
        id: Date.now(), // simple way to get a unique id
        title: title,
        category: taskCategorySelect.value,
        priority: taskPrioritySelect.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskTitleInput.value = "";
}

function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });
    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
        }
    }
    saveTasks();
    renderTasks();
}

function updateCounts() {
    const total = tasks.length;
    let done = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            done++;
        }
    }

    const pending = total - done;

    countTotal.textContent = total;
    countPending.textContent = pending;
    countDone.textContent = done;
}

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    if (task.completed) {
        card.className = "task-card completed";
    }

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("button");
    checkbox.className = "task-checkbox";
    checkbox.textContent = task.completed ? "✓" : "";
    checkbox.addEventListener("click", () => {
        toggleComplete(task.id);
    });

    const textWrap = document.createElement("div");

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const tags = document.createElement("div");
    tags.className = "task-tags";

    const categoryTag = document.createElement("span");
    categoryTag.className = "tag";
    categoryTag.textContent = task.category;

    const priorityTag = document.createElement("span");
    priorityTag.className = "tag";
    if (task.priority === "high") {
        priorityTag.className = "tag high";
    }
    priorityTag.textContent = task.priority;

    tags.appendChild(categoryTag);
    tags.appendChild(priorityTag);

    textWrap.appendChild(title);
    textWrap.appendChild(tags);

    left.appendChild(checkbox);
    left.appendChild(textWrap);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "task-btn";
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
    });

    actions.appendChild(deleteBtn);

    card.appendChild(left);
    card.appendChild(actions);

    return card;
}

function renderTasks() {
    const oldCards = document.querySelectorAll(".task-card");
    oldCards.forEach(function (card) {
        card.remove();
    });

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";

        for (let i = 0; i < tasks.length; i++) {
            const card = createTaskCard(tasks[i]);
            taskList.appendChild(card);
        }
    }

    updateCounts();
}

toggleCheckbox.addEventListener("change", () => {
    if (toggleCheckbox.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
    }
});

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        toggleCheckbox.checked = true;
    }
}

loadTasks();
loadTheme();
renderTasks();