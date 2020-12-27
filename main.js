document.addEventListener("DOMContentLoaded", () => {
  let todos = [];
  const addBtn = document.getElementById("add");
  const text = document.getElementById("text");
  const container = document.getElementById("container");
  const delBtn = document.getElementById("del");

  const todoCompleted = (newTodo) => {
    newTodo.querySelector("#content").style = "text-decoration: line-through";
    newTodo.id = "checked";
    return newTodo;
  };

  const todoMarkedIncomlplete = (newTodo) => {
    newTodo.querySelector("#content").style = "";
    newTodo.id = "";
    return newTodo;
  };

  const updateTodo = async (id, completed) => {
    try {
      const response = await fetch(
        `http://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            completed,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await response.json();
      // console.log(data)
    } catch (e) {
      console.log(
        Error(
          `this is not a real API so the id ${id} doesn't exist on the todo you created. ` +
            e
        )
      );
    }
  };

  const watchBox = (box, newTodo) =>
    box.addEventListener("click", () => {
      const index = todos.findIndex((todo) => todo.id == box.id);
      if (box.checked === true) {
        newTodo = todoCompleted(newTodo);
        todos[index].completed = true;
        console.log(
          "todos.id:" +
            todos[index].id +
            " boxid: " +
            box.id +
            " index: " +
            index
        );
      } else {
        newTodo = todoMarkedIncomlplete(newTodo);
        todos[index].completed = false;
      }
      updateTodo(todos[index].id, box.checked);
    });

  const renderTodos = (todo) => {
    let newTodo = document.createElement("li");
    const todoContent = document.createElement("span");
    const doneWrapWrap = document.createElement("span");
    const doneWrap = document.createElement("label");
    const done = document.createElement("input");
    newTodo.className = "mdl-list__item";
    todoContent.className = "mdl-list__item-primary-content";
    todoContent.id = "content";
    doneWrapWrap.className = "mdl-list__item-secondary-action";
    doneWrap.className = "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect";
    doneWrap.for = todo.id;
    done.type = "checkbox";
    done.id = todo.id;
    done.className = "mdl-checkbox__input";
    todoContent.innerText = todo.title;
    doneWrap.appendChild(done);
    doneWrapWrap.appendChild(doneWrap);
    newTodo.appendChild(todoContent);
    newTodo.appendChild(doneWrapWrap);
    if (todo.completed) {
      done.checked = true;
      newTodo = todoCompleted(newTodo);
    } else {
      newTodo = todoMarkedIncomlplete(newTodo);
    }
    componentHandler.upgradeElement(newTodo);
    componentHandler.upgradeElement(todoContent);
    componentHandler.upgradeElement(doneWrapWrap);
    componentHandler.upgradeElement(doneWrap);
    componentHandler.upgradeElement(done);
    container.appendChild(newTodo);
    watchBox(done, newTodo);
  };

  const getTodos = async () => {
    try {
      const response = await fetch(
        "http://jsonplaceholder.typicode.com/todos?_limit=5"
      );
      todos = await response.json();
      todos.forEach((todo) => renderTodos(todo));
    } catch (e) {
      console.log("The API may be down: " + e);
    }
  };

  getTodos();

  delBtn.addEventListener("click", () => {
    const checkedBoxes = document.querySelectorAll("#checked");
    checkedBoxes.forEach((checkedBox) => container.removeChild(checkedBox));
    todos.forEach((todo) => {
      if (todo.completed === true) {
        try {
          fetch(`http://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: "DELETE",
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  });

  const addTodo = (title, completed) => {
    fetch("http://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        userId: 11,
        title,
        completed,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        renderTodos(json);
        todos.push(json);
      });
    text.value = "";
  };

  addBtn.addEventListener("click", () => addTodo(text.value, false));
  text.addEventListener(
    "keydown",
    (event) => event.key === "Enter" && addTodo(text.value, false)
  );
});
