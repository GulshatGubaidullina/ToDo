const addTaskBtn = document.querySelector('.new-task-btn');
const newTaskInput = document.querySelector('.new-task-input');
const tasksList = document.querySelector('.list-group');
const emptyList = document.querySelector('.task-list-empty');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach(task => renderTask(task));
}

checkEmptyList();

//Добавление задачи
addTaskBtn.addEventListener('click', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

//Отмечаем задачу, как выполненную 
tasksList.addEventListener('click', doneTask);

function addTask() {
	const taskText = newTaskInput.value; //Достаем текст задачи 

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	tasks.push(newTask);
	renderTask(newTask);
	newTaskInput.value = '';
	newTaskInput.focus();

	checkEmptyList();
	saveToLocalStorage();
}


function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return;

	const parentNode = event.target.closest('.list-group-item');

	const id = Number(parentNode.id);
	const index = tasks.findIndex((task) => task.id === id);
	tasks.splice(index, 1);
	saveToLocalStorage();
	parentNode.remove();
	checkEmptyList();
}

function doneTask(event) {

	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');

	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;
	saveToLocalStorage();
	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title-done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<p class="task-list-empty">Список дел пуст</p>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	} else if (tasks.length > 0) {
		const emptyListEL = document.querySelector('.task-list-empty');
		emptyListEL ? emptyListEL.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
	//Формируем CSS класс 
	const cssClass = task.done ? 'task-title task-title-done' : 'task-title'
	// Формируем разметку для новой задачи
	const taskHTML = `
		<li id="${task.id}" class="list-group-item">
		<span class="${cssClass}">
			${task.text}
		</span>
		<div class="task-item-btns">
			<button class="task-done-btn" data-action="done">
				<img src="./img/done.svg" alt="Done">
			</button>
			<button class="task-delete-btn" data-action="delete">
				<img src="./img/delete.svg" alt="Delete">
			</button>
		</div>
	</li>`;
	//Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
