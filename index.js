const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
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
const darkMode = document.querySelector(".dark-mode");
let expenseAllCategory = [];
let budgetAllCategory = [];
let graphData = [{}];
let targetMonth = new Date().getMonth();
let targetYear = new Date().getFullYear();

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

    // Create and style the additional text
    const additionalText = createAndStyleElement(
      "p",
      "Manage your expenses effectively and efficiently.",
      {
        color: "#555",
        fontSize: "1.2rem",
        marginBottom: "2rem",
      }
    );

    // Create and style the login button
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

    // Append all elements to the container
    container.appendChild(welcomeHeading);
    container.appendChild(quote);
    container.appendChild(additionalText);
    container.appendChild(loginBtn);
    container.appendChild(signupBtn);

    // Append the container to the main container
    mainContainer.appendChild(container);

    // Add some basic styling to the body
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

    // Add hover effects for buttons
    const buttons = [loginBtn, signupBtn];
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor =
          button.id === "login" ? "#004d00" : "#0000a0"; // Darken on hover
      });
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = button.id === "login" ? "green" : "blue"; // Original color
      });
    });
  } else {
    await createDashboard();
  }
};

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

      const totalAmount = expenseData.reduce(
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
      const totalAmount = data.reduce(
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
      const totalAmount = data.reduce((acc, budget) => acc + budget.amount, 0);
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

// Get the main container element
const successful = document.getElementById("main");

// Function to create and show the success message
function showSuccessMessage(message) {
  const successMessage = document.createElement("div");
  successMessage.textContent = message;
  Object.assign(successMessage.style, {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
    padding: "1rem",
    borderRadius: "5px",
    margin: "1rem 0",
    textAlign: "center",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  });

  successful.appendChild(successMessage);
  setTimeout(() => {
    successful.removeChild(successMessage);
  }, 2000);
}

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});

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
      const month = date.getMonth();
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
  monthInput.id = "monthInput"; // Add an id for easier access
  dashboardContent.appendChild(monthInput);

  const findButton = document.createElement("button");
  findButton.textContent = "Find";
  findButton.style.backgroundColor = "blue";
  findButton.style.color = "white";
  findButton.style.width = "5rem";
  findButton.onclick = function () {
    const selectedMonth = document.getElementById("monthInput").value;
    targetYear = parseInt(selectedMonth.split("-")[0]);
    targetMonth = parseInt(selectedMonth.split("-")[1]);
    generateExpenseChart();
  };

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
  searchesStatusDiv.appendChild(searchesInfoDiv);
  searchesDiv.appendChild(searchesStatusDiv);

  analyseDiv.appendChild(totalBalance);
  analyseDiv.appendChild(salesDiv);
  analyseDiv.appendChild(visitsDiv);
  analyseDiv.appendChild(searchesDiv);

  dashboardContent.appendChild(analyseDiv);

  const newUsersDiv = document.createElement("div");
  newUsersDiv.classList.add("new-users");
  newUsersDiv.innerHTML =
    "<h2>Report for Month</h2><canvas id='expenseChart'></canvas>";
  dashboardContent.appendChild(newUsersDiv);

  generateExpenseChart();
}

// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .querySelector("a[onclick='createDashboard()']")
//     .addEventListener("click", Dashboard);
// });

