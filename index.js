const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const darkMode = document.querySelector(".dark-mode");
const closeBtn = document.getElementById("close-btn");
const asidename = document.getElementsByClassName("asidename")[0];
const rightSection = document.getElementsByClassName("right-section")[0];

menuBtn.addEventListener("click", () => {
  if (sideMenu.style.display === "block") {
    sideMenu.style.display = "none";
  } else {
    sideMenu.style.display = "block";
  }
});
darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});
const incomeListItem = document.querySelector('a[data-action="income"]');
incomeListItem.addEventListener("click", displayIncome);
const expenseListItem = document.querySelector('a[data-action="expense"]');
expenseListItem.addEventListener("click", displayExpense);
const budgetListItem = document.querySelector('a[data-action="budget"]');
budgetListItem.addEventListener("click", displayBudget);
const goalListItem = document.querySelector('a[data-action="goal"]');
goalListItem.addEventListener("click", displayGoals);
let userName = localStorage.getItem("userName");
let userImage = localStorage.getItem("profileImg");
const userProfileImage = document.getElementById("userImag");
userProfileImage.src = userImage;
const userNameOnDashboard = document.getElementById("username");
userNameOnDashboard.textContent = userName;
let userId = localStorage.getItem("userId");
let userToken = sessionStorage.getItem("userToken");
let expenseData = [];
let incomeData = [];
let budgetData = [];
let goalData = [];
let totalExpense = 0;
let totalIncome = 0;
let totalBudget = 0;
let editRecord = null;
let editGoalObject = null;
let expenseAllCategory = [];
let budgetAllCategory = [];
let incomeAllCategory = [];
let graphData = [{}];
let targetMonth = new Date().getMonth() + 1;
let targetYear = new Date().getFullYear();
const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let monthInString = getMonthName(new Date().getMonth());
window.onload = async function () {
  const dashboardContent = document.getElementById("dashboard-content");
  dashboardContent.innerHTML = "";
  if (userToken == null || sessionStorage.getItem("authToken") == null) {
    function createAndStyleElement(tag, textContent, styles) {
      const element = document.createElement(tag);
      element.textContent = textContent;
      Object.assign(element.style, styles);
      return element;
    }
    const mainContainer = document.getElementById("main");
    mainContainer.innerHTML = "";

    const container = document.createElement("div");
    container.id = "container";
    Object.assign(container.style, {
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto",
    });
    const welcomeHeading = createAndStyleElement(
      "h1",
      "Welcome to SaveIt App",
      {
        color: "#333",
        marginBottom: "1rem",
      }
    );

    // Create and style the quote
    const quote = createAndStyleElement(
      "p",
      "“A budget is telling your money where to go instead of wondering where it went.” – Dave Ramsey",
      {
        color: "#555",
        fontSize: "1.2rem",
        marginBottom: "1rem",
        fontStyle: "italic",
      }
    );

    const additionalText = createAndStyleElement(
      "p",
      "Manage your expenses effectively and efficiently.",
      {
        color: "#555",
        fontSize: "1.2rem",
        marginBottom: "2rem",
      }
    );

    const loginBtn = createAndStyleElement("button", "Login", {
      color: "white",
      backgroundColor: "green",
      height: "3rem",
      width: "10rem",
      margin: "1rem",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    });
    loginBtn.id = "login";
    loginBtn.onclick = SignIn;

    const signupBtn = createAndStyleElement("button", "Sign Up", {
      color: "white",
      backgroundColor: "blue",
      height: "3rem",
      width: "10rem",
      margin: "1rem",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    });
    signupBtn.id = "signup";
    signupBtn.onclick = SignUp;

    function SignUp() {
      localStorage.setItem("newUser", true);
      SignIn();

      console.log("Sign Up button clicked");
    }

    container.appendChild(welcomeHeading);
    container.appendChild(quote);
    container.appendChild(additionalText);
    container.appendChild(loginBtn);
    container.appendChild(signupBtn);
    mainContainer.appendChild(container);
    document.body.style.cssText = `
      font-family: Arial, sans-serif;
      background-color: #f0f8ff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 1rem;
      box-sizing: border-box;
    `;
    const buttons = [loginBtn, signupBtn];
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor =
          button.id === "login" ? "#004d00" : "#0000a0";
      });
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = button.id === "login" ? "green" : "blue";
      });
    });
  } else {
    const elements = document.querySelectorAll(".after-login");
    elements.forEach((element) => {
      element.style.display = "block";
    });
    fetchIncomeCategory()
      .then((data) => {
        incomeAllCategory = data;
      })
      .catch((error) => {
        console.log("Error getting total income:");
      });
    fetchBudgetCategory()
      .then((data) => {
        console.log("data", data);
        budgetAllCategory = data;
      })
      .catch((error) => {
        console.log("Error getting total Budget:");
      });
    fetchExpenseCategory()
      .then((data) => {
        expenseAllCategory = data;
      })
      .catch((error) => {
        console.log("Error getting total Expense:");
      });
    await createDashboard();
    stopLoading();
  }
};

