document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const updateContainer = document.getElementById('update-container');
    const updateInput = document.getElementById('update-input');
    const updateButton = document.getElementById('update-button');
    const cancelButton = document.getElementById('cancel-button');

    let editingIndex = null;

    const getTodos = () => {
        const todos = localStorage.getItem('todos');
        return todos ? JSON.parse(todos) : [];
    };

    const saveTodos = (todos) => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        const todos = getTodos();
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${todo.text}</span>
                <button data-index="${index}" class="edit-button">Edit</button>
                <button data-index="${index}" class="delete-button">Delete</button>
            `;
            todoList.appendChild(li);
        });
    };

    const addTodo = (text) => {
        const todos = getTodos();
        todos.push({ text });
        saveTodos(todos);
        renderTodos();
    };

    const updateTodo = (index, newText) => {
        const todos = getTodos();
        todos[index].text = newText;
        saveTodos(todos);
        renderTodos();
    };

    const deleteTodo = (index) => {
        const todos = getTodos();
        todos.splice(index, 1);
        saveTodos(todos);
        renderTodos();
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (text) {
            if (editingIndex === null) {
                addTodo(text);
            }
            input.value = '';
        }
    });

    todoList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = event.target.dataset.index;
            deleteTodo(index);
        } else if (event.target.classList.contains('edit-button')) {
            editingIndex = event.target.dataset.index;
            const todos = getTodos();
            updateInput.value = todos[editingIndex].text;
            updateContainer.style.display = 'block';
        }
    });

    updateButton.addEventListener('click', () => {
        const newText = updateInput.value.trim();
        if (newText) {
            updateTodo(editingIndex, newText);
            editingIndex = null;
            updateContainer.style.display = 'none';
            updateInput.value = '';
        }
    });

    cancelButton.addEventListener('click', () => {
        editingIndex = null;
        updateContainer.style.display = 'none';
        updateInput.value = '';
    });

    renderTodos();
});
