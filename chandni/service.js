// let editRecord = undefined;

// window.addEventListener("load", function() {
//     // Fetch expenses and populate the table
//     fetchExpenses();
// });

// document.getElementById("addExpenseForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const formData = new FormData(this);
//     let bodyData = {};
//     if (editRecord) {
//         bodyData = {
//             "expenseDescription": formData.get("expenseDescription"),
//             "spendDate": formData.get("spendDate"),
//             "amountSpend": formData.get("amountSpend"),
//             "userId": formData.get("userId"),
//             "expenseCategory": formData.get("expenseCategory"),
//             "expenseId": editRecord
//         }
//     } else {
//         bodyData = {
//             "expenseDescription": formData.get("expenseDescription"),
//             "spendDate": formData.get("spendDate"),
//             "amountSpend": formData.get("amountSpend"),
//             "userId": formData.get("userId"),
//             "expenseCategory": formData.get("expenseCategory")
//         }
//     }
//     fetch(editRecord ? "http://52.50.239.63:8080/updateExpense" : "http://52.50.239.63:8080/addExpense", {
//             method: editRecord ? "PUT" : "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(bodyData)
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response;
//         })
//         .then(data => {
//             console.log("Data received:", data);
//             resetForm();
//             window.alert(editRecord ? "Updated Expense" : "Added Expense");
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             window.alert("An error occurred. Please try again later.");
//         });
// });

// // Function to fetch expenses and populate the table
// function fetchExpenses() {
//     fetch('http://52.50.239.63:8080/getExpensesByUserId/8')
//         .then(response => {
//             if (response.status === 204) {
//                 return;
//             } else if (response.status !== 200) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Handle response, e.g., populate expenses in the table
//             const expenseTableBody = document.getElementById("expenseTableBody");
//             expenseTableBody.innerHTML = "";
//             data.forEach(expense => {
//                 const row = `
//                     <tr>
//                         <td>${expense.expenseId}</td>
//                         <td>${expense.expenseDescription}</td>
//                         <td>${expense.spendDate}</td>
//                         <td>${expense.amountSpend}</td>
//                         <td>${expense.userId}</td>
//                         <td>${expense.expenseCategory}</td>
//                         <td>
//                             <button onclick="editExpense(${expense.expenseId})">Edit</button>
//                             <button onclick="deleteExpense(${expense.expenseId})">Delete</button>
//                         </td>
//                     </tr>
//                 `;
//                 expenseTableBody.innerHTML += row;
//             });
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }

// // Function to reset the form
// function resetForm() {
//     document.getElementsByName("expenseDescription").forEach(function(element) {
//         element.value = "";
//     });
//     document.getElementsByName("spendDate").forEach(function(element) {
//         element.value = "";
//     });
//     document.getElementsByName("amountSpend").forEach(function(element) {
//         element.value = "";
//     });
//     document.getElementsByName("userId").forEach(function(element) {
//         element.value = "";
//     });
//     document.getElementsByName("expenseCategory").forEach(function(element) {
//         element.value = "";
//     });

//     document.getElementsByName("btn").forEach(function(element) {
//         element.value = "Add Expense";
//     });
// }

// // Function to handle editing an expense
// function editExpense(expenseId) {
//     fetch(`http://52.50.239.63:8080/getExpenseById/${expenseId}`)
//         .then(response => {
//             if (response.status === 204) {
//                 return;
//             } else if (response.status !== 200) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         }).then(data => {
//             document.getElementsByName("expenseDescription").forEach(function(element) {
//                 element.value = data.expenseDescription;
//             });
//             document.getElementsByName("spendDate").forEach(function(element) {
//                 element.value = data.spendDate;
//             });
//             document.getElementsByName("amountSpend").forEach(function(element) {
//                 element.value = data.amountSpend;
//             });
//             document.getElementsByName("userId").forEach(function(element) {
//                 element.value = data.userId;
//             });
//             document.getElementsByName("expenseCategory").forEach(function(element) {
//                 element.value = data.expenseCategory;
//             });
//             document.getElementsByName("btn").forEach(function(element) {
//                 element.value = "Update Expense";
//             });
//             editRecord = data.expenseId;
//             console.log("Editing expense with ID:", editRecord);
//         }).catch(e => {
//             console.log("error", e);
//         })
// }

// // Function to handle deleting an expense
// function deleteExpense(expenseId) {
//     fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
//             method: "DELETE",
//         })
//         .then(response => response.json())
//         .catch(error => console.error("Error:", error));
//     console.log("Deleting expense with ID:", expenseId);
// }

const expenseListItem = document.querySelector('a[data-action="expense"]');
expenseListItem.addEventListener("click", displayExpense);

const incomeListItem = document.querySelector('a[data-action="income"]');
incomeListItem.addEventListener("click", displayincome);