async function displayIncome() {
  await fetchAllIncome();
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = ""; // Clear previous content

  // Add "Add Income" button
  const addBtn = document.createElement("button");
  addBtn.id = "addIncome";
  addBtn.textContent = "Add Income";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.onclick = () => {
    createIncomeForm();
  };
  addBtn.style.fontWeight = "bold";
  mainContainer.appendChild(addBtn);

  const listContainer = document.createElement("div");
  listContainer.style.marginTop = "20px";
  listContainer.style.display = "flex";
  listContainer.style.flexDirection = "column";
  listContainer.style.gap = "10px";

  incomeData.forEach((income) => {
    const itemContainer = document.createElement("div");
    itemContainer.style.border = "1px solid black";
    itemContainer.style.padding = "10px";
    itemContainer.style.borderRadius = "5px";
    itemContainer.style.display = "flex";
    itemContainer.style.justifyContent = "space-between";
    itemContainer.style.alignItems = "center";

    const infoContainer = document.createElement("div");
    for (const key in income) {
      if (
        Object.hasOwnProperty.call(income, key) &&
        key !== "userId" &&
        key !== "incomeId"
      ) {
        const infoItem = document.createElement("div");
        infoItem.style.marginBottom = "5px";
        infoItem.style.fontSize = "15px";
        infoItem.style.fontWeight = "bold";
        if (key == "incomeDate") {
          const timestamp = income[key];
          const date = new Date(timestamp);
          infoItem.textContent = `${key
            .replace("_", " ")
            .toUpperCase()}: ${date.toDateString()}`;
        } else {
          infoItem.textContent = `${key.replace("_", " ").toUpperCase()}: ${
            income[key]
          }`;
        }

        infoContainer.appendChild(infoItem);
      }
    }

    itemContainer.appendChild(infoContainer);

    const actionsContainer = document.createElement("div");
    actionsContainer.style.display = "flex";
    actionsContainer.style.gap = "10px";

    // Edit icon
    const editIcon = document.createElement("span");
    editIcon.classList.add("material-icons-sharp");
    editIcon.textContent = "edit";
    editIcon.style.color = "#6C9BCF";
    editIcon.style.cursor = "pointer";
    editIcon.onclick = function () {
      createIncomeForm();
      editRecord = income.incomeId;
    };
    actionsContainer.appendChild(editIcon);

    // Delete icon
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-icons-sharp");
    deleteIcon.textContent = "delete";
    deleteIcon.style.color = "#FF0060";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.onclick = function () {
      deleteIncome(income.incomeId);
    };
    actionsContainer.appendChild(deleteIcon);

    itemContainer.appendChild(actionsContainer);
    listContainer.appendChild(itemContainer);
  });

  mainContainer.appendChild(listContainer);
}

function createIncomeForm() {
  const mainContainer = document.getElementById("dashboard-content");
  const formElements = [
    {
      type: "input",
      inputType: "text",
      name: "income_category",
      labelText: "Income Category:",
    },
    {
      type: "input",
      inputType: "text",
      name: "income_description",
      labelText: "Income Description:",
    },
    {
      type: "input",
      inputType: "date",
      name: "income_date",
      labelText: "Income Date:",
    },
    {
      type: "input",
      inputType: "number",
      name: "income_amount",
      labelText: "Income Amount:",
    },
    { type: "input", inputType: "submit", name: "addIncome" },
  ];

  const formContainer = document.createElement("div");
  formContainer.classList.add("income-form-container"); // New class

  const form = document.createElement("form");
  form.id = "addIncomeForm";
  form.classList.add("income-form"); // New class

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
    fetch(
      `https://save-it.projects.bbdgrad.com/api/getIncomeById/${editRecord}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 204) {
          return;
        } else if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementsByName("income_category")[0].value =
          data.income_category;
        document.getElementsByName("income_description")[0].value =
          data.income_description;
        document.getElementsByName("income_date")[0].value = data.income_date;
        document.getElementsByName("income_amount")[0].value =
          data.income_amount;
        form.elements["addIncome"].value = "Update Income"; // Update submit button text
        editRecord = data.incomeId;
        console.log("Editing income with ID:", editRecord);
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
        income_category: formData.get("income_category"),
        income_description: formData.get("income_description"),
        income_date: formData.get("income_date"),
        income_amount: formData.get("income_amount"),
        userId: userId,
        incomeId: editRecord,
      };
    } else {
      bodyData = {
        income_category: formData.get("income_category"),
        income_description: formData.get("income_description"),
        income_date: formData.get("income_date"),
        income_amount: formData.get("income_amount"),
        userId: userId,
      };
    }
    fetch(
      editRecord
        ? "https://save-it.projects.bbdgrad.com/api/updateIncome"
        : "https://save-it.projects.bbdgrad.com/api/addIncome",
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
        window.alert(editRecord ? "Updated Income" : "Added Income");
      })
      .catch((error) => {
        console.error("Error:", error);
        window.alert("An error occurred. Please try again later.");
      });
    createDashboard();
  });
}
function deleteIncome(incomeId) {
  if (window.confirm("Do you want to delete?")) {
    fetch(`https://save-it.projects.bbdgrad.com/api/deleteIncome/${incomeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    window.alert("deleted");
  }
  console.log("Deleting income with ID:", incomeId);
}

