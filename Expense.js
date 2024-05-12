function Expense() {
    // Create main elements
    const h2AddExpense = document.createElement("h2");
    h2AddExpense.textContent = "Add New Expense";

    const form = document.createElement("form");
    form.id = "addExpenseForm";
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // Your form submission logic here
    });

    const labels = ["Description:", "Spend Date:", "Amount Spent:", "User ID:", "Category ID:"];
    const placeholders = ["expenseDescription", "spendDate", "amountSpend", "userId", "expenseCategory"];
    for (let i = 0; i < labels.length; i++) {
        const label = document.createElement("label");
        label.textContent = labels[i];
        form.appendChild(label);
        form.appendChild(document.createElement("br"));

        const input = document.createElement("input");
        input.type = i === 1 ? "date" : "text";
        input.id = placeholders[i];
        input.name = placeholders[i];
        input.required = true;
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    }

    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.name = "btn";
    submitBtn.value = "Add Expense";
    form.appendChild(submitBtn);

    const h2ViewEditDelete = document.createElement("h2");
    h2ViewEditDelete.textContent = "View/Edit/Delete Expenses";

    const table = document.createElement("table");
    table.id = "expenseTable";
    table.border = "1";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const thLabels = ["Expense ID", "Description", "Spend Date", "Amount Spent", "User ID", "Category ID", "Actions"];
    for (let i = 0; i < thLabels.length; i++) {
        const th = document.createElement("th");
        th.textContent = thLabels[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "expenseTableBody";
    // Expenses will be populated here dynamically
    table.appendChild(tbody);

    // Append elements to the body
    document.body.innerHTML = "";
    document.body.appendChild(h2AddExpense);
    document.body.appendChild(form);
    document.body.appendChild(h2ViewEditDelete);
    document.body.appendChild(table);

    // Load existing expenses
    let editRecord = undefined;
    fetch('http://52.50.239.63:8080/getExpensesByUserId/8')
        .then(response => {
            if (response.status === 204) {
                return;
            } else if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const expenseTableBody = document.getElementById("expenseTableBody");
            expenseTableBody.innerHTML = "";
            data.forEach(expense => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${expense.expenseId}</td>
                    <td>${expense.expenseDescription}</td>
                    <td>${expense.spendDate}</td>
                    <td>${expense.amountSpend}</td>
                    <td>${expense.userId}</td>
                    <td>${expense.expenseCategory}</td>
                    <td>
                        <button onclick="editExpense(${expense.expenseId})">Edit</button>
                        <button onclick="deleteExpense(${expense.expenseId})">Delete</button>
                    </td>
                `;
                expenseTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        let bodyData = {};
        if (editRecord) {
            bodyData = {
                "expenseDescription": formData.get("expenseDescription"),
                "spendDate": formData.get("spendDate"),
                "amountSpend": formData.get("amountSpend"),
                "userId": formData.get("userId"),
                "expenseCategory": formData.get("expenseCategory"),
                "expenseId": editRecord
            };
        } else {
            bodyData = {
                "expenseDescription": formData.get("expenseDescription"),
                "spendDate": formData.get("spendDate"),
                "amountSpend": formData.get("amountSpend"),
                "userId": formData.get("userId"),
                "expenseCategory": formData.get("expenseCategory")
            };
        }
        fetch(editRecord ? "http://52.50.239.63:8080/updateExpense" : "http://52.50.239.63:8080/addExpense", {
                method: editRecord ? "PUT" : "POST",
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
                console.log("Data received:", data);
                resetForm();
                window.alert(editRecord ? "Updated Expense" : "Added Expense");
            })
            .catch(error => {
                console.error("Error:", error);
                window.alert("An error occurred. Please try again later.");
            });
    });

    // Reset form function
    function resetForm() {
        document.getElementsByName("expenseDescription").forEach(function (element) {
            element.value = "";
        });
        document.getElementsByName("spendDate").forEach(function (element) {
            element.value = "";
        });
        document.getElementsByName("amountSpend").forEach(function (element) {
            element.value = "";
        });
        document.getElementsByName("userId").forEach(function (element) {
            element.value = "";
        });
        document.getElementsByName("expenseCategory").forEach(function (element) {
            element.value = "";
        });

        document.getElementsByName("btn").forEach(function (element) {
            element.value = "Add Expense";
        });
    }

    // Edit expense function
    function editExpense(expenseId) {
        fetch(`http://52.50.239.63:8080/getExpenseById/${expenseId}`)
            .then(response => {
                if (response.status === 204) {
                    return;
                } else if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                document.getElementsByName("expenseDescription").forEach(function (element) {
                    element.value = data.expenseDescription;
                });
                document.getElementsByName("spendDate").forEach(function (element) {
                    element.value = data.spendDate;
                });
                document.getElementsByName("amountSpend").forEach(function (element) {
                    element.value = data.amountSpend;
                });
                document.getElementsByName("userId").forEach(function (element) {
                    element.value = data.userId;
                });
                document.getElementsByName("expenseCategory").forEach(function (element) {
                    element.value = data.expenseCategory;
                });
                document.getElementsByName("btn").forEach(function (element) {
                    element.value = "Update Expense";
                });
                editRecord = data.expenseId;
                console.log("Editing expense with ID:", editRecord);
            }).catch(e => {
                console.log("error", e);
            });
    }

    // Delete expense function
    function deleteExpense(expenseId) {
        fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
                method: "DELETE",
            })
            .then(response => response.json())
            .catch(error => console.error("Error:", error));
        console.log("Deleting expense with ID:", expenseId);
    }
}

// Call Expense function when the Expense link is clicked
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("a[onclick='Expense()']").addEventListener("click", Expense);
});
