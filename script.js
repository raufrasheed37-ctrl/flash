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