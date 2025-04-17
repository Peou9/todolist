const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-all");

let todos = [];

function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
    todos.forEach((todo) => renderTodo(todo));
  }
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodo(todo) {
  const li = document.createElement("li");
  if (todo.done) li.classList.add("done");

  const span = document.createElement("span");
  span.textContent = todo.text;
  span.style.flex = "1";

  span.addEventListener("click", () => {
    todo.done = !todo.done;
    li.classList.toggle("done");
    saveTodos();
  });

  const buttonGroup = document.createElement("div");
  buttonGroup.style.display = "flex";
  buttonGroup.style.gap = "6px";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.classList.add("delete");
  deleteBtn.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== todo.id);
    list.removeChild(li);
    saveTodos();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "수정";
  editBtn.classList.add("edit");
  editBtn.style.marginLeft = "100px";

  editBtn.addEventListener("click", () => {
    if (editBtn.textContent === "수정") {
      const input = document.createElement("input");
      input.type = "text";
      input.value = todo.text;
      input.style.flex = "1";
      li.replaceChild(input, span);
      editBtn.textContent = "저장";
      input.focus();
    } else {
      // 저장
      const input = li.querySelector("input");
      const newText = input.value.trim();
      if (newText !== "") {
        todo.text = newText;
        span.textContent = newText;
        li.replaceChild(span, input);
        editBtn.textContent = "수정";
        saveTodos();
      }
    }
  });

  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.justifyContent = "space-between";

  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(buttonGroup);
  list.appendChild(li);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();

  if (text !== "") {
    const newTodo = {
      id: Date.now(),
      text,
      done: false,
    };
    todos.push(newTodo);
    renderTodo(newTodo);
    saveTodos();
    input.value = "";
    input.focus();
  }
});

clearBtn.addEventListener("click", () => {
  const confirmClear = confirm("모두 삭제하시겠습니까?");
  if (confirmClear) {
    todos = [];
    list.innerHTML = "";
    saveTodos();
  }
});

loadTodos();
