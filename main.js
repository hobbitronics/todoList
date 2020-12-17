document.addEventListener('DOMContentLoaded', () => {
    let todos = []
    const addBtn = document.getElementById("add")
    const text = document.getElementById("text")
    const container = document.getElementById("container")
    const delBtn = document.getElementById("del")

    const todoCompleted = todo => {
        todo.querySelector("#content").style = "text-decoration: line-through"
        todo.id = "checked"
        return todo
    }

    const todoMarkedIncomlplete = todo => {
        todo.querySelector("#content").style = ""
        todo.id = ""
        return todo
    }

    const updateTodo = async (id, completed) => {
        try {
            const response = await fetch(`http://jsonplaceholder.typicode.com/todos/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                const data = await response.json()
                // console.log(data)
        } catch (e) {
            console.log(Error(`this is not a real API so the id ${id} doesn't exist on the todo you created. ` + e))
        }
    }

    const watchBox = (box, ancestor) => box.addEventListener("click", () => {
        // let ancestor = box.parentNode.parentNode.parentNode
        const index = todos.findIndex(todo => todo.id == box.id)
        if (box.checked === true) {
            ancestor = todoCompleted(ancestor)
            todos[index].completed = true
            console.log("todos.id:" + todos[index].id + " boxid: " + box.id + " index: " + index)
        } else {
            ancestor = todoMarkedIncomlplete(ancestor)
            todos[index].completed = false
        }
        updateTodo(todos[index].id, box.checked)
    })

    const renderTodos = todo => {
        let newTodo = document.createElement("li")
        const todoContent = document.createElement('span')
        const doneWrapWrap = document.createElement('span')
        const doneWrap = document.createElement('label')
        const done = document.createElement('input')
        newTodo.className = "mdl-list__item"
        todoContent.className = "mdl-list__item-primary-content"
        todoContent.id = "content"
        doneWrapWrap.className = "mdl-list__item-secondary-action"
        doneWrap.className = "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect"
        doneWrap.for = todo.id
        done.type = 'checkbox'
        done.id = todo.id
        done.className = "mdl-checkbox__input"
        todoContent.innerText = todo.title
        doneWrap.appendChild(done)
        doneWrapWrap.appendChild(doneWrap)
        newTodo.appendChild(todoContent)
        newTodo.appendChild(doneWrapWrap)
        if (todo.completed) {
            done.checked = true
            newTodo = todoCompleted(newTodo)
        } else {
            newTodo = todoMarkedIncomlplete(newTodo)
        }
        componentHandler.upgradeElement(newTodo)
        componentHandler.upgradeElement(todoContent)
        componentHandler.upgradeElement(doneWrapWrap)
        componentHandler.upgradeElement(doneWrap)
        componentHandler.upgradeElement(done)
        container.appendChild(newTodo)
        watchBox(done, newTodo)
    }

    const getTodos = async () => {
        const response = await fetch('http://jsonplaceholder.typicode.com/todos?_limit=5')
        todos = await response.json()
        todos.forEach(todo => renderTodos(todo))
    }
    getTodos()
        
    delBtn.addEventListener("click", () => {
        const checked = document.querySelectorAll("#checked")
        checked.forEach(el => container.removeChild(el))
        todos.forEach(todo => {
            if (todo.completed === true) {
                fetch(`http://jsonplaceholder.typicode.com/todos/${todo.id}`, {
                    method: 'DELETE',
                })
            }
        })
    })

    const addTodo = (title, completed) => {
        fetch('http://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                userId : 11,
                title,
                completed,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            renderTodos(json)
            todos.push(json)
        })
        text.value = ''
    }
    
    addBtn.addEventListener("click", () => addTodo(text.value, false))
    text.addEventListener("keydown", event => event.key === 'Enter' && addTodo(text.value, false))
})