async function displayExpense() {
  await fetchAllExpense();
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = ""; // Clear previous content

  const addBtn = document.createElement("button");
  addBtn.id = "addData";
  addBtn.textContent = "Add Expense";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.onclick = () => {
    createxpenseForm((id = null));
  };
  addBtn.style.fontWeight = "bold";
  mainContainer.appendChild(addBtn);

  const listContainer = document.createElement("ul");
  listContainer.style.marginTop = "20px";
  listContainer.style.listStyleType = "none";
  listContainer.style.padding = "0";

  expenseData.forEach((expense) => {
    const listItem = document.createElement("li");
    listItem.style.border = "1px solid black";
    listItem.style.padding = "10px";
    listItem.style.borderRadius = "5px";
    listItem.style.marginBottom = "10px";
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";

    const expenseInfo = document.createElement("div");
    for (const key in expense) {
      if (Object.hasOwnProperty.call(expense, key) && key !== "userId") {
        const item = document.createElement("div");
        item.style.marginBottom = "5px";
        if (key == "expenseCategory") {
          expenseAllCategory.map((v) => {
            if (v.expenseCategoryId == expense[key]) {
              item.textContent =
                key.toUpperCase() + ": " + v.expenseCategoryName;
            }
          });
        } else if (key == "expenseId") {
          item.textContent = "";
        } else if (key == "spendDate") {
          const date = new Date(expense[key]);
          item.textContent = key.toUpperCase() + ": " + date.toDateString();
        } else {
          item.textContent = key.toUpperCase() + ": " + expense[key];
        }
        expenseInfo.appendChild(item);
      }
    }

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "10px";

    const editIcon = document.createElement("span");
    editIcon.classList.add("material-icons-sharp");
    editIcon.textContent = "edit";
    editIcon.style.color = "#6C9BCF";
    editIcon.style.cursor = "pointer";
    editIcon.onclick = function () {
      createxpenseForm(expense.expenseId);
    };
    actions.appendChild(editIcon);

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-icons-sharp");
    deleteIcon.textContent = "delete";
    deleteIcon.style.color = "#FF0060";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.onclick = function () {
      deleteExpense(expense.expenseId);
    };
    actions.appendChild(deleteIcon);

    listItem.appendChild(expenseInfo);
    listItem.appendChild(actions);

    listContainer.appendChild(listItem);
  });

  mainContainer.appendChild(listContainer);
}