function getMonthName(monthNumber) {
  if (monthNumber < 1 || monthNumber > 12) {
   console.log("No records")
  }
  return monthNames[monthNumber + 1];
}
async function fetchIncomeCategory() {
  try {
    const response = await fetch(
      "https://save-it.projects.bbdgrad.com/api/getIncomeCategories",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      console.log("No expenses found");
      return 0;
    } else if (!response.ok) {
   console.log("No records")
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching Income ategory:");
    return 0;
  }
}
async function fetchBudgetCategory() {
  try {
    const response = await fetch(
      "https://save-it.projects.bbdgrad.com/api/getBudgetCategories",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      console.log("No budget categories found");
      return 0;
    } else if (!response.ok) {
   console.log("No records")
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching budget ategories:");
    return 0;
  }
}

async function fetchAllExpense() {
  startLoading();
  try {
    const response = await fetch(
      `https://save-it.projects.bbdgrad.com/api/getExpensesByUserId/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
     expenseData=[];
    }

    const data = await response.json();
    stopLoading();

    if (typeof data === 'string') {
      console.log("Received string data:", data);
      return false;
    }

    if (Array.isArray(data)) {
      expenseData = data.reverse();
      let expenseTotalDate = [];
      data.forEach((v) => {
        let month = new Date(v.spendDate).getMonth() + 1;
        if (targetMonth == parseInt(month)) {
          expenseTotalDate.push(v);
        }
      });
      const totalAmount = expenseTotalDate.reduce(
        (acc, expense) => acc + expense.amountSpend,
        0
      );
      totalExpense = totalAmount;
    }

  } catch (error) {
    console.log("Error fetching expenses:");
    stopLoading();
  }
}

async function fetchAllIncome() {
  startLoading();
  try {
    const response = await fetch(
      `https://save-it.projects.bbdgrad.com/api/getIncomeByUserId/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("reponse",response);
    if (!response.ok) {
     incomeData=[]
    }

    const data = await response.json();
    stopLoading();


    if (Array.isArray(data)) {
      incomeData = data.reverse();
      let incomeTotalDate = [];
      data.forEach((v) => {
        let month = new Date(v.incomeDate).getMonth() + 1;
        if (targetMonth == parseInt(month)) {
          incomeTotalDate.push(v);
        }
      });
      const totalAmount = incomeTotalDate.reduce(
        (acc, income) => acc + income.incomeAmount,
        0
      );
      totalIncome = totalAmount;
    }

  } catch (error) {
    console.log("Error fetching income:");
    stopLoading();
  }
}

async function fetchAllBudget() {
  startLoading();
  try {
    const response = await fetch(
      `https://save-it.projects.bbdgrad.com/api/getBudgetByUserId/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
     budgetData=[];
    }

    const data = await response.json();
    stopLoading();

    if (typeof data === 'string') {
      console.log("Received string data:", data);
      return false;
    }

    if (Array.isArray(data)) {
      budgetData = data.reverse();
      let budgetTotalDate = [];
      data.forEach((v) => {
        let startmonth = new Date(v.start_date).getMonth() + 1;
        if (targetMonth == parseInt(startmonth)) {
          budgetTotalDate.push(v);
        }
      });
      const totalAmount = budgetTotalDate.reduce(
        (acc, budget) => acc + budget.amount,
        0
      );
      totalBudget = totalAmount;
    }

  } catch (error) {
    console.log("Error fetching budget:");
    stopLoading();
  }
}

async function fetchAllGoal() {
  startLoading();
  try {
    const response = await fetch(
      `https://save-it.projects.bbdgrad.com/api/getGoalByUserId/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
   console.log("No records")
    }

    const data = await response.json();
    stopLoading();

    if (typeof data === 'string') {
      console.log("Received string data:", data);
      return false;
    }

    if (Array.isArray(data)) {
      goalData = data.reverse();
    }

  } catch (error) {
    console.log("Error fetching budget:");
    stopLoading();
  }
}


async function fetchExpenseCategory() {
  startLoading();
  try {
    const response = await fetch(
      "https://save-it.projects.bbdgrad.com/api/getExpenseCategories",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
   console.log("No records")
    }

    const data = await response.json();
    stopLoading();

    if (typeof data === 'string') {
      console.log("Received string data:", data);
      return 0;
    }

    if (Array.isArray(data)) {
      return data;
    }

  } catch (error) {
    console.log("Error fetching expense category:");
    stopLoading();
    return 0;
  }
}

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});
const successful = document.getElementById("main");

function showErrorMessage(message) {
  const errorMessage = document.createElement("div");
  errorMessage.textContent = message;
  Object.assign(errorMessage.style, {
    backgroundColor: "red",
    color: "white",
    border: "1px solid #c3e6cb",
    padding: "1rem",
    borderRadius: "5px",
    position: "fixed",
    top: "0",
    width: "30rem",
    zIndex: 1000,
    margin: "0",
    textAlign: "center",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  });
  document.body.appendChild(errorMessage);

  setTimeout(() => {
    document.body.removeChild(errorMessage);
  }, 2000);
}
function showSuccessMessage(message) {
  const successMessage = document.createElement("div");
  successMessage.textContent = message;
  Object.assign(successMessage.style, {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    padding: "1rem",
    borderRadius: "5px",
    position: "fixed",
    top: "0",
    width: "30rem",
    zIndex: 1000,
    margin: "0",
    textAlign: "center",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  });

  successful.appendChild(successMessage);
  setTimeout(() => {
    successful.removeChild(successMessage);
  }, 2000);
}

function generateExpenseChart() {
  const canvas = document.getElementById("expenseChart");
  const ctx = canvas.getContext("2d");

  if (
    window.expenseChart !== undefined &&
    window.expenseChart instanceof Chart
  ) {
    window.expenseChart.destroy();
  }

  const graphData = expenseAllCategory.map((category) => {
    const key = category.expenseCategoryName;
    const count = expenseData.filter((expense) => {
      const date = new Date(expense.spendDate);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return (
        month === targetMonth &&
        year === targetYear &&
        expense.expenseCategory === category.expenseCategoryId
      );
    }).length;

    return { [key]: count };
  });

  const labels = [];
  const amounts = [];
  console.log("graph", graphData);
  graphData.forEach((expense) => {
    const category = Object.keys(expense)[0];
    const count = Object.values(expense)[0];

    labels.push(category);
    amounts.push(count);
  });

  window.expenseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Amount Spent",
          data: amounts,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function createDashboard() {

  const styles = `
    #monthInput {
      margin: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }

    #monthInput:focus {
      outline: none;
      border-color: #007bff;
    }

    #findButton {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #6C9BCF;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    #findButton:hover {
      background-color: #0056b3;
    }

    #findButton:focus {
      outline: none;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .filter-container {
      display: flex;
      align-items: center;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  const dashboardContent = document.getElementById("dashboard-content");
  dashboardContent.innerHTML = "";
  const dashboardHeader = document.createElement("div");
  dashboardHeader.classList.add("dashboard-header");
  const dashboardTitle = document.createElement("h1");
  dashboardTitle.textContent = "Dashboard";
  dashboardHeader.appendChild(dashboardTitle);
  startLoading();
  await fetchAllExpense();
  await fetchAllIncome();
  await fetchAllBudget();
  await fetchAllGoal()
  stopLoading();
if(expenseData.length>0||budgetData.length>0||budgetData.length>0){
  dashboardContent.appendChild(dashboardHeader);
  const filterContainer = document.createElement("div");
  filterContainer.classList.add("filter-container");

  const monthInput = document.createElement("input");
  monthInput.type = "month";
  monthInput.id = "monthInput";
  filterContainer.appendChild(monthInput);
  const formattedMonth = `${targetYear}-${String(targetMonth).padStart(
    2,
    "0"
  )}`;
  monthInput.value = formattedMonth;

  const findButton = document.createElement("button");
  findButton.id = "findButton";
  findButton.textContent = "Find";
  findButton.onclick = function () {
    const selectedMonth = document.getElementById("monthInput").value;
    const selectedYear = parseInt(selectedMonth.split("-")[0]);
    const selectedMonthNum = parseInt(selectedMonth.split("-")[1]);
    targetYear = selectedYear;
    targetMonth = selectedMonthNum;
    monthInString = getMonthName(selectedMonthNum - 1).toString();
    createDashboard();
  };
  filterContainer.appendChild(findButton);

  dashboardHeader.appendChild(filterContainer);

  const currentDateDiv = document.createElement("div");
  currentDateDiv.id = "currentDate";
  dashboardContent.appendChild(currentDateDiv);

  const analyseDiv = document.createElement("div");
  analyseDiv.classList.add("analyse");

  const totalBalance = document.createElement("div");
  totalBalance.classList.add("total");
  const totalBalanceDiv = document.createElement("div");
  totalBalanceDiv.classList.add("status");
  const totalBalanceInfoDiv = document.createElement("div");
  totalBalanceInfoDiv.classList.add("info");
  totalBalanceInfoDiv.innerHTML = `<h3>Current Balance</h3><h1>Rs.${
    totalIncome - totalExpense
  }</h1>`;
  totalBalanceDiv.appendChild(totalBalanceInfoDiv);
  totalBalance.appendChild(totalBalanceDiv);

  const salesDiv = document.createElement("div");
  salesDiv.classList.add("sales");
  const salesStatusDiv = document.createElement("div");
  salesStatusDiv.classList.add("status");
  const salesInfoDiv = document.createElement("div");
  salesInfoDiv.classList.add("info");
  salesInfoDiv.innerHTML = `<h3>Total Income</h3><h1>Rs.${totalIncome}</h1>`;
  salesStatusDiv.appendChild(salesInfoDiv);
  salesDiv.appendChild(salesStatusDiv);

  const visitsDiv = document.createElement("div");
  visitsDiv.classList.add("visits");
  const visitsStatusDiv = document.createElement("div");
  visitsStatusDiv.classList.add("status");
  const visitsInfoDiv = document.createElement("div");
  visitsInfoDiv.classList.add("info");
  visitsInfoDiv.innerHTML = `<h3>Total Expense</h3><h1>Rs.${totalExpense}</h1>`;
  visitsStatusDiv.appendChild(visitsInfoDiv);
  visitsDiv.appendChild(visitsStatusDiv);

  const searchesDiv = document.createElement("div");
  searchesDiv.classList.add("searches");
  const searchesStatusDiv = document.createElement("div");
  searchesStatusDiv.classList.add("status");
  const searchesInfoDiv = document.createElement("div");
  searchesInfoDiv.classList.add("info");
  searchesInfoDiv.innerHTML = `<h3>Total Budget</h3><h1>Rs.${totalBudget}</h1>`;
  if (totalExpense > totalBudget) {
    searchesInfoDiv.style.color = "red";
    searchesInfoDiv.innerHTML = `<h1>Out of Budget</h1>`;
  }
  searchesStatusDiv.appendChild(searchesInfoDiv);
  searchesDiv.appendChild(searchesStatusDiv);

  analyseDiv.appendChild(totalBalance);
  analyseDiv.appendChild(salesDiv);
  analyseDiv.appendChild(visitsDiv);
  analyseDiv.appendChild(searchesDiv);

  dashboardContent.appendChild(analyseDiv);

  const newUsersDiv = document.createElement("div");
  newUsersDiv.classList.add("new-users");
  newUsersDiv.innerHTML = `<h2>Report for ${monthInString}</h2><canvas id='expenseChart'></canvas>`;
  dashboardContent.appendChild(newUsersDiv);
  generateExpenseChart();
}else{
  const head = document.createElement("h1");
    head.style.marginTop="1.7rem"
    head.textContent = "Please add records create dashboard";
    dashboardContent.appendChild(dashboardHeader);
    dashboardContent.appendChild(head);
}
  
}

function displayReport() {
  const dashboardContent = document.getElementById("dashboard-content");
  dashboardContent.innerHTML = ""; // Clear previous content

  const reportHeading = document.createElement("h1");
  reportHeading.textContent = "Report";
  dashboardContent.appendChild(reportHeading);

  generateExpenseChart();
}
// console.log("Deleting goal with ID:", goalId);
