/* ==========================================
   BANKING DASHBOARD DEMO
========================================== */

const users = [
  { username: "demo", password: "demo1234" }
];

const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 30000;

let attempts = Number(localStorage.getItem("loginAttempts")) || 0;
let lockUntil = Number(localStorage.getItem("lockUntil")) || 0;

let countdownInterval;
let toastTimeout;

let checkingChart = null;
let savingsChart = null;
let currentFilter = "All";

/* ==========================================
   HELPERS
========================================== */

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getStoredData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

/* ==========================================
   TOAST
========================================== */

function showMessage(message = "Service not available") {
  const toast = document.getElementById("toast");

  if (!toast) return;

  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.style.display = "block";

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.style.display = "none";
    }, 300);

  }, 2500);
}

/* ==========================================
   GREETING
========================================== */

function setGreeting() {
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  const element = document.getElementById("greeting");

  if (element) element.textContent = greeting;
}

/* ==========================================
   MOBILE MENU
========================================== */

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  menu.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeMenu() {
  document.getElementById("mobileMenu")?.classList.remove("active");
  document.getElementById("overlay")?.classList.remove("active");
}

/* ==========================================
   ACTION HANDLER
========================================== */

function handleAction() {
  const action = document.getElementById("actionSelect").value;

  if (!action) {
    showMessage("Please select an action");
    return;
  }

  showMessage("This feature is currently unavailable");
}

/* ==========================================
   CHART DATA
========================================== */

// Illustrative checking history

const checkingHistory = [
  { day: "Mon", balance: 6100000 },
  { day: "Tue", balance: 6180000 },
  { day: "Wed", balance: 6150000 },
  { day: "Thu", balance: 6250000 },
  { day: "Fri", balance: 6200000 },
  { day: "Sat", balance: 6280000 },
  { day: "Sun", balance: 6300817.13 }
];

// Illustrative savings history

const savingsHistory = [
  9050, 9080, 9020, 9150, 9200,
  9180, 9250, 9300, 9280, 9350,
  9400, 9380, 9450, 9500, 9480,
  9550, 9600, 9580, 9650, 9700,
  9680, 9750, 9800, 9780, 9850,
  9900, 9950, 10000, 10200, 10817.27
];

/* ==========================================
   CHECKING CHART
========================================== */

function createCheckingChart() {
  const canvas = document.getElementById("lineChart");

  if (!canvas || typeof Chart === "undefined") return;

  if (checkingChart) checkingChart.destroy();

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 250);

  gradient.addColorStop(0, "rgba(166,25,46,0.25)");
  gradient.addColorStop(1, "rgba(166,25,46,0.01)");

  checkingChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: checkingHistory.map(item => item.day),

      datasets: [{
        label: "Illustrative checking balance",
        data: checkingHistory.map(item => item.balance),

        borderColor: "#a6192e",
        backgroundColor: gradient,

        fill: true,
        borderWidth: 3,
        tension: 0.4,

        pointRadius: 3,
        pointHoverRadius: 7,

        pointBackgroundColor: "#fff",
        pointBorderColor: "#a6192e",
        pointBorderWidth: 2
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.1,

      interaction: {
        intersect: false,
        mode: "index"
      },

      animation: {
        duration: 1200,
        easing: "easeOutQuart"
      },

      plugins: {
        legend: { display: false },

        tooltip: {
          backgroundColor: "#252d38",
          padding: 12,
          displayColors: false,

          callbacks: {
            label(context) {
              return formatMoney(context.raw);
            }
          }
        }
      },

      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: "#89919c" }
        },

        y: {
          border: { display: false },

          grid: {
            color: "rgba(0,0,0,0.06)"
          },

          ticks: {
            color: "#89919c",

            callback(value) {
              return "$" + (value / 1000000).toFixed(1) + "M";
            }
          }
        }
      }
    }
  });
}

/* ==========================================
   SAVINGS CHART
========================================== */

