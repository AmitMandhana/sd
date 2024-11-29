const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

function findIndex(arr, id) {
  for (var i of arr) {
    if (i.id == id) return arr.indexOf(i);
  }
  return -1;
}

function deleteItemIndex(arr, id) {
  return arr.filter((item) => item.id !== id);
}

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://mern-todo-mayank.vercel.app", "https://trying-hcawamgkcje7e0em.canadacentral-01.azurewebsites.net"],
  })
);

let todo = [];
let counter = 1;

app.get('/todos', (req, res) => {
  res.status(200).send(todo);
});

app.get('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todo, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    res.json(todo[todoIndex]);
  }
});

app.post('/todos', (req, res) => {
  const newTodo = {
    id: counter++,
    title: req.body.title,
    description: req.body.description,
  };
  todo.push(newTodo);
  res.status(201).send(newTodo);
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todo = deleteItemIndex(todo, id);
  res.status(200).json(todo);
});

app.put('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todo, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send('Todo item not found.');
  } else {
    if (req.body.title) {
      todo[todoIndex].title = req.body.title;
    }
    if (req.body.description) {
      todo[todoIndex].description = req.body.description;
    }
    res.status(200).json(todo);
  }
});

// Static files


// Error Handling
app.use('*', (req, res) => {
  res.status(404).send('Route not defined');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;

app.use(express.static("./client/dist"));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client","dist","index.html"));
});
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

module.exports = app;
