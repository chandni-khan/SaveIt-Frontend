const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const darkMode = document.querySelector(".dark-mode");
const closeBtn=document.getElementById("close-btn")

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

    // Create and style the signup button
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
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        incomeAllCategory = data;
        return data;
      } catch (error) {
        console.error("Error fetching Income category:", error);
        return 0;
      }
    }

    fetchIncomeCategory()
      .then((data) => {
        incomeAllCategory = data;
      })
      .catch((error) => {
        console.error("Error getting total income:", error);
      });

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
    await createDashboard();
  }
};

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
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Income category:", error);
    return 0;
  }
}

fetchIncomeCategory()
  .then((data) => {
    incomeAllCategory = data;
  })
  .catch((error) => {
    console.error("Error getting total income:", error);
  });

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
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching budget categories:", error);
      return 0;
    }
  }
  
  fetchBudgetCategory()
    .then((data) => {
      console.log("data", data);
      budgetAllCategory = data;
    })
    .catch((error) => {
      console.error("Error getting total Budget:", error);
    });

function getMonthName(monthNumber) {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Month number must be between 1 and 12");
  }
  return monthNames[monthNumber + 1];
}

async function fetchAllExpense() {
  await fetch(
    `https://save-it.projects.bbdgrad.com/api/getExpensesByUserId/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      expenseData = data;
      let expenseTotalDate = [];
      data.map((v) => {
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
    }, 1000);
}
async function fetchAllIncome() {
  await fetch(
    `https://save-it.projects.bbdgrad.com/api/getIncomeByUserId/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      incomeData = data;
      let incomeTotalDate = [];
      data.map((v) => {
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
    });
}
async function fetchAllBudget() {
  await fetch(
    `https://save-it.projects.bbdgrad.com/api/getBudgetByUserId/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      budgetData = data;

      let budgetTotalDate = [];
      data.map((v) => {
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
    });
}
async function fetchExpenseCategory() {
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

    if (response.status === 204) {
      console.log("No expenses found");
      return 0;
    } else if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching expensecategory:", error);
    return 0;
  }
}

fetchExpenseCategory()
  .then((data) => {
    expenseAllCategory = data;
  })
  .catch((error) => {
    console.error("Error getting total Expense:", error);
  });

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
  await fetchAllExpense();
  await fetchAllIncome();
  await fetchAllBudget();
  const dashboardContent = document.getElementById("dashboard-content");
  dashboardContent.innerHTML = "";

  const dashboardTitle = document.createElement("h1");
  dashboardTitle.textContent = "Dashboard";
  dashboardContent.appendChild(dashboardTitle);

  const currentDateDiv = document.createElement("div");
  currentDateDiv.id = "currentDate";
  dashboardContent.appendChild(currentDateDiv);

  const monthInput = document.createElement("input");
  monthInput.type = "month";
  monthInput.id = "monthInput";
  dashboardContent.appendChild(monthInput);
  const formattedMonth = `${targetYear}-${String(targetMonth).padStart(
    2,
    "0"
  )}`;

  document.getElementById("monthInput").value = formattedMonth;

  const findButton = document.createElement("button");
  findButton.textContent = "Find";
  findButton.style.backgroundColor = "blue";
  findButton.style.color = "white";
  findButton.style.width = "5rem";

  findButton.onclick = function () {
    const selectedMonth = document.getElementById("monthInput").value;
    const selectedYear = parseInt(selectedMonth.split("-")[0]);
    const selectedMonthNum = parseInt(selectedMonth.split("-")[1]);
    targetYear = selectedYear;
    targetMonth = selectedMonthNum;
    monthInString = getMonthName(selectedMonthNum - 1).toString();
    createDashboard();
  };

  dashboardContent.appendChild(findButton);

  dashboardContent.appendChild(findButton);

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
}

// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .querySelector("a[onclick='createDashboard()']")
//     .addEventListener("click", Dashboard);
// });




function displayGoals() {
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = ""; // Clear previous content

  const addBtn = document.createElement("button");
  addBtn.id = "addGoal";
  addBtn.textContent = "Create Goal";
  addBtn.onclick = () => {
    addGoalForm();
  };
  mainContainer.appendChild(addBtn);
  // Add heading
  const heading = document.createElement("h1");
  heading.textContent = "Goals";
  mainContainer.appendChild(heading);

  // Add Modal Structure
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.style.display = "none"; // Hide modal by default
  modal.style.position = "fixed";
  modal.style.zIndex = "1";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.overflow = "auto";
  modal.style.backgroundColor = "rgba(0,0,0,0.4)";

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fefefe";
  modalContent.style.margin = "15% auto"; // 15% from the top and centered
  modalContent.style.padding = "20px";
  modalContent.style.border = "1px solid #888";
  modalContent.style.width = "80%"; // Could be more or less, depending on screen size
  modalContent.style.maxWidth = "300px";
  modalContent.style.textAlign = "center";

  const closeModal = document.createElement("span");
  closeModal.textContent = "×";
  closeModal.style.color = "#aaa";
  closeModal.style.float = "right";
  closeModal.style.fontSize = "28px";
  closeModal.style.fontWeight = "bold";
  closeModal.style.cursor = "pointer";
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Add Amount";

  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.id = "amountInput";
  amountInput.placeholder = "Enter amount";

  const modalButtons = document.createElement("div");
  modalButtons.style.display = "flex";
  modalButtons.style.justifyContent = "space-around";
  modalButtons.style.marginTop = "20px";

  const cancelButton = document.createElement("button");
  cancelButton.id = "cancelButton";
  cancelButton.textContent = "CANCEL";
  cancelButton.style.padding = "10px 20px";
  cancelButton.style.fontSize = "16px";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.backgroundColor = "#f44336"; // Red
  cancelButton.style.color = "white";
  cancelButton.onclick = function () {
    modal.style.display = "none";
  };

  const insertButton = document.createElement("button");
  insertButton.id = "insertButton";
  insertButton.textContent = "INSERT";
  insertButton.style.padding = "10px 20px";
  insertButton.style.fontSize = "16px";
  insertButton.style.cursor = "pointer";
  insertButton.style.backgroundColor = "#4CAF50"; // Green
  insertButton.style.color = "white";

  modalButtons.appendChild(cancelButton);
  modalButtons.appendChild(insertButton);

  modalContent.appendChild(closeModal);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(amountInput);
  modalContent.appendChild(modalButtons);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  fetch(`https://save-it.projects.bbdgrad.com/api/getGoalByUserId/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Create a list element
      const list = document.createElement("ul");
      list.style.listStyleType = "none";
      list.style.padding = "0";

      // Populate the list with goal data
      data.forEach((goal) => {
        const listItem = document.createElement("li");
        listItem.style.borderBottom = "1px solid #ccc";
        listItem.style.padding = "10px";
        listItem.style.display = "flex";
        listItem.style.justifyContent = "space-between";
        listItem.style.alignItems = "center"; // Center align items vertically

        // Goal content container
        const goalContent = document.createElement("div");

        // Goal title
        const title = document.createElement("h2");
        title.textContent = goal["goal_for"];
        goalContent.appendChild(title);

        // Progress bar container
        const progressContainer = document.createElement("div");
        progressContainer.classList.add("progress-container");

        // Progress bar
        const progressBar = document.createElement("progress");
        progressBar.value = goal["saved_already"];
        progressBar.max = goal["target_amount"];
        progressContainer.appendChild(progressBar);

        // Progress text
        const progressText = document.createElement("p");
        const progress = (goal["saved_already"] / goal["target_amount"]) * 100;
        progressText.textContent = `Saved: ${goal["saved_already"]} out of ${
          goal["target_amount"]
        } (${progress.toFixed(2)}%)`;
        progressContainer.appendChild(progressText);

        goalContent.appendChild(progressContainer);

        // Add saved amount button
        const addSavedAmountBtn = document.createElement("button");
        addSavedAmountBtn.textContent = "Add saved Amount >";
        addSavedAmountBtn.style.marginTop = "10px";
        addSavedAmountBtn.style.color = "#6C9BCF";
        addSavedAmountBtn.style.fontWeight = "bold";
        addSavedAmountBtn.onclick = function () {
          // Show modal
          modal.style.display = "block";

          // Handle "INSERT" button click
          insertButton.onclick = function () {
            const amountToAdd = amountInput.value;
            if (
              amountToAdd !== null &&
              !isNaN(amountToAdd) &&
              parseFloat(amountToAdd) >= 0
            ) {
              const newSavedAmount =
                parseFloat(goal["saved_already"]) + parseFloat(amountToAdd);
              fetch("https://save-it.projects.bbdgrad.com/api/updateGoal", {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  goal_id: goal.goal_id,
                  saved_already: newSavedAmount,
                  goal_for: goal.goal_for,
                  target_amount: goal.target_amount,
                  desired_date: goal.desired_date,
                  user_id: 8,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                })
                .then((data) => {
                  // Update the progress bar and text in the UI
                  goal["saved_already"] = newSavedAmount;
                  progressBar.value = newSavedAmount;
                  const progress =
                    (newSavedAmount / goal["target_amount"]) * 100;
                  progressText.textContent = `Saved: ${newSavedAmount} out of ${
                    goal["target_amount"]
                  } (${progress.toFixed(2)}%)`;
                  modal.style.display = "none";
                })
                .catch((error) => {
                  console.error(
                    "There was a problem with updating the saved amount:",
                    error
                  );
                });
            } else {
              console.log("Invalid input or user canceled the operation");
            }
          };
        };
        goalContent.appendChild(addSavedAmountBtn);

     
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";

  
        const editIcon = document.createElement("span");
        editIcon.classList.add("material-icons-sharp");
        editIcon.textContent = "edit";
        editIcon.style.color = "#6C9BCF";
        editIcon.style.cursor = "pointer";
        editIcon.onclick = function () {
          addGoalForm();
          editRecord = goal.goal_id;
        };
        buttonContainer.appendChild(editIcon);

        // Delete icon
        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("material-icons-sharp");
        deleteIcon.textContent = "delete";
        deleteIcon.style.color = "#FF0060";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.onclick = function () {
          deleteGoal(goal.goal_id);
        };
        buttonContainer.appendChild(deleteIcon);

        // Append goal content and buttons to the list item
        listItem.appendChild(goalContent);
        listItem.appendChild(buttonContainer);

        list.appendChild(listItem);
      });

      mainContainer.appendChild(list);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function addGoalForm() {
  const mainContainer = document.getElementById("dashboard-content");
  const formElements = [
    {
      type: "input",
      inputType: "text",
      name: "goal_for",
      labelText: "Goal For:",
    },
    {
      type: "input",
      inputType: "number",
      name: "target_amount",
      labelText: "Target Amount:",
    },
    {
      type: "input",
      inputType: "date",
      name: "desired_date",
      labelText: "Desired Date:",
    },
    {
      type: "input",
      inputType: "number",
      name: "saved_already",
      labelText: "Saved Already:",
    },
    { type: "input", inputType: "submit", name: "addGoal" },
  ];

  const formContainer = document.createElement("div");
  formContainer.classList.add("goal-form-container"); // New class

  const form = document.createElement("form");
  form.id = "GoalForm";
  form.classList.add("goal-form"); // New class

  formElements.forEach((element) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = element.labelText;
    label.classList.add("form-label"); // New class
    formGroup.appendChild(label);

    const input = document.createElement("input");
    input.type = element.inputType;
    input.name = element.name;
    input.id = element.name;
    input.required = true;
    input.classList.add("form-control"); // New class
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  if (editRecord != null) {
    fetch(`https://save-it.projects.bbdgrad.com/api/getGoalById/${goalId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          return;
        } else if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementsByName("goal_for")[0].value = data.goal_for;
        document.getElementsByName("target_amount")[0].value =
          data.target_amount;
        document.getElementsByName("desired_date")[0].value = data.desired_date;
        document.getElementsByName("saved_already")[0].value =
          data.saved_already;
        form.elements["createGoal"].value = "Update Goal"; // Update submit button text
        editRecord = data.goal_id;
        console.log("Editing goal with ID:", editRecord);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }
  formContainer.appendChild(form);
  mainContainer.replaceChildren(formContainer);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    let bodyData = {};
    if (editRecord) {
      bodyData = {
        goal_for: formData.get("goal_for"),
        target_amount: formData.get("target_amount"),
        desired_date: formData.get("desired_date"),
        saved_already: formData.get("saved_already"),
        user_id: 8,
        goal_id: editRecord,
      };
    } else {
      bodyData = {
        goal_for: formData.get("goal_for"),
        target_amount: formData.get("target_amount"),
        desired_date: formData.get("desired_date"),
        saved_already: formData.get("saved_already"),
        user_id: 8,
      };
    }
    fetch(
      editRecord
        ? "https://save-it.projects.bbdgrad.com/api/updateGoal"
        : "https://save-it.projects.bbdgrad.com/api/addGoal",
      {
        method: editRecord ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response;
      })
      .then((data) => {
        console.log("Data received:", data);
        resetForm();
        showSuccessMessage(editRecord ? "Updated Goal" : "Added Goal");
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
      });
    createDashboard();
  });
}

function deleteGoal(goalId) {
  if (window.confirm("Do you want to delete?")) {
    fetch(`https://save-it.projects.bbdgrad.com/api/deleteGoal/${goalId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    showSuccessMessage("deleted");
  }
  console.log("Deleting goal with ID:", goalId);
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