function createxpenseForm(id) {
  const mainContainer = document.getElementById("dashboard-content");
  const formElements = [
    {
      type: "input",
      inputType: "text",
      name: "expenseDescription",
      labelText: "Description:",
    },
    {
      type: "input",
      inputType: "date",
      name: "spendDate",
      labelText: "Spend Date:",
    },
    {
      type: "input",
      inputType: "number",
      name: "amountSpend",
      labelText: "AmountSpend:",
    },
    {
      type: "input",
      inputType: "select",
      name: "expenseCategory",
      labelText: "Category:",
    },
    {
      type: "input",
      inputType: "submit",
      name: "addExpense",
      value: "Add Expense",
    },
  ];

  const formContainer = document.createElement("div");
  formContainer.classList.add("expense-form-container"); // New class

  const form = document.createElement("form");
  form.id = "addExpenseForm";
  form.classList.add("expense-form"); // New class

  formElements.forEach((element) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = element.labelText;
    label.classList.add("form-label"); // New class
    formGroup.appendChild(label);
    if (element.name == "expenseCategory") {
      console.log("expenseAllCategory", expenseAllCategory);
      const expenseCategorySelect = document.createElement("select");
      expenseCategorySelect.id = "expenseCategory";
      expenseCategorySelect.name = "expenseCategory";
      expenseCategorySelect.required = true;
      expenseAllCategory?.map((expenseCategoryItem) => {
        const option = document.createElement("option");
        option.value = expenseCategoryItem.expenseCategoryId;
        option.textContent = expenseCategoryItem.expenseCategoryName;
        expenseCategorySelect.appendChild(option);
        expenseCategorySelect.type = element.inputType;
        expenseCategorySelect.name = element.name;
        expenseCategorySelect.id = element.name;
        expenseCategorySelect.required = true;
        expenseCategorySelect.classList.add("form-control"); // New class
        formGroup.appendChild(expenseCategorySelect);
      });
    } else {
      const input = document.createElement("input");
      input.type = element.inputType;
      input.name = element.name;
      input.id = element.name;
      input.required = true;
      input.classList.add("form-control"); // New class
      formGroup.appendChild(input);
    }
    form.appendChild(formGroup);
  });

  if (id != null) {
    console.log(id);
    fetch(`https://save-it.projects.bbdgrad.com/api/getExpenseById/${id}`, {
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
        document.getElementsByName("expenseDescription")[0].value =
          data.expenseDescription;
        document.getElementsByName("spendDate")[0].value = data.spendDate;
        document.getElementsByName("amountSpend")[0].value = data.amountSpend;
        document.getElementsByName("expenseCategory")[0].value =
          data.expenseCategory;
        form.elements["addExpense"].name = "Update Expense"; // Update submit button text
        id = data.expenseId;
        console.log("Editing expense with ID:", id);
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
    if (id) {
      bodyData = {
        expenseDescription: formData.get("expenseDescription"),
        spendDate: formData.get("spendDate"),
        amountSpend: formData.get("amountSpend"),
        userId: userId,
        expenseCategory: formData.get("expenseCategory"),
        expenseId: id,
      };
    } else {
      bodyData = {
        expenseDescription: formData.get("expenseDescription"),
        spendDate: formData.get("spendDate"),
        amountSpend: formData.get("amountSpend"),
        userId: userId,
        expenseCategory: formData.get("expenseCategory"),
      };
    }
    fetch(
      id
        ? "https://save-it.projects.bbdgrad.com/api/updateExpense"
        : "https://save-it.projects.bbdgrad.com/api/addExpense",
      {
        method: id ? "PUT" : "POST",
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
        setTimeout(() => {
          window.alert(id ? "Updated Expense" : "Added Expense");
          displayExpense();
        }, 500);
      })
      .catch((error) => {
        console.error("Error:", error);
        window.alert("An error occurred. Please try again later.");
      });
  });
}

