const apiUrl = "http://localhost:3000/todos"; // Update this URL if hosted elsewhere

let currentUserName = "";

function setUserName() {
  const userNameInput = document.getElementById("user-name");
  currentUserName = userNameInput.value.trim();
  if (!currentUserName) {
    alert("Please enter a valid name.");
    return;
  }

  // Hide the name input and show todo container
  document.getElementById("name-container").style.display = "none"; 
  document.getElementById("todo-container").style.display = "flex"; 

  // Always show the logout button when the user logs in
  document.getElementById("logout-btn").style.display = "block"; // Show logout button

  const usernameElement = document.getElementById("currentUsername");
  usernameElement.style.display = "block"; // Show the username
  usernameElement.textContent = `Welcome, ${currentUserName}`;

  fetchTodos(); // Fetch and display the user's to-dos
}

// This function automatically moves the cursor to the next input field
function moveFocus(currentField, nextFieldId) {
  const value = currentField.value;

  if (currentField.type === "date") {
    // If the date field has two digits or more (e.g., 12 for month), move to the next field
    if (value.length >= 2 && value.indexOf("-") === 2) {
      document.getElementById(nextFieldId).focus();
    }
  } else if (currentField.type === "time") {
    // If the time field has two digits for hour or minute, move to the next field
    if (value.length >= 2 && value.indexOf(":") === 2) {
      document.getElementById(nextFieldId).focus();
    }
  }
}

async function fetchTodos() {
  const res = await fetch(`${apiUrl}?name=${currentUserName}`);
  const todos = await res.json();
  const list = document.getElementById("todo-list");
  list.innerHTML = "";
  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
      <span class="${todo.completed ? 'completed' : ''}">${todo.title} (Due: ${todo.date} ${todo.time})</span>
      <button class="complete-btn" onclick="toggleComplete('${todo.id}', ${todo.completed})">${todo.completed ? 'Completed' : 'Complete'}</button>
      <button onclick="deleteTodo('${todo.id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById("todo-input");
  const date = document.getElementById("todo-date");
  const time = document.getElementById("todo-time");

  if (!input.value.trim() || !date.value || !time.value) return;

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: currentUserName, title: input.value, date: date.value, time: time.value, completed: false }),
  });

  input.value = "";
  date.value = "";
  time.value = "";
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: currentUserName }),
  });
  fetchTodos();
}

async function toggleComplete(id, currentStatus) {
  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: currentUserName, completed: !currentStatus }),
  });
  fetchTodos();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("todo-container").style.display = "none";
});

function logout() {
  currentUserName = "";
  
  // Show the name input container and hide todo container
  document.getElementById("name-container").style.display = "flex"; // Show name input again
  document.getElementById("todo-container").style.display = "none"; // Hide todo container
  
  // Hide the logout button and welcome message
  document.getElementById("logout-btn").style.display = "none"; // Hide logout button
  const usernameElement = document.getElementById("currentUsername");
  usernameElement.style.display = "none"; // Hide the username

  // Clear the todo list
  document.getElementById("todo-list").innerHTML = "";
}