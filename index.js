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
let expenseData = [];
let incomeData = [];
let budgetData = [];
let totalExpense = 0;
let totalIncome = 0;
let totalBudget = 0;
let editRecord = null;
const darkMode = document.querySelector(".dark-mode");
let expenseAllCategory = [];
let budgetAllCategory = [];
let access_token = localStorage.getItem("authInfo");
let graphData = [{}];
let month = "Apr";

window.onload = async function () {
  if (access_token == null) {
    const mainContainer = document.getElementById("dashboard-content");
    const addBtn = document.createElement("button");
    addBtn.id = "login";
    addBtn.textContent = "Login";
    addBtn.style.color = "white";
    addBtn.style.backgroundColor = "green";
    addBtn.style.height = "5rem";
    addBtn.style.width = "15rem";
    addBtn.style.margin = "10rem";
    addBtn.onclick = () => {
      SignIn();
    };
    addBtn.style.fontWeight = "bold";
    mainContainer.replaceChildren(addBtn);
  } else {
    await createDashboard();
  }
};

async function fetchAllExpense() {
  await fetch("http://52.50.239.63:8080/getExpensesByUserId/8")
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
  await fetch("http://52.50.239.63:8080/getIncomeByUserId/8")
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
  await fetch("http://52.50.239.63:8080/getBudgetByUserId/8")
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
      "http://52.50.239.63:8080/getExpenseCategories"
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

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});

