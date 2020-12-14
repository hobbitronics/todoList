document.addEventListener('DOMContentLoaded', () => {
    let todos = []
    const add = document.getElementById("add")
    const text = document.getElementById("text")
    const container = document.getElementById("container")
    const del = document.getElementById("del")

    const scanBoxes = () => {
        let boxes = document.querySelectorAll("input.mdl-checkbox__input")
        boxes.forEach(el => el.addEventListener("click", () => {
            let ancestor = el.parentNode.parentNode.parentNode
            if (el.checked === true) {
                ancestor.querySelector("#content").style = "text-decoration: line-through"
                ancestor.id = "checked"
                todos[el.id-1].completed = true
            } else {
                ancestor.querySelector("#content").style = ""
                ancestor.id = ""
                todos[el.id-1].completed = false
            }
        }))
    }

    const renderApiTodos = todo => {
        const newTodo = document.createElement("li")
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
        componentHandler.upgradeElement(newTodo)
        componentHandler.upgradeElement(todoContent)
        componentHandler.upgradeElement(doneWrapWrap)
        componentHandler.upgradeElement(doneWrap)
        componentHandler.upgradeElement(done)
        if (todo.completed) {
            newTodo.id = "checked"
            newTodo.querySelector("#content").style = "text-decoration: line-through"
        } else {
            newTodo.id = ''
            newTodo.querySelector("#content").style = ""
        }
        container.appendChild(newTodo)
        scanBoxes()
    }

    const getTodos = async () => {
        response = await fetch('http://jsonplaceholder.typicode.com/todos?_limit=5')
        todos = await response.json()
        todos.forEach(todo => renderApiTodos(todo))
    }
    getTodos()
        
    del.addEventListener("click", () => {
        const checked = document.querySelectorAll("#checked")
        checked.forEach(el => container.removeChild(el))
        todos.forEach(todo => {
            if (todo.completed === false) {
                fetch(`http://jsonplaceholder.typicode.com/todos/${todo.id}`, {
                    method: 'DELETE',
                })
            }
        })
    })

    const addItem = (title, completed) => {
        fetch('http://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                userId : 1,
                title,
                completed,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            renderApiTodos(json)
            todos.push(json)
        })
        text.value = ''
    }
    
    add.addEventListener("click", () => addItem(text.value, false))
    text.addEventListener("keydown", event => event.key === 'Enter' && addItem(text, false))
})