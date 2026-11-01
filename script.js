/* ==========================================
   BANKING DASHBOARD DEMO
========================================== */

const DEMO_USERS = [
  { username: "demo", password: "demo1234" }
];

const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 30000;

let attempts = Number(localStorage.getItem("loginAttempts")) || 0;
let lockUntil = Number(localStorage.getItem("lockUntil")) || 0;
let countdownInterval;
let checkingChart;
let savingsChart;


/* ==========================================
   HELPERS
========================================== */

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);

function getStoredData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}


/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

let toastTimeout;

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

  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const element = document.getElementById("greeting");

  if (element) {
    element.textContent = greeting;
  }
}


/* ==========================================
   MOBILE MENU
========================================== */

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  if (!menu || !overlay) return;

  menu.classList.toggle("active");
  overlay.classList.toggle("active");
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
   DEMO CHART DATA
========================================== */

// Fixed illustrative historical data.
// These values are not actual bank records.

const checkingHistory = [
  { day: "Mon", balance: 6100000 },
  { day: "Tue", balance: 6180000 },
  { day: "Wed", balance: 6150000 },
  { day: "Thu", balance: 6250000 },
  { day: "Fri", balance: 6200000 },
  { day: "Sat", balance: 6280000 },
  { day: "Sun", balance: 6300817 }
];

const savingsHistory = [
  9050, 9080, 9020, 9150, 9200,
  9180, 9250, 9300, 9280, 9350,
  9400, 9380, 9450, 9500, 9480,
  9550, 9600, 9580, 9650, 9700,
  9680, 9750, 9800, 9780, 9850,
  9900, 9950, 10000, 10200, 10817
];


/* ==========================================
   CHART CONFIGURATION
========================================== */

function createCheckingChart() {
  const canvas = document.getElementById("lineChart");

  if (!canvas || typeof Chart === "undefined") return;

  if (checkingChart) {
    checkingChart.destroy();
  }

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 250);

  gradient.addColorStop(0, "rgba(166, 25, 46, 0.25)");
  gradient.addColorStop(1, "rgba(166, 25, 46, 0.01)");

  checkingChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: checkingHistory.map(item => item.day),

      datasets: [{
        label: "Illustrative balance",

        data: checkingHistory.map(item => item.balance),

        borderColor: "#a6192e",
        backgroundColor: gradient,

        fill: true,

        borderWidth: 3,

        tension: 0.4,

        pointRadius: 3,
        pointHoverRadius: 7,

        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#a6192e",
        pointBorderWidth: 2
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
        duration: 1200,
        easing: "easeOutQuart"
      },

      plugins: {
        legend: {
          display: false
        },

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
          grid: {
            display: false
          },

          border: {
            display: false
          },

          ticks: {
            color: "#89919c"
          }
        },

        y: {
          border: {
            display: false
          },

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

  if (savingsChart) {
    savingsChart.destroy();
  }

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 100);

  gradient.addColorStop(0, "rgba(105, 180, 65, 0.25)");
  gradient.addColorStop(1, "rgba(105, 180, 65, 0.01)");

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
        pointHoverRadius: 5,

        pointHoverBackgroundColor: "#79bd45"
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
        legend: {
          display: false
        },

        tooltip: {
          enabled: true,

          backgroundColor: "#252d38",

          displayColors: false,

          callbacks: {
            title(items) {
              return items[0].label;
            },

            label(context) {
              return formatMoney(context.raw);
            }
          }
        }
      },

      scales: {
        x: {
          display: false
        },

        y: {
          display: false
        }
      }
    }
  });
}


/* ==========================================
   DEMO TRANSACTION DATA
========================================== */

const initialTransactions = [
  {
    id: "DEMO-10001",
    type: "Deposit",
    description: "Sample deposit",
    amount: 500,
    date: "2026-10-29T10:30:00",
    status: "Demo"
  },

  {
    id: "DEMO-10002",
    type: "Withdrawal",
    description: "Sample withdrawal",
    amount: -150,
    date: "2026-10-28T14:20:00",
    status: "Demo"
  },

  {
    id: "DEMO-10003",
    type: "Transfer",
    description: "Sample transfer",
    amount: -250,
    date: "2026-10-27T09:15:00",
    status: "Demo"
  },

  {
    id: "DEMO-10004",
    type: "Deposit",
    description: "Sample deposit",
    amount: 800,
    date: "2026-10-25T12:40:00",
    status: "Demo"
  }
];

let transactions = getStoredData(
  "demoTransactions",
  initialTransactions
);


/* ==========================================
   TRANSACTION HISTORY UI
========================================== */

function createTransactionSection() {
  const main = document.querySelector(".main");

  if (!main || document.getElementById("transactionHistory")) return;

  const section = document.createElement("section");

  section.id = "transactionHistory";

  section.innerHTML = `
    <div style="
      background:#fff;
      padding:20px;
      border-radius:12px;
      margin-top:25px;
      border:1px solid #e8ebef;
    ">

      <h3 style="margin-top:0;color:#8c1d30">
        Demo Transaction History
      </h3>

      <p style="font-size:12px;color:#89919c">
        Illustrative transactions for this banking demo.
      </p>

      <input
        id="transactionSearch"
        type="search"
        placeholder="Search transactions..."
        style="
          width:100%;
          padding:12px;
          border:1px solid #ddd;
          border-radius:7px;
          margin:12px 0;
        "
      >

      <div id="transactionList"></div>

    </div>
  `;

  main.appendChild(section);

  document
    .getElementById("transactionSearch")
    .addEventListener("input", renderTransactions);

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

  const filtered = transactions.filter(transaction => {
    return (
      transaction.description.toLowerCase().includes(search) ||
      transaction.type.toLowerCase().includes(search) ||
      transaction.id.toLowerCase().includes(search)
    );
  });

  if (!filtered.length) {
    list.innerHTML = `
      <p style="text-align:center;color:#89919c;padding:20px">
        No matching demo transactions found.
      </p>
    `;

    return;
  }

  list.innerHTML = filtered.map(transaction => {
    const positive = transaction.amount > 0;

    return `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:15px 0;
        border-bottom:1px solid #edf0f3;
      ">

        <div>
          <strong style="font-size:13px">
            ${escapeHTML(transaction.description)}
          </strong>

          <p style="font-size:11px;color:#89919c;margin:5px 0">
            ${new Date(transaction.date).toLocaleString()}
          </p>

          <small style="color:#89919c">
            ${escapeHTML(transaction.id)}
          </small>
        </div>

        <strong style="
          color:${positive ? "#18864b" : "#c62828"};
          font-size:13px;
          white-space:nowrap;
        ">
          ${positive ? "+" : "-"}
          ${formatMoney(Math.abs(transaction.amount))}
        </strong>

      </div>
    `;
  }).join("");
}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}


/* ==========================================
   ADD DEMO TRANSACTION
========================================== */

function addDemoTransaction(type, description, amount) {
  const validTypes = ["Deposit", "Withdrawal", "Transfer"];

  if (!validTypes.includes(type)) {
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
   LOGIN
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
    const validUser = DEMO_USERS.find(user =>
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

      button.disabled = true;
    }

  }, 1000);
}


/* ==========================================
   DASHBOARD
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