function generateExpenseChart() {
  fetch("http://52.50.239.63:8080/getExpensesByUserId/8")
    .then((response) => {
      if (response.status === 204) {
        return [];
      } else if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let graphData = [];

      expenseAllCategory.forEach((category) => {
        let key = category.expenseCategoryName;
        let obj = { [key]: 0 };
        graphData.push(obj);
      });
      expenseAllCategory.forEach((category) => {
        let count = 0;
        data.forEach((expenseData) => {
          if (expenseData.expenseCategory === category.expenseCategoryId) {
            count++;
          }
        });
        let key = category.expenseCategoryName;
        let existingObjIndex = graphData.findIndex((obj) =>
          obj.hasOwnProperty(key)
        );
        if (existingObjIndex !== -1) {
          graphData[existingObjIndex][key] = count;
        }
      });

      console.log(graphData);

      const labels = [];
      const amounts = [];

      graphData.forEach((expense) => {
        const category = Object.keys(expense)[0];
        const count = Object.values(expense)[0];

        labels.push(category);
        amounts.push(count);
      });

      // Outputting the extracted data
      console.log("Labels:", labels);
      console.log("Amounts:", amounts);

      const ctx = document.getElementById("expenseChart").getContext("2d");
      const expenseChart = new Chart(ctx, {
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
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
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
    const selectedYear = selectedMonth.split("-")[0];
    const selectedMonthValue = selectedMonth.split("-")[1];
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

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("a[onclick='createDashboard()']")
    .addEventListener("click", Dashboard);
});

async function displayIncome() {
  await fetchAllIncome();
  const mainContainer = document.getElementById("dashboard-content");
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
  mainContainer.replaceChildren(addBtn);

  // Create a table element
  const table = document.createElement("table");
  table.style.marginTop = "20px";
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.overflow = "scroll";
  table.style.border = "2";
  table.style.borderColor = "black";

  // Create the table header
  const headerRow = table.insertRow();
  for (const key in incomeData[0]) {
    if (Object.hasOwnProperty.call(incomeData[0], key) && key !== "userId") {
      const headerCell = document.createElement("th");
      headerCell.textContent = key.toUpperCase();
      headerCell.style.height = "30px";
      headerCell.style.textAlign = "center";
      headerCell.style.fontSize = "15px";
      headerRow.appendChild(headerCell);
    }
  }
  const actionsHeader = document.createElement("th");
  actionsHeader.textContent = "Actions";
  actionsHeader.style.height = "30px";
  actionsHeader.style.textAlign = "center";
  actionsHeader.style.fontSize = "15px";
  headerRow.appendChild(actionsHeader);
  incomeData.forEach((income) => {
    const row = table.insertRow();
    for (const key in income) {
      if (Object.hasOwnProperty.call(income, key) && key !== "userId") {
        const cell = row.insertCell();
        cell.style.height = "30px";
        cell.style.textAlign = "center";
        cell.style.fontSize = "15px";
        cell.style.fontWeight = "15px";
        if (key == "incomeDate") {
          const timestamp = income[key];
          const date = new Date(timestamp);
          cell.textContent = date.toDateString();
        } else {
          cell.textContent = income[key];
        }
      }
    }
    const actionsCell = row.insertCell();
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.backgroundColor = "blue";
    editButton.onclick = function () {
      createIncomeForm();
      editRecord = income.incomeId;
    };
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "red";
    deleteButton.onclick = function () {
      deleteIncome(income.incomeId);
    };
    actionsCell.style.textAlign = "center";
    actionsCell.appendChild(deleteButton);
  });
  mainContainer.appendChild(table);
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
    fetch(`http://52.50.239.63:8080/getIncomeById/${editRecord}`)
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
        userId: 8,
        incomeId: editRecord,
      };
    } else {
      bodyData = {
        income_category: formData.get("income_category"),
        income_description: formData.get("income_description"),
        income_date: formData.get("income_date"),
        income_amount: formData.get("income_amount"),
        userId: 8,
      };
    }
    fetch(
      editRecord
        ? "http://52.50.239.63:8080/updateIncome"
        : "http://52.50.239.63:8080/addIncome",
      {
        method: editRecord ? "PUT" : "POST",
        headers: {
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
    fetch(`http://52.50.239.63:8080/deleteIncome/${incomeId}`, {
      method: "DELETE",
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
  mainContainer.replaceChildren(addBtn);

  // Create a table element
  const table = document.createElement("table");
  table.style.marginTop = "20px";
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.overflow = "scroll";
  table.style.border = "2";
  table.style.borderColor = "black";

  // Create the table header
  const headerRow = table.insertRow();
  for (const key in expenseData[0]) {
    if (Object.hasOwnProperty.call(expenseData[0], key) && key !== "userId") {
      const headerCell = document.createElement("th");
      headerCell.textContent = key.toUpperCase();
      headerCell.style.height = "30px";
      headerCell.style.textAlign = "center";
      headerCell.style.fontSize = "15px";
      headerRow.appendChild(headerCell);
    }
  }
  // Add Actions column header
  const actionsHeader = document.createElement("th");
  actionsHeader.textContent = "Actions";
  actionsHeader.style.height = "30px";
  actionsHeader.style.textAlign = "center";
  actionsHeader.style.fontSize = "15px";
  headerRow.appendChild(actionsHeader);

  // Create and populate the table rows with expense data
  expenseData.forEach((expense) => {
    const row = table.insertRow();
    for (const key in expense) {
      if (Object.hasOwnProperty.call(expense, key) && key !== "userId") {
        const cell = row.insertCell();
        cell.style.height = "30px";
        cell.style.textAlign = "center";
        cell.style.fontSize = "15px";
        cell.style.fontWeight = "15px";
        if (key == "spendDate") {
          const timestamp = expense[key];
          const date = new Date(timestamp);
          cell.textContent = date.toDateString();
        } else {
          if (key === "expenseCategory") {
            expenseAllCategory.map((v) => {
              if (v.expenseCategoryId === expense.expenseCategory) {
                cell.textContent = v.expenseCategoryName;
              }
            });
          } else {
            cell.textContent = expense[key];
          }
        }
      }
    }

    // Add buttons for edit and delete in the Actions column
    const actionsCell = row.insertCell();
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.backgroundColor = "blue";
    editButton.onclick = function () {
      createxpenseForm(expense.expenseId);
    };
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "red";
    deleteButton.onclick = function () {
      deleteExpense(expense.expenseId);
    };
    actionsCell.style.textAlign = "center";
    actionsCell.appendChild(deleteButton);
  });

  // Append the table to the main container
  mainContainer.appendChild(table);
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
    fetch(`http://52.50.239.63:8080/getExpenseById/${id}`)
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
        userId: 8,
        expenseCategory: formData.get("expenseCategory"),
        expenseId: id,
      };
    } else {
      bodyData = {
        expenseDescription: formData.get("expenseDescription"),
        spendDate: formData.get("spendDate"),
        amountSpend: formData.get("amountSpend"),
        userId: 8,
        expenseCategory: formData.get("expenseCategory"),
      };
    }
    fetch(
      id
        ? "http://52.50.239.63:8080/updateExpense"
        : "http://52.50.239.63:8080/addExpense",
      {
        method: id ? "PUT" : "POST",
        headers: {
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
    fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
      method: "DELETE",
    })
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
      "http://52.50.239.63:8080/getBudgetCategories"
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
  const addBtn = document.createElement("button");
  addBtn.id = "addBudget";
  addBtn.textContent = "Add Budget";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.onclick = () => {
    createBudgetForm((id = null));
  };
  addBtn.style.fontWeight = "bold";
  mainContainer.replaceChildren(addBtn);

  // Create a table element
  const table = document.createElement("table");
  table.style.marginTop = "20px";
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.overflow = "scroll";
  table.style.border = "2";
  table.style.borderColor = "black";

  // Create the table header
  const headerRow = table.insertRow();
  for (const key in budgetData[0]) {
    if (Object.hasOwnProperty.call(budgetData[0], key) && key !== "userId") {
      const headerCell = document.createElement("th");
      headerCell.textContent = key.toUpperCase();
      headerCell.style.height = "30px";
      headerCell.style.textAlign = "center";
      headerCell.style.fontSize = "15px";
      headerRow.appendChild(headerCell);
    }
  }
  // Add Actions column header
  const actionsHeader = document.createElement("th");
  actionsHeader.textContent = "Actions";
  actionsHeader.style.height = "30px";
  actionsHeader.style.textAlign = "center";
  actionsHeader.style.fontSize = "15px";
  headerRow.appendChild(actionsHeader);

  // Create and populate the table rows with budget data
  budgetData.forEach((budget) => {
    const row = table.insertRow();
    for (const key in budget) {
      if (Object.hasOwnProperty.call(budget, key) && key !== "userId") {
        const cell = row.insertCell();
        cell.style.height = "30px";
        cell.style.textAlign = "center";
        cell.style.fontSize = "15px";
        cell.style.fontWeight = "15px";
        if (key == "start_date" || key == "end_date") {
          const timestamp = budget[key];
          const date = new Date(timestamp);
          cell.textContent = date.toDateString();
        } else {
          if (key === "budget_category_id") {
            budgetAllCategory.map((v) => {
              if (v.budgetCategoryId === budget.budget_category_id) {
                cell.textContent = v.budgetCategoryName;
              }
            });
          } else {
            cell.textContent = budget[key];
          }
        }
      }
    }

    // Add buttons for edit and delete in the Actions column
    const actionsCell = row.insertCell();
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.backgroundColor = "blue";
    editButton.onclick = function () {
      createBudgetForm(budget.budget_id);
    };
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "red";
    deleteButton.onclick = function () {
      deleteBudget(budget.budget_id);
    };
    actionsCell.style.textAlign = "center";
    actionsCell.appendChild(deleteButton);
  });

  // Append the table to the main container
  mainContainer.appendChild(table);
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
    fetch(`http://52.50.239.63:8080/getBudgetById/${id}`)
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
        ? "http://52.50.239.63:8080/updateBudget"
        : "http://52.50.239.63:8080/addBudget",
      {
        method: id ? "PUT" : "POST",
        headers: {
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
    fetch(`http://52.50.239.63:8080/deleteBudget/${budgetId}`, {
      method: "DELETE",
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
  const addBtn = document.createElement("button");
  addBtn.id = "addGoal";
  addBtn.textContent = "Add Goal";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.onclick = () => {
    createGoalForm();
  };
  addBtn.style.fontWeight = "bold";
  mainContainer.replaceChildren(addBtn);

  fetch("http://52.50.239.63:8080/getGoalByUserId/8")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Create a table element
      const table = document.createElement("table");
      table.style.marginTop = "20px";
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";
      table.style.overflow = "scroll";
      table.style.border = "2";
      table.style.borderColor = "black";

      // Create the table header
      const headerRow = table.insertRow();
      for (const key in data[0]) {
        if (Object.hasOwnProperty.call(data[0], key) && key !== "user_id") {
          const headerCell = document.createElement("th");
          headerCell.textContent = key.toUpperCase();
          headerCell.style.height = "30px";
          headerCell.style.textAlign = "center";
          headerCell.style.fontSize = "15px";
          headerRow.appendChild(headerCell);
        }
      }
      // Add Actions column header
      const actionsHeader = document.createElement("th");
      actionsHeader.textContent = "Actions";
      actionsHeader.style.height = "30px";
      actionsHeader.style.textAlign = "center";
      actionsHeader.style.fontSize = "15px";
      headerRow.appendChild(actionsHeader);

      // Create and populate the table rows with goal data
      data.forEach((goal) => {
        const row = table.insertRow();
        for (const key in goal) {
          if (Object.hasOwnProperty.call(goal, key) && key !== "user_id") {
            const cell = row.insertCell();
            cell.style.height = "30px";
            cell.style.textAlign = "center";
            cell.style.fontSize = "15px";
            cell.style.fontWeight = "15px";
            if (key == "desired_date") {
              const timestamp = goal[key];
              const date = new Date(timestamp);
              cell.textContent = date.toDateString();
            } else {
              cell.textContent = goal[key];
            }
          }
        }

        // Add buttons for edit and delete in the Actions column
        const actionsCell = row.insertCell();
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.backgroundColor = "blue";
        editButton.onclick = function () {
          createGoalForm();
          editRecord = goal.goal_id;
        };
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.backgroundColor = "red";
        deleteButton.onclick = function () {
          deleteGoal(goal.goal_id);
        };
        actionsCell.style.textAlign = "center";
        actionsCell.appendChild(deleteButton);
      });

      // Append the table to the main container
      mainContainer.appendChild(table);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function createGoalForm() {
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
  form.id = "addGoalForm";
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
    fetch(`http://52.50.239.63:8080/getGoalById/${goalId}`)
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
        form.elements["addGoal"].value = "Update Goal"; // Update submit button text
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
        ? "http://52.50.239.63:8080/updateGoal"
        : "http://52.50.239.63:8080/addGoal",
      {
        method: editRecord ? "PUT" : "POST",
        headers: {
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
    fetch(`http://52.50.239.63:8080/deleteGoal/${goalId}`, {
      method: "DELETE",
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

function SignIn() {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  let params = {
    client_id:
      "768762679937-1b30jk5c9v58cc3rok3pkcab5og53kjg.apps.googleusercontent.com",
    redirect_uri: "http://127.0.0.1:5500/index.html",
    response_type: "token",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);

  form.submit();
}
