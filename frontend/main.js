function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}

function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return false;
  }

  // Prepare payload for backend (ignore phone)
  const payload = { name, email, password };

  fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "User registered successfully!") {
        alert("🎉 User registered successfully!");
        window.location.href = "login.html";
      } else {
        alert("❌ " + (data.message || "Registration failed."));
      }
    })
    .catch(error => {
      alert("❌ Registration failed. Please try again.");
      console.error(error);
    });
  return false;
}

function forgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  
  if (!email) {
    alert("Please enter your email above before clicking 'Forgot Password'.");
    return false;
  }

  fetch("http://localhost:5000/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
    .then(response => response.json())
    .then(data => {
      if (data.resetToken) {
        navigator.clipboard.writeText(data.resetToken).then(() => {
          alert("Password reset token generated successfully!\nToken copied to clipboard.\nYou will be redirected to reset password.");
          window.location.href = `reset-password.html?token=${encodeURIComponent(data.resetToken)}`;
        });
      } else {
        alert(data.message || "If your email exists, you will receive password reset instructions.");
      }
    })
    .catch(error => {
      alert("❌ Failed to send password reset request.");
      console.error(error);
    });
  return false;
}

function resetPassword(event) {
  event.preventDefault();
  const token = document.getElementById("resetToken").value;
  const newPassword = document.getElementById("newPassword").value;

  fetch("http://localhost:5000/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
     body: JSON.stringify({ token, newPassword })
  })
    .then(response => response.json())
    .then(data => {
       alert(data.message);
     if (
        data.message === "Password has been reset successfully!" ||
        data.message === "Password reset successfully!"
      ) {
        window.location.href = "login.html";
      }
    })
    .catch(error => {
      alert("❌ Failed to reset password.");
      console.error(error);
    });
  return false;
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!localStorage.getItem("loggedIn") || !user) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("userName").textContent = user.name || "";
  document.getElementById("userEmail").textContent = user.email || "";
}
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const payload = { email, password };

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Login successful!") {
        alert("🎉 Login successful!");
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
        window.location.href = "dashboard.html";
      } else {
        alert("❌ " + (data.message || "User not found error"));
      }
    })
    .catch(error => {
      alert("❌ User not found error");
      console.error(error);
    });
  return false;
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