function deleteExpense(expenseId) {
  if (window.confirm("Do you want to Delete?")) {
    fetch(
      `https://save-it.projects.bbdgrad.com/api/deleteExpense/${expenseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    window.alert("deleted");
    displayExpense();
  }
  console.log("Deleting expense with ID:", expenseId);
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

function displayBudget() {
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = ""; // Clear previous content

  // Add "Create Budget" button
  const addBtn = document.createElement("button");
  addBtn.id = "addBudget";
  addBtn.textContent = "Create Budget";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.onclick = () => {
    createBudgetForm();
  };
  addBtn.style.fontWeight = "bold";
  mainContainer.appendChild(addBtn);

  fetch(
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
      const listContainer = document.createElement("div");
      listContainer.style.marginTop = "20px";
      listContainer.style.display = "flex";
      listContainer.style.flexDirection = "column";
      listContainer.style.gap = "10px";

      data.forEach((budget) => {
        const itemContainer = document.createElement("div");
        itemContainer.style.border = "1px solid black";
        itemContainer.style.padding = "10px";
        itemContainer.style.borderRadius = "5px";
        itemContainer.style.display = "flex";
        itemContainer.style.justifyContent = "space-between";
        itemContainer.style.alignItems = "center";

        const infoContainer = document.createElement("div");
        for (const key in budget) {
          if (Object.hasOwnProperty.call(budget, key) && key !== "user_id") {
            const infoItem = document.createElement("div");
            infoItem.style.marginBottom = "5px";
            infoItem.style.fontSize = "15px";
            infoItem.style.fontWeight = "bold";

            if (key == "start_date" || key == "end_date") {
              const timestamp = budget[key];
              const date = new Date(timestamp);
              infoItem.textContent = `${key
                .replace("_", " ")
                .toUpperCase()}: ${date.toDateString()}`;
            } else {
              infoItem.textContent = `${key.replace("_", " ").toUpperCase()}: ${
                budget[key]
              }`;
            }

            infoContainer.appendChild(infoItem);
          }
        }

        // Display category
        const categoryItem = document.createElement("div");
        categoryItem.style.marginBottom = "5px";
        categoryItem.style.fontSize = "15px";
        categoryItem.style.fontWeight = "bold";
        categoryItem.textContent = `CATEGORY: ${budget.budget_category}`;
        infoContainer.appendChild(categoryItem);

        // Progress bar
        const progressContainer = document.createElement("div");
        progressContainer.style.width = "100%";
        progressContainer.style.height = "8px";
        progressContainer.style.backgroundColor = "#f0f0f0";
        progressContainer.style.borderRadius = "5px";

        const progressBar = document.createElement("div");
        const percentage = (budget.amount_spent / budget.amount) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.style.height = "80%";
        progressBar.style.backgroundColor = "green";
        progressBar.style.borderRadius = "5px";

        progressContainer.appendChild(progressBar);
        infoContainer.appendChild(progressContainer);

        itemContainer.appendChild(infoContainer);

        const actionsContainer = document.createElement("div");
        actionsContainer.style.display = "flex";
        actionsContainer.style.gap = "10px";

        // Edit icon
        const editIcon = document.createElement("span");
        editIcon.classList.add("material-icons-sharp");
        editIcon.textContent = "edit";
        editIcon.style.color = "#6C9BCF";
        editIcon.style.cursor = "pointer";
        editIcon.onclick = function () {
          createBudgetForm();
          editRecord = budget.budget_id;
        };
        actionsContainer.appendChild(editIcon);

        // Delete icon
        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("material-icons-sharp");
        deleteIcon.textContent = "delete";
        deleteIcon.style.color = "#FF0060";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.onclick = function () {
          deleteBudget(budget.budget_id);
        };
        actionsContainer.appendChild(deleteIcon);

        itemContainer.appendChild(actionsContainer);
        listContainer.appendChild(itemContainer);
      });

      mainContainer.appendChild(listContainer);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function createBudgetForm(id) {
  const mainContainer = document.getElementById("dashboard-content");
  const formElements = [
    {
      type: "input",
      inputType: "number",
      name: "budget_category_id",
      labelText: "Category:",
    },
    {
      type: "input",
      inputType: "number",
      name: "amount",
      labelText: "Amount:",
    },
    {
      type: "input",
      inputType: "date",
      name: "start_date",
      labelText: "Start Date:",
    },
    {
      type: "input",
      inputType: "date",
      name: "end_date",
      labelText: "End Date:",
    },
    {
      type: "input",
      inputType: "text",
      name: "budget_description",
      labelText: "Description:",
    },
    {
      type: "input",
      inputType: "submit",
      name: "addBudget",
      value: "Add Budget",
    },
  ];

  const formContainer = document.createElement("div");
  formContainer.classList.add("budget-form-container"); // New class

  const form = document.createElement("form");
  form.id = "addBudgetForm";
  form.classList.add("budget-form"); // New class

  formElements.forEach((element) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = element.labelText;
    label.classList.add("form-label"); // New class
    formGroup.appendChild(label);
    if (element.name == "budget_category_id") {
      console.log("budgetAllCategory", budgetAllCategory);
      const budgetCategorySelect = document.createElement("select");
      budgetCategorySelect.id = "budgetCategory";
      budgetCategorySelect.name = "budget_category_id";
      budgetCategorySelect.required = true;
      budgetAllCategory?.map((budgetCategoryItem) => {
        const option = document.createElement("option");
        option.value = budgetCategoryItem.budgetCategoryId;
        option.textContent = budgetCategoryItem.budgetCategoryName;
        budgetCategorySelect.appendChild(option);
        budgetCategorySelect.type = element.inputType;
        budgetCategorySelect.name = element.name;
        budgetCategorySelect.id = element.name;
        budgetCategorySelect.required = true;
        budgetCategorySelect.classList.add("form-control"); // New class
        formGroup.appendChild(budgetCategorySelect);
      });
    } else {
      const input = document.createElement("input");
      input.type = element.inputType;
      input.name = element.name;
      input.id = element.name;
      input.required = true;
      input.classList.add("form-control"); // New class
      formGroup.appendChild(input);
    }
    form.appendChild(formGroup);
  });

  if (id != null) {
    console.log(id);
    fetch(`https://save-it.projects.bbdgrad.com/api/getBudgetById/${id}`, {
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
        document.getElementsByName("budget_category_id")[0].value =
          data.budget_category_id;
        document.getElementsByName("amount")[0].value = data.amount;
        document.getElementsByName("start_date")[0].value =
          data.start_date.split("T")[0];
        document.getElementsByName("end_date")[0].value =
          data.end_date.split("T")[0];
        document.getElementsByName("budget_description")[0].value =
          data.budget_description;
        form.elements["addBudget"].name = "Update Budget"; // Update submit button text
        id = data.budget_id;
        console.log("Editing budget with ID:", id);
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
    if (id) {
      bodyData = {
        budget_category_id: formData.get("budget_category_id"),
        amount: formData.get("amount"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        budget_description: formData.get("budget_description"),
        user_id: 8,
        budget_id: id,
      };
    } else {
      bodyData = {
        budget_category_id: formData.get("budget_category_id"),
        amount: formData.get("amount"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        budget_description: formData.get("budget_description"),
        user_id: 8,
      };
    }
    fetch(
      id
        ? "https://save-it.projects.bbdgrad.com/api/updateBudget"
        : "https://save-it.projects.bbdgrad.com/api/addBudget",
      {
        method: id ? "PUT" : "POST",
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
        // return response;
      })
      .then((data) => {
        setTimeout(() => {
          window.alert(id ? "Updated Budget" : "Added Budget");
          displayBudget();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error:", error);
        window.alert("An error occurred. Please try again later.");
      });
  });
}

function deleteBudget(budgetId) {
  if (window.confirm("Do you want to Delete?")) {
    fetch(`https://save-it.projects.bbdgrad.com/api/deleteBudget/${budgetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    window.alert("deleted");
    displayBudget();
  }
  console.log("Deleting budget with ID:", budgetId);
}

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

        // Edit and delete buttons container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";

        // Edit icon
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
        window.alert(editRecord ? "Updated Goal" : "Added Goal");
      })
      .catch((error) => {
        console.error("Error:", error);
        window.alert("An error occurred. Please try again later.");
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
    window.alert("deleted");
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
