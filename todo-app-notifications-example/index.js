/*
1. För varje todo i arrayen så:
    1. Skapa upp en li - tagg
    2. Lägg in todo - texten i vår li-tagg
    3. Lägg till li-taggen i vår ul
*/
const todosElem = document.querySelector('#todos');
let todosFromStorage = JSON.parse(localStorage.getItem('myTodos'));
let notificationPermission = '';

function createTodoItem(todo) {
    const todoElem = document.createElement('li');
    todoElem.innerHTML = todo.task;
    todosElem.append(todoElem);

    todoElem.addEventListener('click', () => {
        todosFromStorage = JSON.parse(localStorage.getItem('myTodos'));
        /*
        1. Ta bort vald todo från arrayen (använd filter() eller en splice())
        2. Spara den nya arrayen till localStorage
       */ 
        console.log(todo);
        todoElem.remove();

        todosFromStorage = todosFromStorage.filter((todoItem) => {
            console.log(todoItem);
            if (todoItem.task !== todo.task) {
                return todoItem;
            }
        });

        saveToLocalStorage(todosFromStorage);

       /** En variant med splice istället */

       // Vi behöver först hitta indexet vår todo ligger på i arrayen
    //    const index = todosFromStorage.findIndex((todoItem) => todoItem.task === todo.task);
    //    todosFromStorage.splice(index, 1);
    //    saveToLocalStorage(todosFromStorage);

    });
}



function displayTodos(todos) {
    for(const todo of todos) {
        console.log(todo);
        createTodoItem(todo);
    }
}

function saveToLocalStorage(todos) {
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

async function getTodos() {
    const response = await fetch('https://awesome-todo-api.herokuapp.com/tasks');
    const data = await response.json();

    console.log(data);
    displayTodos(data.todos);
    saveToLocalStorage(data.todos);
}

function requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
        notificationPermission = permission;

        loadTodos();
    });
}

function createNotification(text) {
    console.log(notificationPermission);
    if (notificationPermission === 'granted') {
        const icon = 'icons/icon-192.png';

        const notification = new Notification('Awesome Todo App', { body: text, icon: icon });

        notification.addEventListener('click', () => {
            getTodos();
        });
    }
}

function loadTodos() {
    if (todosFromStorage && todosFromStorage.length > 0) {
        createNotification('Dina todos kommer från localstorage och kan vara gamla. Vill du göra en uppdatering?');
        displayTodos(todosFromStorage);
    } else {
        createNotification('Du har de senaste!');
        getTodos();
    }
}

window.addEventListener('load', async () => {
    if('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('service-worker.js');
        } catch(err) {
            console.error('Whooopsie!', err)
        }
    }
});

requestNotificationPermission();