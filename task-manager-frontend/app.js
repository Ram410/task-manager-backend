const BASE_URL = "https://task-manager-backend-production-e42d.up.railway.app";

// Helper function to decode JWT token
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
}

// Helper function to get user role
function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded ? decoded.role : null;
}

// ================= LOGIN =================
function showSignup(e) {
  e.preventDefault();
  document.getElementById("authTitle").textContent = "Sign Up";
  document.getElementById("loginFields").style.display = "none";
  document.getElementById("signupFields").style.display = "block";
  document.getElementById("toggleText").innerHTML = 'Already have an account? <a href="#" onclick="showLogin(event)">Login</a>';
  document.getElementById("msg").textContent = "";
}

function showLogin(e) {
  e.preventDefault();
  document.getElementById("authTitle").textContent = "Login";
  document.getElementById("loginFields").style.display = "block";
  document.getElementById("signupFields").style.display = "none";
  document.getElementById("toggleText").innerHTML = 'Don\'t have an account? <a href="#" onclick="showSignup(event)">Sign up</a>';
  document.getElementById("msg").textContent = "";
}

async function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("msg").textContent = data.message || "Login failed";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("msg").textContent = "Error connecting to server";
  }
}

async function signup(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    document.getElementById("msg").textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("msg").textContent = "Account created successfully. Please log in.";
      showLogin(e);
    } else {
      document.getElementById("msg").textContent = data.message || "Sign up failed";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("msg").textContent = "Error connecting to server";
  }
}

// ================= CREATE PROJECT =================
async function createProject() {
  const name = document.getElementById("projectName").value;
  const token = localStorage.getItem("token");

  if (!name) {
    alert("Enter project name");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/projects/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    console.log("Created:", data);

    loadProjects();

  } catch (err) {
    console.error(err);
  }
}

// ================= LOAD PROJECTS =================
async function loadProjects() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/projects/all`, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const projectsJson = await res.json();
  const projects = Array.isArray(projectsJson)
    ? projectsJson
    : projectsJson.projects || projectsJson.data || [];

  const container = document.getElementById("projectList");
  container.innerHTML = "";

  for (let project of projects) {

    let tasks = [];

    // ✅ SAFE TASK FETCH
    try {
      const taskRes = await fetch(`${BASE_URL}/api/tasks/${project._id}`, {
        headers: { Authorization: "Bearer " + token }
      });

      if (!taskRes.ok) {
        const text = await taskRes.text();
        console.error("Task fetch failed:", taskRes.status, text);
        tasks = [];
      } else {
        tasks = await taskRes.json();
      }
    } catch (err) {
      console.log("Task fetch error:", err);
    }

    // ✅ Progress calculation
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed || t.isCompleted).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    const div = document.createElement("div");
    div.className = "project-card";

    const userRole = getUserRole();
    const isAdmin = userRole === "admin";
    const deleteButton = isAdmin ? `<button onclick="deleteProject('${project._id}')">Delete</button>` : "";

    div.innerHTML = `
      <h3>${project.name}</h3>
      ${deleteButton}
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
      <small>${completed}/${total} tasks completed</small>

      <div class="task-input-row">
        <input type="text" id="task-${project._id}" placeholder="New task">
        <input type="date" id="taskDue-${project._id}">
        <button onclick="addTask('${project._id}')">Add Task</button>
      </div>

      <div id="tasks-${project._id}"></div>
    `;

    container.appendChild(div);

    // ✅ render tasks
    const taskContainer = document.getElementById(`tasks-${project._id}`);

    tasks.forEach(task => {
      const isDone = task.completed || task.isCompleted;
      const t = document.createElement("div");
      t.className = "task";

      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      const overdue = dueDate && !isDone && dueDate < new Date();
      const dueLabel = dueDate ? `Due ${dueDate.toLocaleDateString()}` : "No due date";

      t.innerHTML = `
        <div class="task-info">
          <span class="${isDone ? "completed" : ""}">${task.title}</span>
          <small class="due-date ${overdue ? "overdue" : ""}">${dueLabel}${overdue ? " · Overdue" : ""}</small>
        </div>
        <button onclick="toggleTask('${task._id}', ${isDone})">
          ${isDone ? "Undo" : "Done"}
        </button>
      `;

      taskContainer.appendChild(t);
    });
  }
}

async function deleteProject(id) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Delete project failed:", res.status, text);
      return;
    }

    const data = await res.json();
    console.log("Deleted:", data);
    loadProjects();
  } catch (err) {
    console.error(err);
  }
}


function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ================= USER MANAGEMENT =================
async function loadUsers() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/users/all`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      console.error("Failed to load users");
      return;
    }

    const users = await res.json();
    const container = document.getElementById("userList");
    container.innerHTML = "";

    users.forEach(user => {
      const div = document.createElement("div");
      div.className = "user-card";

      div.innerHTML = `
        <div class="user-info">
          <strong>${user.name}</strong> (${user.email})
          <span class="role-badge role-${user.role}">${user.role}</span>
        </div>
        <select onchange="changeUserRole('${user._id}', this.value)">
          <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading users:", err);
  }
}

async function changeUserRole(userId, newRole) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/users/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ userId, role: newRole })
    });

    if (!res.ok) {
      alert("Failed to update user role");
      return;
    }

    const updatedUser = await res.json();
    console.log("Updated user:", updatedUser);
    loadUsers(); // Reload the user list
  } catch (err) {
    console.error("Error updating user role:", err);
  }
}

window.onload = function () {

  const token = localStorage.getItem("token");

  // Only run on dashboard page

  if (window.location.pathname.includes("dashboard")) {

    if (!token) {

      alert("Please login first");

      window.location.href = "index.html";

      return;

    }

    loadProjects();

    // Check if user is admin and show user management
    const userRole = getUserRole();
    if (userRole === "admin") {
      document.getElementById("userManagement").style.display = "block";
      loadUsers();
    }

  }

};

async function toggleTask(taskId, currentlyCompleted) {
  const token = localStorage.getItem("token");

  await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ completed: !currentlyCompleted })
  });

  loadProjects();
}

async function addTask(projectId) {
  const input = document.getElementById(`task-${projectId}`);
  const dueInput = document.getElementById(`taskDue-${projectId}`);
  const title = input.value;
  const dueDate = dueInput.value;

  if (!title) return alert("Enter task");

  const token = localStorage.getItem("token");

  await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title, projectId, dueDate: dueDate || null })
  });

  input.value = "";
  dueInput.value = "";
  loadProjects();
}
