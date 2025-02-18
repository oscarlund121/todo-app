let toDoArr = JSON.parse(localStorage.getItem('toDoArr')) || [];

const toDoListQsl = document.querySelector(".to_do_list");
const completedListQsl = document.querySelector(".completed_list");
const taskInputQsl = document.querySelector("#task_input");
const taskButtonQsl = document.querySelector("#task_button");
const taskDeadlineQsl = document.querySelector("#task_deadline");
const taskCategoryQsl = document.querySelector("#task_category");

showToDoList();

taskButtonQsl.addEventListener("click", () => {
  const newTaskText = taskInputQsl.value;
  const newTaskDeadline = taskDeadlineQsl.value;
  const newTaskCategory = taskCategoryQsl.value;

  if (newTaskText !== "") {
    const newTask = {
      id: self.crypto.randomUUID(),
      text: newTaskText,
      done: false,
      deadline: newTaskDeadline,
      category: newTaskCategory
    };
    
    toDoArr.push(newTask);
    saveToLocalStorage();
    showToDoList();
    
    taskInputQsl.value = "";
    taskDeadlineQsl.value = "";
  }
});

function showToDoList() {
  saveToLocalStorage();

  toDoArr.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Sortér efter deadline

  toDoListQsl.innerHTML = "";
  completedListQsl.innerHTML = "";

  toDoArr.forEach((task) => {
    const li = document.createElement("li");
    
    const taskText = document.createElement("h3");
    taskText.textContent = task.text;
    li.appendChild(taskText);

    const categorySpan = document.createElement("span");
    categorySpan.textContent = `(${task.category})`;
    categorySpan.classList.add("category");
    li.appendChild(categorySpan);
    
    if (task.deadline) {
      const deadlineP = document.createElement("p");
      deadlineP.textContent = new Date(task.deadline).toLocaleDateString(); // Kun dato
      li.appendChild(deadlineP);
    }
    
    li.classList.add(task.done ? "colorDone" : "colorToDo", task.category.toLowerCase());

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("toggle");
    checkBox.checked = task.done;
    li.appendChild(checkBox);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete_button");
    li.appendChild(deleteButton);

    const undoButton = document.createElement("button");
    undoButton.textContent = "Undo";
    undoButton.classList.add("undo_button");
    if (task.done) {
      li.appendChild(undoButton);
      completedListQsl.appendChild(li);
    } else {
      toDoListQsl.appendChild(li);
    }

    checkBox.addEventListener("click", (event) => {
      task.done = event.target.checked;
      showToDoList();
    });

    deleteButton.addEventListener("click", () => {
      toDoArr = toDoArr.filter(tI => tI.id !== task.id);
      showToDoList();
    });

    if (task.done) {
      li.querySelector(".undo_button").addEventListener("click", () => {
        task.done = false;
        showToDoList();
      });
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem('toDoArr', JSON.stringify(toDoArr));
}
