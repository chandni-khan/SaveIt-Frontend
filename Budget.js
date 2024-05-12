let editRecord = undefined;

window.addEventListener("load", function() {
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
            const row = `
                <tr>
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
                </tr>
            `;
            expenseTableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

document.getElementById("addExpenseForm").addEventListener("submit", function(event) {
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
        }
    } else {
        bodyData = {
            "expenseDescription": formData.get("expenseDescription"),
            "spendDate": formData.get("spendDate"),
            "amountSpend": formData.get("amountSpend"),
            "userId": formData.get("userId"),
            "expenseCategory": formData.get("expenseCategory")
        }
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
            document.getElementById("expenseDescription").value = data.expenseDescription;
            document.getElementById("spendDate").value = data.spendDate;
            document.getElementById("amountSpend").value = data.amountSpend;
            document.getElementById("userId").value = data.userId;
            document.getElementById("expenseCategory").value = data.expenseCategory;
            document.getElementById("btn").value = "Update Expense";
            editRecord = data.expenseId;
            console.log("Editing expense with ID:", editRecord);
        }).catch(e => {
            console.log("error", e);
        })
}

function deleteExpense(expenseId) {
    fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .catch(error => console.error("Error:", error));
    console.log("Deleting expense with ID:", expenseId);
}

function resetForm() {
    document.getElementsByName("expenseDescription").forEach(function(element) {
        element.value = "";
    });
    document.getElementsByName("spendDate").forEach(function(element) {
        element.value = "";
    });
    document.getElementsByName("amountSpend").forEach(function(element) {
        element.value = "";
    });
    document.getElementsByName("userId").forEach(function(element) {
        element.value = "";
    });
    document.getElementsByName("expenseCategory").forEach(function(element) {
        element.value = "";
    });

    document.getElementsByName("btn").forEach(function(element) {
        element.value = "Add Expense";
    });
}
