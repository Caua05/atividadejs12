// script.js

// Array para armazenar as tarefas
let tasks = [];

// Função para atualizar a exibição da lista de tarefas
function renderTasks(filter = 'all') {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpar a lista atual

    // Filtrar tarefas
    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    // Ordenar tarefas: por data de conclusão ou prioridade
    filteredTasks.sort((a, b) => {
        if (a.priority !== b.priority) {
            const priorities = { alta: 1, media: 2, baixa: 3 };
            return priorities[a.priority] - priorities[b.priority];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    // Exibir as tarefas na lista
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        
        // Adicionar classe para tarefa urgente
        if (new Date(task.dueDate) <= new Date()) {
            li.classList.add('urgent');
        }

        // Marcar tarefa como concluída
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTaskCompletion('${task.id}')">
            <span>${task.name} - ${task.dueDate} (Prioridade: ${task.priority})</span>
            <button onclick="editTask('${task.id}')">Editar</button>
        `;
        taskList.appendChild(li);
    });
}

// Função para adicionar uma nova tarefa
document.getElementById('form-task').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('task-name').value;
    const dueDate = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    const newTask = {
        id: new Date().toISOString(),
        name,
        dueDate,
        priority,
        completed: false
    };

    tasks.push(newTask);
    renderTasks(); // Atualizar a lista de tarefas
    this.reset(); // Limpar o formulário
});

// Função para alternar o status de conclusão de uma tarefa
function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    renderTasks(); // Atualizar a lista após a alteração
}

// Função para editar uma tarefa
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const name = prompt('Editar nome da tarefa', task.name);
    const dueDate = prompt('Editar data de conclusão', task.dueDate);
    const priority = prompt('Editar prioridade (alta, media, baixa)', task.priority);

    if (name && dueDate && priority) {
        task.name = name;
        task.dueDate = dueDate;
        task.priority = priority;
    }

    renderTasks(); // Atualizar a lista após a edição
}

// Função para aplicar o filtro
document.getElementById('filter-all').addEventListener('click', function() {
    renderTasks('all');
});

document.getElementById('filter-concluded').addEventListener('click', function() {
    renderTasks('completed');
});

document.getElementById('filter-pending').addEventListener('click', function() {
    renderTasks('pending');
});

// Inicializa a lista de tarefas
renderTasks();
