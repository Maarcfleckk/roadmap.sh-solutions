document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.querySelector("#task-list");
  const emptyTask = document.querySelector("#empty-task");
  const deleteAll = document.getElementById("remove-all");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function loadTasks() {
    if (tasks.length > 0) {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        let newTask = emptyTask.cloneNode(true);

        newTask.dataset.task = index;
        newTask.id = "";
        if (task.checked) newTask.classList.add("checked");

        let newTaskText = newTask.querySelector(".title");
        newTaskText.textContent = task.text;

        let newTaskCheck = newTask.querySelector("input");
        newTaskCheck.checked = task.checked;
        newTaskCheck.addEventListener("change", () =>
          toggleTaskStatus(index, newTaskCheck.checked)
        );

        let newTaskRemove = newTask.querySelector("button");
        newTaskRemove.addEventListener("click", () => removeTask(index));
        taskList.append(newTask);
      });
      deleteAll.classList.remove("d-none");
      taskList.classList.remove("no-tasks");
    } else {
      taskList.classList.add("no-tasks");
      taskList.innerHTML =
        "Create a task in order to display it in this container";
      deleteAll.classList.add("d-none");
    }
  }

  function removeTask(taskIndex) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }

  function toggleTaskStatus(taskIndex, newStatus) {
    const modifiedTask = tasks[taskIndex];
    modifiedTask.checked = newStatus;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }

  function createTask(ev) {
    ev.preventDefault();
    const newTask = {
      text: ev.target[0].value,
      //   checked: ev.target[1].checked,
      checked: false,
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
    clearForm(ev.target);
  }

  function clearForm(form) {
    form.reset();
  }

  function deleteAllTasks() {
    alert("Seguro que quieres eliminar todas las notas?");
    if (tasks) {
      localStorage.removeItem("tasks");
      tasks = [];
    }
    loadTasks();
  }

  loadTasks();

  const form = document.querySelector("#task-create");
  form.addEventListener("submit", function (ev) {
    createTask(ev);
  });
  deleteAll.addEventListener("click", () => deleteAllTasks());
});
