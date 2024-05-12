const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})

function createDashboard() {
    const dashboardContent = document.getElementById("dashboard-content");
    dashboardContent.innerHTML = ""; // Clear previous content

    const dashboardTitle = document.createElement("h1");
    dashboardTitle.textContent = "Dashboard";
    dashboardContent.appendChild(dashboardTitle);

    const analyseDiv = document.createElement("div");
    analyseDiv.classList.add("analyse");

    const salesDiv = document.createElement("div");
    salesDiv.classList.add("sales");
    const salesStatusDiv = document.createElement("div");
    salesStatusDiv.classList.add("status");
    const salesInfoDiv = document.createElement("div");
    salesInfoDiv.classList.add("info");
    salesInfoDiv.innerHTML = "<h3>Total Income</h3><h1>$</h1>";
    salesStatusDiv.appendChild(salesInfoDiv);
    salesDiv.appendChild(salesStatusDiv);

    const visitsDiv = document.createElement("div");
    visitsDiv.classList.add("visits");
    const visitsStatusDiv = document.createElement("div");
    visitsStatusDiv.classList.add("status");
    const visitsInfoDiv = document.createElement("div");
    visitsInfoDiv.classList.add("info");
    visitsInfoDiv.innerHTML = "<h3>Total Expense</h3><h1>$</h1>";
    visitsStatusDiv.appendChild(visitsInfoDiv);
    visitsDiv.appendChild(visitsStatusDiv);

    const searchesDiv = document.createElement("div");
    searchesDiv.classList.add("searches");
    const searchesStatusDiv = document.createElement("div");
    searchesStatusDiv.classList.add("status");
    const searchesInfoDiv = document.createElement("div");
    searchesInfoDiv.classList.add("info");
    searchesInfoDiv.innerHTML = "<h3>Total Budget</h3><h1>$</h1>";
    searchesStatusDiv.appendChild(searchesInfoDiv);
    searchesDiv.appendChild(searchesStatusDiv);

    analyseDiv.appendChild(salesDiv);
    analyseDiv.appendChild(visitsDiv);
    analyseDiv.appendChild(searchesDiv);

    dashboardContent.appendChild(analyseDiv);

    const newUsersDiv = document.createElement("div");
    newUsersDiv.classList.add("new-users");
    newUsersDiv.innerHTML = "<h2>Report</h2><canvas id='expenseChart' width='400' height='200'></canvas>";
    dashboardContent.appendChild(newUsersDiv);

    generateExpenseChart();
}



document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("a[onclick='createDashboard()']").addEventListener("click", Dashboard);
});