const goalListItem = document.querySelector('a[data-action="goal"]');
goalListItem.addEventListener("click", displaygoal);

const budgetListItem = document.querySelector('a[data-action="budget"]');
budgetListItem.addEventListener("click", displaybudget);

const reminderListItem = document.querySelector('a[data-action="reminder"]');
reminderListItem.addEventListener("click", displayreminder);

const profileListItem = document.querySelector('a[data-action="profile"]');
profileListItem.addEventListener("click", displayprofile);

const reportListItem = document.querySelector('a[data-action="report"]');
reportListItem.addEventListener("click", displayreport);

function displayExpense()
{
    const mainContainer = document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "Expense Data";
    mainContainer.replaceChildren(heading);

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
            table.style.overflowY="scroll"
            table.style.height="100%";
            table.border = "1";

            // Create the table header
            const headerRow = table.insertRow();
            for (const key in data[0]) {
                if (Object.hasOwnProperty.call(data[0], key)&& key !== "userId") {
                    const headerCell = document.createElement("th");
                    headerCell.textContent = key;
                    headerCell.style.height="30px";
                    headerCell.style.textAlign="center"
                    headerRow.appendChild(headerCell);
                }
            }
            // Add Actions column header
            const actionsHeader = document.createElement("th");
            actionsHeader.textContent = "Actions";
            headerRow.appendChild(actionsHeader);

            // Create and populate the table rows with expense data
            data.forEach(expense => {
                const row = table.insertRow();
                for (const key in expense) {
                    if (Object.hasOwnProperty.call(expense, key)&& key !== "userId") {
                        const cell = row.insertCell();
                        cell.style.height="30px";
                        cell.style.textAlign="center"
                        cell.textContent = expense[key];
                    }
                }

                // Add buttons for edit and delete in the Actions column
                const actionsCell = row.insertCell();
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.onclick = function () {
                    editExpense(expense.expenseId);
                };
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = function () {
                    deleteExpense(expense.expenseId);
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


function displaybudget()
{
   const mainContainer=document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "This is a Budget";
    mainContainer.replaceChildren(heading);

}
function displayincome()
{
   const mainContainer=document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "This is a Income";
    mainContainer.replaceChildren(heading);
}
function displaygoal()
{
   const mainContainer=document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "This is a Goal";
    mainContainer.replaceChildren(heading);
}
function displayreport()
{
   const mainContainer=document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "This is a Report";
    mainContainer.replaceChildren(heading);
}
function displayreminder()
{
   const mainContainer=document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "This is a Reminder";
    mainContainer.replaceChildren(heading);
}
function displayprofile()
{
   const mainContainer=document.getElementById("main");
    const heading = document.createElement("h1");
    heading.textContent = "This is a Profile";
    mainContainer.replaceChildren(heading);
}
function editExpense(expenseId) {
    fetch(`http://52.50.239.63:8080/getExpenseById/${expenseId}`)
       .then(response => {
           if (response.status === 204) {
               return;
           } else if (response.status !== 200) {
               throw new Error('Network response was not ok');
           }
           return response.json();
       }).then(data=>{
           document.getElementsByName("expenseDescription").forEach(function(element) {
               element.value = data.expenseDescription;
           });
           document.getElementsByName("spendDate").forEach(function(element) {
               element.value = data.spendDate;
           });
           document.getElementsByName("amountSpend").forEach(function(element) {
               element.value = data.amountSpend;
           });
           document.getElementsByName("userId").forEach(function(element) {
               element.value = data.userId;
           });
           document.getElementsByName("expenseCategory").forEach(function(element) {
               element.value = data.expenseCategory;
           });
           document.getElementsByName("btn").forEach(function(element) {
               element.value = "Update Expense";
           });
           editRecord=data.expenseId;
           console.log("Editing expense with ID:",editRecord);
       }).catch(e=>{console.log("error",e);})
   }

   // Function to handle deleting an expense
   function deleteExpense(expenseId) {
       fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
           method: "DELETE",
       })
       .then(response => response.json())
       .catch(error => console.error("Error:", error));
       console.log("Deleting expense with ID:", expenseId);
   }

   let params={};
   let regex=/([^&=]+)=([^&]*)/g, m
    while(m=regex.exec(location.href)){
       params[decodeURIComponent(m[1])]=decodeURIComponent(m[2])
    }
    if(Object.keys(params).length>0){
       localStorage.setItem('authInfo',JSON.stringify(params));
    }
    window.history.pushState({},document.title,"/"+"demoIndex.html");
    let info=JSON.parse(localStorage.getItem('authInfo'))

    console.log(info);
    function LogOut(){
       fetch("https://oauth2.googleapis.com/revoke?token="+info['access_token'],
         { method:"POST",
           headers:{
               'Content-type':'application/x-www-form-urlencoded'
           }}
       )
    }