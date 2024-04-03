const express = require('express');
const bodyParser = require('body-parser');
const User = require('./classes/user');
const Task = require('./classes/task');

const app = express();
const PORT = 3000;

app.use(express.json());

let users = [];
let tasks = [];

// Rota para adicionar um novo usuário
app.post('/users', (req, res) => {
    const { name } = req.body;
    const newUser = new User(users.length + 1, name);
    users.push(newUser);
    res.json(newUser);
});

// Rota para adicionar uma nova tarefa para um usuário específico
app.post('/users/:userId/tasks', (req, res) => {
    const { userId } = req.params;
    const { description } = req.body;
    const user = users.find(user => user.id === parseInt(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const newTask = new Task(tasks.length + 1, description, user.id);
    tasks.push(newTask);
    user.tasks.push(newTask);
    res.json(newTask);
});

// Rota para listar todas as tarefas de um usuário
app.get('/users/:userId/tasks', (req, res) => {
    const { userId } = req.params;
    const user = users.find(user => user.id === parseInt(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user.tasks);
});

// Rota para marcar uma tarefa como concluída
app.put('/users/:userId/tasks/:taskId', (req, res) => {
    const { userId, taskId } = req.params;
    const user = users.find(user => user.id === parseInt(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const task = user.tasks.find(task => task.id === parseInt(taskId));
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    task.completed = true;
    res.json(task);
});

// Rota para excluir uma tarefa de um usuário
app.delete('/users/:userId/tasks/:taskId', (req, res) => {
    const { userId, taskId } = req.params;
    const user = users.find(user => user.id === parseInt(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const taskIndex = user.tasks.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex === -1) return res.status(404).json({ error: 'Tarefa não encontrada' });
    user.tasks.splice(taskIndex, 1);
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    res.json({ message: 'Tarefa excluída com sucesso' });
});

// Rota para fazer o Get de todos Usuarios
app.get('/users', (req, res) => {
    res.json(users);
});

// Rota para fazer o Get de um usuario por Id
app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = users.find(user => user.id === parseInt(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