function createSavingsChart() {
  const canvas = document.getElementById("savingsChart");

  if (!canvas || typeof Chart === "undefined") return;

  if (savingsChart) savingsChart.destroy();

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 100);

  gradient.addColorStop(0, "rgba(121,189,69,0.25)");
  gradient.addColorStop(1, "rgba(121,189,69,0.01)");

  savingsChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: savingsHistory.map((_, index) => `Day ${index + 1}`),

      datasets: [{
        label: "Illustrative savings balance",
        data: savingsHistory,

        borderColor: "#79bd45",
        backgroundColor: gradient,

        fill: true,
        borderWidth: 2.5,
        tension: 0.45,

        pointRadius: 0,
        pointHoverRadius: 5
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: "index"
      },

      animation: {
        duration: 1500,
        easing: "easeOutQuart"
      },

      plugins: {
        legend: { display: false },

        tooltip: {
          enabled: true,
          backgroundColor: "#252d38",
          displayColors: false,

          callbacks: {
            label(context) {
              return formatMoney(context.raw);
            }
          }
        }
      },

      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

/* ==========================================
   40 ILLUSTRATIVE TRANSACTIONS
========================================== */

const transactionData = [
  ["Deposit", "Sample account deposit", 4500, "2026-10-31T09:15:00"],
  ["Withdrawal", "Sample ATM withdrawal", -300, "2026-10-30T14:25:00"],
  ["Transfer", "Sample outgoing transfer", -750, "2026-10-30T11:40:00"],
  ["Deposit", "Sample account credit", 1200, "2026-10-29T16:20:00"],
  ["Withdrawal", "Sample grocery purchase", -85.50, "2026-10-29T12:10:00"],
  ["Transfer", "Sample internal transfer", -500, "2026-10-28T10:30:00"],
  ["Deposit", "Sample refund", 250, "2026-10-28T09:15:00"],
  ["Withdrawal", "Sample online purchase", -129.99, "2026-10-27T18:40:00"],
  ["Deposit", "Sample account credit", 850, "2026-10-27T11:20:00"],
  ["Transfer", "Sample outgoing transfer", -1200, "2026-10-26T15:30:00"],

  ["Withdrawal", "Sample utility payment", -145, "2026-10-26T10:15:00"],
  ["Deposit", "Sample deposit", 2000, "2026-10-25T13:45:00"],
  ["Transfer", "Sample internal transfer", -350, "2026-10-25T09:20:00"],
  ["Withdrawal", "Sample restaurant payment", -65, "2026-10-24T19:30:00"],
  ["Deposit", "Sample refund", 175, "2026-10-24T11:10:00"],
  ["Withdrawal", "Sample subscription payment", -19.99, "2026-10-23T08:30:00"],
  ["Transfer", "Sample outgoing transfer", -900, "2026-10-23T07:45:00"],
  ["Deposit", "Sample account credit", 3200, "2026-10-22T14:20:00"],
  ["Withdrawal", "Sample fuel purchase", -75, "2026-10-22T12:15:00"],
  ["Transfer", "Sample internal transfer", -450, "2026-10-21T16:40:00"],

  ["Deposit", "Sample salary deposit", 5000, "2026-10-21T09:00:00"],
  ["Withdrawal", "Sample online purchase", -210, "2026-10-20T18:25:00"],
  ["Transfer", "Sample outgoing transfer", -600, "2026-10-20T14:10:00"],
  ["Deposit", "Sample refund", 120, "2026-10-19T11:35:00"],
  ["Withdrawal", "Sample shopping payment", -340, "2026-10-19T10:20:00"],
  ["Deposit", "Sample account credit", 750, "2026-10-18T15:40:00"],
  ["Transfer", "Sample internal transfer", -250, "2026-10-18T09:30:00"],
  ["Withdrawal", "Sample restaurant payment", -95, "2026-10-17T20:15:00"],
  ["Deposit", "Sample deposit", 1500, "2026-10-17T12:00:00"],
  ["Withdrawal", "Sample ATM withdrawal", -200, "2026-10-16T16:30:00"],

  ["Transfer", "Sample outgoing transfer", -1100, "2026-10-16T10:45:00"],
  ["Deposit", "Sample account credit", 950, "2026-10-15T13:20:00"],
  ["Withdrawal", "Sample utility payment", -180, "2026-10-15T09:10:00"],
  ["Transfer", "Sample internal transfer", -400, "2026-10-14T17:30:00"],
  ["Deposit", "Sample refund", 320, "2026-10-14T11:15:00"],
  ["Withdrawal", "Sample online purchase", -89.99, "2026-10-13T15:50:00"],
  ["Deposit", "Sample deposit", 2700, "2026-10-13T10:25:00"],
  ["Transfer", "Sample outgoing transfer", -650, "2026-10-12T14:40:00"],
  ["Withdrawal", "Sample grocery purchase", -135, "2026-10-12T09:30:00"],
  ["Deposit", "Sample account credit", 1800, "2026-10-11T12:20:00"],
  ["Withdrawal", "Sample card purchase", -55, "2026-10-10T16:30:00"]
];

const initialTransactions = transactionData.map((item, index) => ({
  id: `DEMO-${10001 + index}`,
  type: item[0],
  description: item[1],
  amount: item[2],
  date: item[3],
  status: "Demo"
}));

let transactions = getStoredData(
  "demoTransactions",
  initialTransactions
);

/* ==========================================
   CREATE TRANSACTION PAGE
========================================== */

function createTransactionSection() {
  const main = document.querySelector(".main");

  if (!main || document.getElementById("transactionHistory")) return;

  const section = document.createElement("section");

  section.id = "transactionHistory";
  section.style.display = "none";

  section.innerHTML = `
    <div class="transaction-page">

      <div class="transaction-header">

        <button
          class="transaction-back"
          onclick="showDashboardView()"
          aria-label="Back to accounts"
        >
          ←
        </button>

        <h2>Transactions</h2>

      </div>

      <div class="transaction-container">

        <div class="transaction-controls">

          <div class="transaction-heading">
            <h3>Transaction History</h3>
            <p>Illustrative account activity</p>
          </div>

          <input
            type="search"
            id="transactionSearch"
            class="transaction-search"
            placeholder="Search transactions..."
            autocomplete="off"
          >

          <div class="transaction-filters">

            <button
              class="filter-btn active"
              data-filter="All"
              onclick="filterTransactions('All', this)"
            >All</button>

            <button
              class="filter-btn"
              data-filter="Deposit"
              onclick="filterTransactions('Deposit', this)"
            >Deposits</button>

            <button
              class="filter-btn"
              data-filter="Withdrawal"
              onclick="filterTransactions('Withdrawal', this)"
            >Withdrawals</button>

            <button
              class="filter-btn"
              data-filter="Transfer"
              onclick="filterTransactions('Transfer', this)"
            >Transfers</button>

          </div>

        </div>

        <div
          id="transactionList"
          class="transaction-list-scroll"
        ></div>

      </div>
    </div>
  `;

  const footer = main.querySelector(".wf-footer");

  main.insertBefore(section, footer);

  document
    .getElementById("transactionSearch")
    .addEventListener("input", renderTransactions);

  renderTransactions();
}

/* ==========================================
   FILTER TRANSACTIONS
========================================== */

function filterTransactions(type, button) {
  currentFilter = type;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  renderTransactions();
}

/* ==========================================
   RENDER TRANSACTIONS
========================================== */

function renderTransactions() {
  const list = document.getElementById("transactionList");

  if (!list) return;

  const search = (
    document.getElementById("transactionSearch")?.value || ""
  ).toLowerCase();

  let filtered = [...transactions];

  if (currentFilter !== "All") {
    filtered = filtered.filter(item => item.type === currentFilter);
  }

  filtered = filtered.filter(item => (
    item.description.toLowerCase().includes(search) ||
    item.type.toLowerCase().includes(search) ||
    item.id.toLowerCase().includes(search)
  ));

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-transactions">
        No matching demo transactions found.
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(item => {
    const positive = item.amount > 0;

    const icon = positive ? "↓" : "↑";

    return `
      <div class="transaction-item">

        <div class="transaction-icon ${
          positive ? "deposit-icon" : "withdrawal-icon"
        }">
          ${icon}
        </div>

        <div class="transaction-info">

          <h4>${escapeHTML(item.description)}</h4>

          <p>${new Date(item.date).toLocaleString()}</p>

          <small>${escapeHTML(item.id)}</small>

        </div>

        <div class="transaction-amount">

          <strong class="${positive ? "green" : "red"}">
            ${positive ? "+" : "-"}
            ${formatMoney(Math.abs(item.amount))}
          </strong>

          <small>Demo</small>

        </div>

      </div>
    `;
  }).join("");
}

/* ==========================================
   ADD DEMO TRANSACTION
========================================== */

function addDemoTransaction(type, description, amount) {
  const allowed = ["Deposit", "Withdrawal", "Transfer"];

  if (!allowed.includes(type)) {
    showMessage("Invalid transaction type");
    return;
  }

  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    showMessage("Enter a valid amount");
    return;
  }

  const transaction = {
    id: "DEMO-" + Date.now(),
    type,
    description,
    amount: type === "Deposit" ? value : -value,
    date: new Date().toISOString(),
    status: "Demo"
  };

  transactions.unshift(transaction);

  localStorage.setItem(
    "demoTransactions",
    JSON.stringify(transactions)
  );

  renderTransactions();

  showMessage("Demo transaction added");
}

