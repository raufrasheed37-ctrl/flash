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
    alert("Please select an action");
    return;
  }

  alert("You selected: " + action);
}

// LINE CHART
new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["Mon","Tue","Wed","Thu","Fri"],
    datasets: [{
      data: [3000, 3500, 3200, 3700, 3817],
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { display: false } }
  }
});

// 🔥 ACTIVITY BREAKDOWN PIE
new Chart(document.getElementById("pieChart"), {
  type: "doughnut",
  data: {
    labels: ["Food", "Bills", "Shopping"],
    datasets: [{
      data: [40, 30, 30],
      backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"]
    }]
  },
  options: {
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  }
});

// CREDIT PIE
new Chart(document.getElementById("creditPie"), {
  type: "doughnut",
  data: {
    labels: ["Used","Available"],
    datasets: [{
      data: [70, 30]
    }]
  }
});


// 🔥 SAVINGS MINI GROWTH GRAPH
new Chart(document.getElementById("savingsChart"), {
  type: "line",
  data: {
    labels: ["Jan","Feb","Mar","Apr","May"],
    datasets: [{
      data: [10000, 10200, 10400, 10700, 10817],
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  }
});