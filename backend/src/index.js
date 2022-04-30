const express = require('express');
const cors = require('cors');
const { v4: uuid, validate } = require('uuid');

const app = express();
app.use(cors()); //perimite que qualquer frontend vindo de qualquer url tenha acesso ao BD

app.use(express.json()); // faz o express ler arquivos JSON

const tasks = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  console.time(logLabel);
  //return next();
  next();
  console.timeEnd(logLabel);
}

function validadeId(request, response, next) {
  const { id } = request.params;

  if (!validate(id))
    return response.status(400).json({ error: 'Invalid taks ID.' });

  return next();
}

app.use(logRequest);
app.use('/tasks/:id', validadeId);

app.get('/tasks', (request, response) => {
  const { title } = request.query;

  const result = title
    ? tasks.filter((task) => task.title.includes(title))
    : tasks;

  return response.json(result);
});

app.post('/tasks', (request, response) => {
  const { title } = request.body;

  const task = { id: uuid(), title };

  tasks.push(task);

  return response.json(task);
});

app.put('/tasks/:id', (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const taskIndex = tasks.findIndex((taks) => taks.id === id);

  if (taskIndex < 0) {
    console.log(taskIndex);
    return response.status(400).json({ error: 'Task not found.' });
  }

  const taks = {
    id,
    title,
  };

  tasks[taskIndex] = taks;

  return response.json(taks);
});

app.delete('/tasks/:id', (request, response) => {
  const { id } = request.params;

  const taksIndex = tasks.findIndex((task) => task.id === id);

  if (taksIndex < 0) {
    return response.status(400).json({ error: 'Taks not found.' });
  }

  tasks.splice(taksIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('Back-end started!');
});