/* ==========================================
   TRANSACTION NAVIGATION
========================================== */

function showTransactions() {
  createTransactionSection();

  const main = document.querySelector(".main");
  const section = document.getElementById("transactionHistory");

  if (!main || !section) return;

  closeMenu();

  Array.from(main.children).forEach(element => {
    if (element !== section) {
      if (element.dataset.previousDisplay === undefined) {
        element.dataset.previousDisplay = element.style.display;
      }

      element.style.display = "none";
    }
  });

  section.style.display = "block";

  renderTransactions();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function showDashboardView() {
  const main = document.querySelector(".main");
  const section = document.getElementById("transactionHistory");

  if (!main) return;

  if (section) section.style.display = "none";

  Array.from(main.children).forEach(element => {
    if (element !== section) {
      element.style.display =
        element.dataset.previousDisplay ?? "";

      delete element.dataset.previousDisplay;
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ==========================================
   LOGIN INPUTS
========================================== */

function checkInputs() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const button = document.getElementById("loginBtn");

  if (!username || !password || !button) return;

  button.disabled = !(
    username.value.trim() &&
    password.value.trim()
  );
}

/* ==========================================
   LOGIN
========================================== */

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const button = document.getElementById("loginBtn");
  const spinner = document.getElementById("spinner");
  const error = document.getElementById("errorBox");

  if (Date.now() < lockUntil) {
    startCountdown();
    return;
  }

  error.textContent = "";
  button.disabled = true;
  button.textContent = "Signing in...";
  spinner.style.display = "block";

  setTimeout(() => {
    const validUser = users.find(user =>
      user.username === username &&
      user.password === password
    );

    if (validUser) {
      attempts = 0;

      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lockUntil");

      localStorage.setItem("isLoggedIn", "true");

      showDashboard();
    } else {
      attempts++;

      localStorage.setItem("loginAttempts", attempts);

      if (attempts >= MAX_ATTEMPTS) {
        lockUntil = Date.now() + LOCK_DURATION;

        localStorage.setItem("lockUntil", lockUntil);

        startCountdown();
      } else {
        error.textContent =
          `Invalid credentials (${MAX_ATTEMPTS - attempts} tries left)`;
      }

      spinner.style.display = "none";
      button.textContent = "Sign In";
      button.disabled = false;
    }
  }, 1200);
}

/* ==========================================
   PASSWORD VISIBILITY
========================================== */

function togglePassword() {
  const input = document.getElementById("password");
  const text = document.getElementById("toggleText");

  if (input.type === "password") {
    input.type = "text";
    text.textContent = "Hide";
  } else {
    input.type = "password";
    text.textContent = "Show";
  }
}

/* ==========================================
   LOGIN COUNTDOWN
========================================== */

function startCountdown() {
  const error = document.getElementById("errorBox");
  const button = document.getElementById("loginBtn");

  clearInterval(countdownInterval);

  button.disabled = true;

  countdownInterval = setInterval(() => {
    const remaining = Math.ceil(
      (lockUntil - Date.now()) / 1000
    );

    if (remaining <= 0) {
      clearInterval(countdownInterval);

      attempts = 0;
      lockUntil = 0;

      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lockUntil");

      error.textContent = "";
      button.disabled = false;
    } else {
      error.textContent =
        `Too many attempts. Try again in ${remaining}s`;
    }
  }, 1000);
}

/* ==========================================
   SHOW DASHBOARD
========================================== */

function showDashboard() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";

  createCheckingChart();
  createSavingsChart();
  createTransactionSection();
}

/* ==========================================
   LOGOUT
========================================== */

function logout() {
  localStorage.removeItem("isLoggedIn");

  clearInterval(countdownInterval);
  closeMenu();

  const app = document.getElementById("app");

  app.style.opacity = "0";

  setTimeout(() => {
    app.style.display = "none";

    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    document.getElementById("loginBtn").disabled = true;
    document.getElementById("loginBtn").textContent = "Sign In";

    document.getElementById("errorBox").textContent = "";
    document.getElementById("spinner").style.display = "none";

    app.style.opacity = "1";

    setGreeting();
  }, 300);
}

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  setGreeting();

  if (localStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  }
});
