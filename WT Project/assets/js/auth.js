const ADMIN_USERS_KEY = "niet_admin_users_v1";
const ADMIN_SESSION_KEY = "niet_admin_session_v1";

function getAdminUsers(){
  try {
    const saved = localStorage.getItem(ADMIN_USERS_KEY);
    const users = saved ? JSON.parse(saved) : [];
    return Array.isArray(users) ? users : [];
  } catch (error) {
    return [];
  }
}

function saveAdminUsers(users) {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
}

function getCurrentAdmin() {
  try {
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function setCurrentAdmin(admin) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
}

function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = "login.html";
}

function guardRoute(){
  const page = document.body.getAttribute("data-page");
  const admin = getCurrentAdmin();
  const publicPages = ["login", "register"];

  if (!publicPages.includes(page) && !admin) {
    window.location.href = "login.html";
    return;
  }
  if (publicPages.includes(page) && admin) {
    window.location.href = "index.html";
  }
}


function setupAuthForms() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("adminName").value.trim();
      const number = document.getElementById("adminNumber").value.trim();
      const password = document.getElementById("adminPassword").value;
      const confirm = document.getElementById("adminConfirmPassword").value;

      if (!/^\d{10}$/.test(number)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (password.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
      }
      if (password !== confirm) {
        alert("Password and confirm password must match.");
        return;
      }

      const users = getAdminUsers();
      if (users.some((user) => user.number === number)) {
        alert("Admin already registered with this number.");
        return;
      }

      users.push({
        id: Date.now(),
        name,
        number,
        password
      });
      saveAdminUsers(users);
      alert("Registration successful. Please login.");
      window.location.href = "login.html";
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const number = document.getElementById("loginNumber").value.trim();
      const password = document.getElementById("loginPassword").value;
      const user = getAdminUsers().find((admin) => admin.number === number && admin.password === password);

      if (!user) {
        alert("Invalid mobile number or password.");
        return;
      }
      setCurrentAdmin({ id: user.id, name: user.name, number: user.number });
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  guardRoute();
  setupAuthForms();
});
