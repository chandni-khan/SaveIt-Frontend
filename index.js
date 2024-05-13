const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const expenseListItem = document.querySelector('a[data-action="expense"]');
expenseListItem.addEventListener("click", displayExpense);
const darkMode = document.querySelector('.dark-mode');
let totalExpense=0
let totalIncome=0
let totalBudget=0

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

    analyseDiv.appendChild(salesDiv);
    analyseDiv.appendChild(visitsDiv);
    analyseDiv.appendChild(searchesDiv);

    dashboardContent.appendChild(analyseDiv);

    const newUsersDiv = document.createElement("div");
    newUsersDiv.classList.add("new-users");
    newUsersDiv.innerHTML = "<h2>Report</h2><div class='user-list'></div>";
    dashboardContent.appendChild(newUsersDiv);
}

async function getTotalExpenses() {
    try {
      const response = await fetch('http://52.50.239.63:8080/getExpensesByUserId/8');
  
      if (response.status === 204) {
        console.log('No expenses found for user ID 8.');
        return 0;
      } else if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
  
      const data = await response.json();
      const totalAmount = data.reduce((acc, expense) => acc + expense.amountSpend, 0);
      return totalAmount;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return 0; 
    }
  }

    getTotalExpenses()
        .then(totalAmount => {
            totalExpense=totalAmount;
        return totalAmount;
        })
        .catch(error => {
        console.error('Error getting total Income:', error);
        });

async function getTotalIncome() {
        try {
          const response = await fetch('http://52.50.239.63:8080/getIncomeByUserId/8');
      
          if (response.status === 204) {
            console.log('No Income found for user ID 8.');
            return 0;
          } else if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
      
          const data = await response.json();
          const totalAmount = data.reduce((acc, income) => acc + income.incomeAmount, 0);
          return totalAmount;
        } catch (error) {
          console.error('Error fetching Income:', error);
          return 0; 
        }
      }
    
    getTotalIncome()
        .then(totalAmount => {
            totalIncome=totalAmount;
         return totalAmount;
        })
        .catch(error => {
          console.error('Error getting total expenses:', error);
        });
    
async function getTotalBudget() {
            try {
              const response = await fetch('http://52.50.239.63:8080/getBudgetByUserId/8');
          
              if (response.status === 204) {
                console.log('No Budget found for user ID 8.');
                return 0;
              } else if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
              }
          
              const data = await response.json();
              const totalAmount = data.reduce((acc, budget) => acc + budget.amount, 0);
              return totalAmount;
            } catch (error) {
              console.error('Error fetching Budget:', error);
              return 0; 
            }
          }
        
        getTotalBudget()
            .then(totalAmount => {
                totalBudget=totalAmount;
             return totalAmount;
            })
            .catch(error => {
              console.error('Error getting total expenses:', error);
            });





document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("a[onclick='createDashboard()']").addEventListener("click", Dashboard);
});

