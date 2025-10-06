function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}

function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return false;
  }

  const user = { name, email, phone, password };
  localStorage.setItem("user", JSON.stringify(user));
  alert("🎉 Registration successful!");
  window.location.href = "login.html";
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("❌ Invalid credentials!");
  }
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userPhone").textContent = user.phone;
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}
// === THEME TOGGLE ===
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.querySelector(".theme-toggle").textContent = isDark ? "☀️" : "🌙";
}

// Load theme preference on startup
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) toggle.textContent = "☀️";
  }
});
