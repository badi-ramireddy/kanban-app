const API_URL = "http://127.0.0.1:5000/tasks";

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    document.querySelectorAll(".column").forEach(col => {
        col.querySelectorAll(".task").forEach(t => t.remove());
    });

    tasks.forEach(task => {
        createTaskElement(task);
    });
}

async function addTask() {
    const title = prompt("Enter task:");
    if (!title) return;

    await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, status: "todo"})
    });

    fetchTasks();
}

function createTaskElement(task) {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.innerText = task.title;
    div.dataset.id = task.id;

    div.addEventListener("dragstart", e => {
        e.dataTransfer.setData("id", task.id);
    });

    document.getElementById(task.status).appendChild(div);
}

document.querySelectorAll(".column").forEach(col => {
    col.addEventListener("dragover", e => e.preventDefault());

    col.addEventListener("drop", async e => {
        const id = e.dataTransfer.getData("id");
        const newStatus = col.id;

        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: newStatus})
        });

        fetchTasks();
    });
});

fetchTasks();