function displayExpense()
{
    const mainContainer = document.getElementById("dashboard-content");
    const addBtn = document.createElement("button");
    addBtn.id="addData";
    addBtn.textContent = "Add Expense";
    addBtn.style.color="green";
    addBtn.style.height="30px";
    addBtn.style.width="100px";
    addBtn.onclick=()=>{
        createxpenseForm(id=null);
    }
    addBtn.style.fontWeight="bold";
    mainContainer.replaceChildren(addBtn);

    fetch('http://52.50.239.63:8080/getExpensesByUserId/8')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Create a table element
            const table = document.createElement("table");
            table.style.marginTop="20px"
            table.style.borderCollapse = "collapse";
            table.style.width = "100%";
            table.style.overflow="scroll"
            table.style.border = "2";
            table.style.borderColor="black";

            // Create the table header
            const headerRow = table.insertRow();
            for (const key in data[0]) {
                if (Object.hasOwnProperty.call(data[0], key)&& key !== "userId") {
                    const headerCell = document.createElement("th");
                    headerCell.textContent = key.toUpperCase();
                    headerCell.style.height="30px";
                    headerCell.style.textAlign="center"
                    headerCell.style.fontSize="15px";
                    headerRow.appendChild(headerCell);
                }
            }
            // Add Actions column header
            const actionsHeader = document.createElement("th");
            actionsHeader.textContent = "Actions";
            actionsHeader.style.height="30px";
            actionsHeader.style.textAlign="center"
            actionsHeader.style.fontSize="15px";
            headerRow.appendChild(actionsHeader);

            // Create and populate the table rows with expense data
            data.forEach(expense => {
                const row = table.insertRow();
                for (const key in expense) {
                    if (Object.hasOwnProperty.call(expense, key)&& key !== "userId") {
                        const cell = row.insertCell();
                        cell.style.height="30px";
                        cell.style.textAlign="center"
                        cell.style.fontSize="15px";
                        cell.style.fontWeight="15px";
                        if(key == "spendDate"){
                            const timestamp = expense[key];
                            const date = new Date(timestamp)
                            cell.textContent = date.toDateString();
                        }else{
                            cell.textContent = expense[key];
                        }
                    }
                }

                // Add buttons for edit and delete in the Actions column
                const actionsCell = row.insertCell();
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.style.backgroundColor="blue";
                editButton.onclick = function () {
                    createxpenseForm(expense.expenseId);
                };
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.style.backgroundColor="red";
                deleteButton.onclick = function () {
                    deleteExpense(expense.expenseId)
                };
                actionsCell.style.textAlign="center";
                actionsCell.appendChild(deleteButton);
            });

            // Append the table to the main container
            mainContainer.appendChild(table);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function createxpenseForm(id) {
    const mainContainer = document.getElementById("dashboard-content");
    const formElements = [
      { type: 'input', inputType: 'text', name: 'expenseDescription', labelText: 'Description:' },
      { type: 'input', inputType: 'date', name: 'spendDate', labelText: 'Spend Date:' },
      { type: 'input', inputType: 'number', name: 'amountSpend', labelText: 'AmountSpend:' },
      { type: 'input', inputType: 'number', name: 'expenseCategory', labelText: 'Category:' },
      { type: 'input', inputType: 'submit', name: 'addExpense' ,value:"Add Expense"}    
    ];
  
    const formContainer = document.createElement('div');
    formContainer.classList.add('expense-form-container'); // New class
  
    const form = document.createElement('form');
    form.id = 'addExpenseForm';
    form.classList.add('expense-form'); // New class
  
    formElements.forEach(element => {
      const formGroup = document.createElement('div');
      formGroup.classList.add('form-group');
  
      const label = document.createElement('label');
      label.textContent = element.labelText;
      label.classList.add('form-label'); // New class
      formGroup.appendChild(label);
  
      const input = document.createElement('input');
      input.type = element.inputType;
      input.name = element.name;
      input.id = element.name;
      input.required = true;
      input.classList.add('form-control'); // New class
      formGroup.appendChild(input);
      form.appendChild(formGroup);
    });
    
    if(id!=null){
      console.log(id);
        fetch(`http://52.50.239.63:8080/getExpenseById/${id}`)
        .then(response => {
            if (response.status === 204) {
                return;
            } else if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            document.getElementsByName("expenseDescription")[0].value = data.expenseDescription;
            document.getElementsByName("spendDate")[0].value = data.spendDate;
            document.getElementsByName("amountSpend")[0].value = data.amountSpend;
            document.getElementsByName("expenseCategory")[0].value = data.expenseCategory;
            form.elements["addExpense"].name = "Update Expense"; // Update submit button text
            id = data.expenseId;
            console.log("Editing expense with ID:", id);
          }).catch(e => {
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
                "expenseDescription": formData.get("expenseDescription"),
                "spendDate": formData.get("spendDate"),
                "amountSpend": formData.get("amountSpend"),
                "userId": 8,
                "expenseCategory": formData.get("expenseCategory"),
                "expenseId": id
            };
        } else {
            bodyData = {
                "expenseDescription": formData.get("expenseDescription"),
                "spendDate": formData.get("spendDate"),
                "amountSpend": formData.get("amountSpend"),
                "userId": 8,
                "expenseCategory": formData.get("expenseCategory")
            };
        }
        fetch(id ? "http://52.50.239.63:8080/updateExpense" : "http://52.50.239.63:8080/addExpense", {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .then(data => {
                setTimeout(()=>{
                  window.alert(id ? "Updated Expense" : "Added Expense");
                  displayExpense();
                },1000)
            })
            .catch(error => {
                console.error("Error:", error);
                window.alert("An error occurred. Please try again later.");
            });
    });
  }

function deleteExpense(expenseId) {
if(window.confirm("Do you want to Delete?")){
    fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .catch(error => console.error("Error:", error));
    window.alert("deleted");
    displayExpense();
}
 console.log("Deleting expense with ID:", expenseId);
}


  


