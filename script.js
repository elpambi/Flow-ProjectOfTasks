// --- Estructura de datos para tareas ---
let tasks = [];

// Manejar el formulario de nueva tarea
document.addEventListener('DOMContentLoaded', () => {
	// ...existing code...
	const taskForm = document.getElementById('task-form');

	taskForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const title = document.getElementById('task-title').value;
		const action = document.getElementById('task-action').value;
		const desc = document.getElementById('task-desc').value;
		const newTask = {
			id: Date.now(),
			title,
			action,
			desc
		};
		tasks.push(newTask);
		// Limpiar formulario
		taskForm.reset();
		// Volver a la vista principal
		addTaskView.style.display = 'none';
		mainView.style.display = 'block';
	renderTasks();
	// Renderizar lista de tareas
	function renderTasks() {
		const taskList = document.getElementById('task-list');
		taskList.innerHTML = '';
		if (tasks.length === 0) {
			taskList.innerHTML = '<p>No hay tareas aún.</p>';
			return;
		}
		tasks.forEach(task => {
			const card = document.createElement('div');
			card.className = 'task-card';
			card.innerHTML = `<strong>${task.title}</strong><br><span>${task.action}</span>`;
			card.addEventListener('click', () => showTaskDetail(task.id));
			taskList.appendChild(card);
		});
	}

	// Mostrar detalle de tarea
	function showTaskDetail(taskId) {
		const task = tasks.find(t => t.id === taskId);
		if (!task) return;
		document.getElementById('detail-title').textContent = task.title;
		document.getElementById('detail-desc').textContent = task.desc || '(Sin descripción)';
		mainView.style.display = 'none';
		taskDetailView.style.display = 'block';
		// Guardar id de tarea actual para eliminar
		taskDetailView.dataset.currentId = taskId;
	}

	// Eliminar tarea
	document.getElementById('delete-task-btn').addEventListener('click', () => {
		const id = Number(taskDetailView.dataset.currentId);
		tasks = tasks.filter(t => t.id !== id);
		taskDetailView.style.display = 'none';
		mainView.style.display = 'block';
		renderTasks();
	});

	// Render inicial
	renderTasks();
	});
});
// --- Lógica de navegación de vistas y eventos principales ---
document.addEventListener('DOMContentLoaded', () => {
	const mainView = document.getElementById('main-view');
	const addTaskView = document.getElementById('add-task-view');
	const taskDetailView = document.getElementById('task-detail-view');
	const addTaskBtn = document.getElementById('add-task-btn');
	const cancelAddTaskBtn = document.getElementById('cancel-add-task');
	const backToMainBtn = document.getElementById('back-to-main');
	const taskForm = document.getElementById('task-form');
	const deleteTaskBtn = document.getElementById('delete-task-btn');

	// Estructura de datos: tareas pendientes
	let tasks = [];
	let currentTaskId = null;

	// Mostrar formulario para añadir tarea
	addTaskBtn.addEventListener('click', () => {
		mainView.style.display = 'none';
		addTaskView.style.display = 'block';
	});

	// Cancelar añadir tarea
	cancelAddTaskBtn.addEventListener('click', () => {
		addTaskView.style.display = 'none';
		mainView.style.display = 'block';
	});

	// Volver de detalle a principal
	backToMainBtn.addEventListener('click', () => {
		taskDetailView.style.display = 'none';
		mainView.style.display = 'block';
	});

	// Añadir tarea
	taskForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const title = document.getElementById('task-title').value;
		const action = document.getElementById('task-action').value;
		const desc = document.getElementById('task-desc').value;
		// Por simplicidad, todas las tareas se agregan como pendientes del día actual
		const newTask = {
			id: Date.now(),
			title,
			action,
			desc,
			date: new Date().toLocaleDateString(),
			completed: false
		};
		tasks.push(newTask);
		taskForm.reset();
		addTaskView.style.display = 'none';
		mainView.style.display = 'block';
		renderTasks();
	});

	// Renderizar lista de tareas pendientes
	function renderTasks() {
		const taskList = document.getElementById('task-list');
		taskList.innerHTML = '';
		if (tasks.length === 0) {
			taskList.innerHTML = '<p>No hay tareas pendientes.</p>';
			return;
		}
		tasks.filter(t => !t.completed).forEach(task => {
			const card = document.createElement('div');
			card.className = 'task-card';
			card.innerHTML = `
				<div class="task-title">${task.title}</div>
				<div class="task-action">${task.action}</div>
				<button class="view-task-btn">Ver</button>
				<button class="delete-task-btn">Delete task</button>
			`;
			card.querySelector('.view-task-btn').addEventListener('click', (e) => {
				e.stopPropagation();
				showTaskDetail(task.id);
			});
			card.querySelector('.delete-task-btn').addEventListener('click', (e) => {
				e.stopPropagation();
				deleteTask(task.id);
			});
			taskList.appendChild(card);
		});
	}

	// Mostrar detalle de tarea
	function showTaskDetail(taskId) {
		const task = tasks.find(t => t.id === taskId);
		if (!task) return;
		currentTaskId = taskId;
		document.getElementById('detail-title').textContent = task.title;
		document.getElementById('detail-name').textContent = task.title;
		document.getElementById('detail-action').textContent = task.action;
		document.getElementById('detail-desc').textContent = task.desc || '(Sin descripción)';
		// Mostrar resto de tareas para ese día
		const tasksForDay = tasks.filter(t => t.date === task.date && t.id !== task.id && !t.completed);
		const tasksForDayList = document.getElementById('tasks-for-day');
		tasksForDayList.innerHTML = '';
		if (tasksForDay.length === 0) {
			tasksForDayList.innerHTML = '<li>No hay más tareas para este día.</li>';
		} else {
			tasksForDay.forEach(t => {
				const li = document.createElement('li');
				li.textContent = t.title;
				tasksForDayList.appendChild(li);
			});
		}
		mainView.style.display = 'none';
		addTaskView.style.display = 'none';
		taskDetailView.style.display = 'block';
	}

	// Eliminar tarea
	function deleteTask(taskId) {
		tasks = tasks.filter(t => t.id !== taskId);
		renderTasks();
		// Si estamos en el detalle, volver a la principal
		if (taskDetailView.style.display === 'block') {
			taskDetailView.style.display = 'none';
			mainView.style.display = 'block';
		}
	}

	deleteTaskBtn.addEventListener('click', () => {
		if (currentTaskId !== null) {
			deleteTask(currentTaskId);
		}
	});

	// Render inicial
	renderTasks();
});
