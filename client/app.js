class Ministranten {
  constructor() {
    this.token = localStorage.getItem("token");
    this.user = JSON.parse(localStorage.getItem("user") || "null");
    this.init();
  }

  init() {
    if (!this.token) {
      this.showLogin();
    } else {
      this.checkPasswordChange();
    }
  }

  showLogin() {
    document.getElementById("login").classList.add("active");
    document.getElementById("change-password").classList.remove("active");
    document.getElementById("app").classList.remove("active");

    document.getElementById("login-form").addEventListener("submit", (e) => this.handleLogin(e));
  }

  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        document.getElementById("login-error").textContent = data.error;
        return;
      }

      const data = await response.json();
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));

      this.checkPasswordChange();
    } catch (err) {
      document.getElementById("login-error").textContent = "Verbindungsfehler";
      console.error(err);
    }
  }

  checkPasswordChange() {
    if (this.user.force_password_change) {
      this.showPasswordChange();
    } else {
      this.showApp();
    }
  }

  showPasswordChange() {
    document.getElementById("login").classList.remove("active");
    document.getElementById("change-password").classList.add("active");
    document.getElementById("app").classList.remove("active");

    document.getElementById("change-password-form").addEventListener("submit", (e) =>
      this.handlePasswordChange(e)
    );
  }

  async handlePasswordChange(e) {
    e.preventDefault();
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      document.getElementById("pwd-error2").textContent = "Passwörter stimmen nicht überein";
      return;
    }

    if (newPassword.length < 8) {
      document.getElementById("pwd-error2").textContent = "Mindestens 8 Zeichen";
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        document.getElementById("pwd-error").textContent = data.error;
        return;
      }

      this.user.force_password_change = false;
      localStorage.setItem("user", JSON.stringify(this.user));
      this.showApp();
    } catch (err) {
      document.getElementById("pwd-error").textContent = "Fehler beim Ändern";
      console.error(err);
    }
  }

  showApp() {
    document.getElementById("login").classList.remove("active");
    document.getElementById("change-password").classList.remove("active");
    document.getElementById("app").classList.add("active");

    // Hier laden Sie Ihre eigentliche App
    document.getElementById("app").innerHTML = `
      <div style="padding: 20px;">
        <h1>✝ Ministranten-Verwaltung</h1>
        <p>Willkommen, ${this.user.username}!</p>
        <button onclick="app.logout()">Abmelden</button>
      </div>
    `;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  }
}

const app = new Ministranten();
