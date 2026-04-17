const users = [
  { username: "wburger_05", password: "Bur@r!WG9" },
  { username: "walde_burger01", password: "W@ld3m@r!BG7" }
];

let attempts = 0;
const maxAttempts = 3;

let lockUntil = 0; 
let countdownInterval;

// MENU TOGGLE
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  menu.classList.toggle("active");
  overlay.classList.toggle("active");
}

// ACTION HANDLER
function handleAction() {
  const action = document.getElementById("actionSelect").value;

  if (!action) {
    showMessage("Please select an action");
    return;
  }

  showMessage("Service not available");
}

// LINE CHART
new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["Mon","Tue","Wed","Thu","Fri"],
    datasets: [{
      data: [6000000, 6500000, 6200000, 6700000, 6817000],
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { display: false } }
  }
});





// 🔥 SAVINGS MINI GROWTH GRAPH
document.addEventListener("DOMContentLoaded", () => {

  const ctx = document.getElementById("savingsChart");

  if (!ctx) return; // safety

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["","","","","","","","","",""],
      datasets: [{
        data: [9050, 9000, 9020, 9100, 9350, 9050, 9200, 9000, 9300, 9400],
        borderColor: "#8fd25c",
        backgroundColor: "transparent",
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });

});


function showMessage(msg = "Service not available") {
  const toast = document.getElementById("toast");

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}


// GREETING (NO DEFAULT TEXT)
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = "";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  const el = document.getElementById("greeting");
  if (el) el.innerText = greeting;
}

// LOGIN FUNCTION
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const btn = document.getElementById("loginBtn");
  const spinner = document.getElementById("spinner");
  const errorBox = document.getElementById("errorBox");

  const now = Date.now();


  if (now < lockUntil) {
    startCountdown();
    return;
  }

  errorBox.innerText = "";

  spinner.style.display = "block";
  btn.innerText = "Signing in...";
  btn.disabled = true;

  setTimeout(() => {

    const userFound = users.find(
      (u) => u.username === username && u.password === password
    );

    if (userFound) {
      localStorage.setItem("isLoggedIn", "true");
      attempts = 0;

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("app").style.display = "block";

    } else {
      attempts++;

      if (attempts >= maxAttempts) {
        lockUntil = Date.now() + 30000; 
        startCountdown();
      } else {
        errorBox.innerText = `Invalid credentials (${maxAttempts - attempts} tries left)`;
      }

      spinner.style.display = "none";
      btn.innerText = "Sign In";
      btn.disabled = false;
    }

  }, 5000);
}

// SHOW PASSWORD
function togglePassword() {
  const input = document.getElementById("password");
  const text = document.getElementById("toggleText");

  if (input.type === "password") {
    input.type = "text";
    text.innerText = "Hide";
  } else {
    input.type = "password";
    text.innerText = "Show";
  }
}

// RUN ON LOAD
document.addEventListener("DOMContentLoaded", setGreeting);


function checkInputs() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginBtn = document.getElementById("loginBtn");
   
  if (username && password) {
    loginBtn.disabled = false;
    loginBtn.style.opacity = "1";
  } else {
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.5";
  }
}


function startCountdown() {
  const errorBox = document.getElementById("errorBox");

  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const remaining = Math.ceil((lockUntil - Date.now()) / 1000);

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      attempts = 0;
      errorBox.innerText = "";
    } else {
      errorBox.innerText = `Too many attempts. Try again in ${remaining}s`;
    }
  }, 1000);
}


 function logout() {
  // remove login state
  localStorage.removeItem("isLoggedIn");

  
  const app = document.getElementById("app");
  app.style.opacity = "0";

  setTimeout(() => {
    app.style.display = "none";
    document.getElementById("loginPage").style.display = "block";

    // reset UI
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("loginBtn").disabled = true;
    document.getElementById("errorBox").innerText = "";

    setGreeting();

    
    app.style.opacity = "1";

  }, 300);
}