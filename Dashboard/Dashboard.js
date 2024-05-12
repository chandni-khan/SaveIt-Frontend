const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

// menuBtn.addEventListener('click', () => {
//     sideMenu.style.display = 'block';
// });

// closeBtn.addEventListener('click', () => {
//     sideMenu.style.display = 'none';
// });

// darkMode.addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode-variables');
//     darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
//     darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
// })

function Expense() {
    // Create a container element
    const container = document.createElement("div");
    container.classList.add("expense-container");

    // Create and append the form for adding expenses
    const addExpenseForm = document.createElement("form");
    addExpenseForm.id = "addExpenseForm";
    addExpenseForm.innerHTML = `
        <label for="description">Description:</label><br>
        <input type="text" id="expenseDescription" name="expenseDescription" required><br>
        <label for="spend_date">Spend Date:</label><br>
        <input type="date" id="spendDate" name="spendDate" required><br>
        <label for="amount">Amount Spent:</label><br>
        <input type="number" id="amountSpend" name="amountSpend" step="0.01" required><br>
        <label for="user_id">User ID:</label><br>
        <input type="number" id="userId" name="userId" required><br>
        <label for="category_id">Category ID:</label><br>
        <input type="number" id="expenseCategory" name="expenseCategory" required><br><br>
        <input type="submit" name="btn" value="Add Expense">
    `;
    container.appendChild(addExpenseForm);

    // Create and append the table for viewing/editing/deleting expenses
    const expenseTable = document.createElement("table");
    expenseTable.id = "expenseTable";
    expenseTable.border = "1";
    expenseTable.innerHTML = `
        <thead>
            <tr>
                <th>Expense ID</th>
                <th>Description</th>
                <th>Spend Date</th>
                <th>Amount Spent</th>
                <th>User ID</th>
                <th>Category ID</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="expenseTableBody">
            <!-- Expenses will be populated here dynamically -->
        </tbody>
    `;
    container.appendChild(expenseTable);

    // Append the container to the body
    document.body.appendChild(container);

    // Fetch expenses by user ID and populate the table
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

    // Add submit event listener to the form
    addExpenseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        let bodyData = {
            "expenseDescription": formData.get("expenseDescription"),
            "spendDate": formData.get("spendDate"),
            "amountSpend": formData.get("amountSpend"),
            "userId": formData.get("userId"),
            "expenseCategory": formData.get("expenseCategory")
        };
        fetch("http://52.50.239.63:8080/addExpense", {
                method: "POST",
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
                window.alert("Added Expense");
            })
            .catch(error => {
                console.error("Error:", error);
                window.alert("An error occurred. Please try again later.");
            });

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
        }
    });

    // Function to handle editing an expense
    function editExpense(expenseId) {
        fetch(`http://52.50.239.63:8080/getExpenseById/${expenseId}`)
            .then(response => {
                if (response.status === 204) {
                    return;
                } else if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
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
                console.log("Editing expense with ID:", expenseId);
            })
            .catch(error => {
                console.error("Error:", error);
                window.alert("An error occurred. Please try again later.");
            });
    }

    // Function to handle deleting an expense
    function deleteExpense(expenseId) {
        fetch(`http://52.50.239.63:8080/deleteExpense/${expenseId}`, {
                method: "DELETE",
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Deleted expense with ID:", expenseId);
                // Refresh the table after deletion
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
            })
            .catch(error => {
                console.error("Error:", error);
                window.alert("An error occurred. Please try again later.");
            });
    }
}