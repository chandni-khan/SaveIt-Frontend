function Expense() {
    const mainContent = document.getElementById("dashboard-content");
    mainContent.innerHTML = "";

    // Create Add Expense Form
    const addExpenseForm = document.createElement("form");
    addExpenseForm.id = "addExpenseForm";

    const h2AddExpense = document.createElement("h2");
    h2AddExpense.textContent = "Add New Expense";
    addExpenseForm.appendChild(h2AddExpense);

    const labelDescription = document.createElement("label");
    labelDescription.textContent = "Description:";
    addExpenseForm.appendChild(labelDescription);

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.id = "expenseDescription";
    inputDescription.name = "expenseDescription";
    inputDescription.required = true;
    addExpenseForm.appendChild(inputDescription);
    addExpenseForm.appendChild(document.createElement("br"));

    // Repeat similar steps for other form elements...

    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.name = "btn";
    submitButton.value = "Add Expense";
    addExpenseForm.appendChild(submitButton);

    mainContent.appendChild(addExpenseForm);

    // Create View/Edit/Delete Expenses Table
    const expenseTable = document.createElement("table");
    expenseTable.id = "expenseTable";
    expenseTable.border = "1";

    const h2ExpenseTable = document.createElement("h2");
    h2ExpenseTable.textContent = "View/Edit/Delete Expenses";
    expenseTable.appendChild(h2ExpenseTable);

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <th>Expense ID</th>
        <th>Description</th>
        <th>Spend Date</th>
        <th>Amount Spent</th>
        <th>User ID</th>
        <th>Category ID</th>
        <th>Actions</th>
    `;
    thead.appendChild(tr);
    expenseTable.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "expenseTableBody";
    expenseTable.appendChild(tbody);

    mainContent.appendChild(expenseTable);

    // Add Event Listener for Add Expense Form
    addExpenseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Your form submission logic here
    });

    // Populate Expense Table (You can add your fetch logic here)
    const expenseTableBody = document.getElementById("expenseTableBody");
    expenseTableBody.innerHTML = `
        <tr>
            <td>1</td>
            <td>Sample Expense</td>
            <td>2024-05-12</td>
            <td>100</td>
            <td>1</td>
            <td>1</td>
            <td>
                <button>Edit</button>
                <button>Delete</button>
            </td>
        </tr>
    `;
}
