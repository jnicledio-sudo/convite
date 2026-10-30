const loginView = document.querySelector("#login-view");
const dashboardView = document.querySelector("#dashboard-view");
const loginForm = document.querySelector("#login-form");
const loginFeedback = document.querySelector("#login-feedback");
const dashboardFeedback = document.querySelector("#dashboard-feedback");
const guestList = document.querySelector("#guest-list");
const guestCount = document.querySelector("#guest-count");
const lastUpdated = document.querySelector("#last-updated");
let adminToken = sessionStorage.getItem("armando_admin_token") || "";

function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
  loadGuests();
}

function showLogin() {
  dashboardView.hidden = true;
  loginView.hidden = false;
}

async function loadGuests() {
  dashboardFeedback.textContent = "";
  guestList.innerHTML = '<tr><td colspan="2" class="empty-row">A carregar confirmações...</td></tr>';
  try {
    const response = await fetch("/api/guests", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const result = await response.json();
    if (response.status === 401) {
      sessionStorage.removeItem("armando_admin_token");
      adminToken = "";
      showLogin();
      throw new Error("A sessão terminou. Volte a entrar.");
    }
    if (!response.ok) throw new Error(result.error || "Não foi possível carregar a lista.");

    guestCount.textContent = result.guests.length;
    lastUpdated.textContent = new Intl.DateTimeFormat("pt-PT", {
      hour: "2-digit", minute: "2-digit", timeZone: "Africa/Maputo"
    }).format(new Date());

    if (!result.guests.length) {
      guestList.innerHTML = '<tr><td colspan="2" class="empty-row">Ainda não existem confirmações.</td></tr>';
      return;
    }

    guestList.replaceChildren();
    result.guests.forEach((guest) => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const dateCell = document.createElement("td");
      nameCell.textContent = guest.name;
      dateCell.textContent = new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Africa/Maputo"
      }).format(new Date(guest.created_at));
      row.append(nameCell, dateCell);
      guestList.appendChild(row);
    });
  } catch (error) {
    dashboardFeedback.textContent = error.message;
    guestList.innerHTML = '<tr><td colspan="2" class="empty-row">Não foi possível apresentar os registos.</td></tr>';
  }
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginFeedback.textContent = "";
  loginFeedback.classList.remove("error");
  const button = loginForm.querySelector("button");
  button.disabled = true;
  button.textContent = "A validar...";
  try {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: document.querySelector("#admin-password").value })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Senha incorrecta.");
    adminToken = result.token;
    sessionStorage.setItem("armando_admin_token", adminToken);
    showDashboard();
  } catch (error) {
    loginFeedback.textContent = error.message;
    loginFeedback.classList.add("error");
  } finally {
    button.disabled = false;
    button.innerHTML = 'Entrar <span aria-hidden="true">→</span>';
  }
});

document.querySelector("#refresh-button")?.addEventListener("click", loadGuests);
document.querySelector("#logout-button")?.addEventListener("click", () => {
  sessionStorage.removeItem("armando_admin_token");
  adminToken = "";
  document.querySelector("#admin-password").value = "";
  showLogin();
});

if (adminToken) showDashboard();
