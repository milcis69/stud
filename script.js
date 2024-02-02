document.addEventListener('DOMContentLoaded', function () {
  loadTasks();
});

function addTaskToLocalStorage(title, description, isPriority) {
  const tasks = getTasksFromLocalStorage();
  tasks.unshift({ title: title || 'Brak tytułu', description: description || 'Brak opisu', checked: false, priority: isPriority });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(task) {
  const tasks = getTasksFromLocalStorage().filter(t => t.title !== task.title);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskStatusInLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.map(t => {
    if (t.title === task.title) {
      t.checked = !t.checked;
    }
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function getTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
}

function loadTasks() {
  const taskList = document.getElementById('myUL');
  taskList.innerHTML = '';

  const tasks = getTasksFromLocalStorage();

  if (tasks.length === 0) {
    taskList.innerHTML = '<p style="color:grey;">Nie masz żadnych zadań.</p>';
  } else {
    // Podziel zadania na priorytetowe i pozostałe
    const priorityTasks = tasks.filter(task => task.priority);
    const nonPriorityTasks = tasks.filter(task => !task.priority);

    // Wyświetl najpierw zadania priorytetowe, a następnie pozostałe
    priorityTasks.forEach(function (task) {
      createTaskElement(task);
    });

    nonPriorityTasks.forEach(function (task) {
      createTaskElement(task);
    });
  }
}

function createTaskElement(task) {
  const taskList = document.getElementById('myUL');

  const li = document.createElement('li');
  li.innerHTML = `<span style="font-weight: bold;">${task.title || 'Brak tytułu'}</span><p style="font-size: 14px; color: #555;">${task.description || 'Brak opisu'}</p>`;
  if (task.checked) {
    li.classList.add('checked');
  }

  li.style.backgroundColor = getPriorityColor(task.priority);

  li.addEventListener('click', function () {
    toggleTaskStatusInLocalStorage(task);
    li.classList.add('removing');

    setTimeout(() => {
      taskList.removeChild(li);
      updateLocalStorage();
      loadTasks();
    }, 300);
  });

  // Sortuj priorytetowe zadania na górze
  if (task.priority) {
    const firstNonPriority = taskList.querySelector('li:not(.checked):not([style*="background-color: #ffcccb"]');
    if (firstNonPriority) {
      taskList.insertBefore(li, firstNonPriority);
    } else {
      taskList.appendChild(li);
    }
  } else {
    taskList.appendChild(li);
  }
}

function newElement() {
  const titleValue = document.getElementById('titleInput').value;
  const descriptionValue = document.getElementById('myInput').value;
  const priorityInput = document.getElementById('priorityInput').checked;

  // Sprawdź, czy wprowadzono tytuł lub opis
  if (!titleValue && !descriptionValue) {
    alert('Musisz wprowadzić tytuł lub opis!');
    return;
  }

  addTaskToLocalStorage(titleValue, descriptionValue, priorityInput);
  loadTasks();
  document.getElementById('titleInput').value = '';
  document.getElementById('myInput').value = '';
  document.getElementById('priorityInput').checked = false;
}

function updateLocalStorage() {
  const taskList = document.getElementById('myUL');
  const tasks = [];

  for (let i = 0; i < taskList.children.length; i++) {
    const title = taskList.children[i].querySelector('span').innerText;
    const description = taskList.children[i].querySelector('p').innerText;
    const checked = taskList.children[i].classList.contains('checked');
    const priority = getTasksFromLocalStorage().find(t => t.title === title)?.priority || false;

    tasks.push({ title, description, checked, priority });
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getPriorityColor(isPriority) {
  return isPriority ? '#ffcccb' : ''; // Light Red for priority tasks
}
