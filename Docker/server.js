const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory

// Temporary in-memory database
let userTodos = {};

// API Endpoints
app.get("/todos", (req, res) => {
  const { name } = req.query;
  if (!name || !userTodos[name]) {
    return res.json([]);
  }
  res.json(userTodos[name]);
});

app.post("/todos", (req, res) => {
  const { name, title, date, time, completed } = req.body;
  if (!name) {
    return res.status(400).send("Name is required");
  }
  const newTodo = { id: Date.now().toString(), title, date, time, completed };
  if (!userTodos[name]) {
    userTodos[name] = [];
  }
  userTodos[name].push(newTodo);
  res.json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name || !userTodos[name]) {
    return res.status(404).send("User not found");
  }
  const index = userTodos[name].findIndex(todo => todo.id === id);
  if (index !== -1) {
    userTodos[name][index] = { ...userTodos[name][index], ...req.body };
    res.json(userTodos[name][index]);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.delete("/todos/:id", (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name || !userTodos[name]) {
    return res.status(404).send("User not found");
  }
  const index = userTodos[name].findIndex(todo => todo.id === id);
  if (index !== -1) {
    userTodos[name].splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send("Todo not found");
  }
});

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
