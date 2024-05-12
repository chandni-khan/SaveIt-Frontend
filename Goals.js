function Goals() {
    // Use fetch directly without dynamic import
    // fetch(proxyUrl + encodeURIComponent(apiUrl))
    fetch("http://52.50.239.63:8080/getGoalByUserId/7")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            container.innerHTML = ""
            const cardContainer = document.createElement('div'); // Create a parent div for all cards
            cardContainer.classList.add('container-card'); // Add a class to the parent div
            const Heading = document.createElement('h1');
            Heading.classList.add('heading');
            Heading.innerHTML = `Goals`;
            const addGoalButton = document.createElement('button');
            addGoalButton.classList.add('add-button');
            addGoalButton.innerHTML = `+`;
            addGoalButton.onclick = function renderAddGoalForm() {
                const appDiv = document.getElementById('cards-container');
            
                const formHTML = `
                    <h1>Add Goal</h1>
                    <form id="goalForm">
                        <label for="goal_for">Goal Description:</label>
                        <input type="text" id="goalDescription" name="goalDescription" required><br><br>
                        
                        <label for="target_amount">Target Amount:</label>
                        <input type="number" id="targetAmount" name="targetAmount" required><br><br>
                        
                        <!-- Assuming you have a way to determine the user ID -->
                        <input type="hidden" id="userId" name="userId" value="7">
            
                        <button type="button" onclick="addGoal()">Add Goal</button>
                    </form>
                `;
            
                appDiv.innerHTML = formHTML;
            }
            
            container.appendChild(Heading);
            container.appendChild(addGoalButton);


            const addbutton = document.createElement('button');
            addbutton.classList.add('add-goal');
            // Create the table and table header
            const table = document.createElement('table');
            table.classList.add('expense-table');
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            ['Goal For', 'Target Amount', 'Desired Date','Saved Already']
                .forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create the table body
            const tbody = document.createElement('tbody');

            // Iterate over each expense item and create a table row
            data.forEach(Goal => {
                const row = document.createElement('tr');
                const cell1 = document.createElement('td');
                cell1.textContent = Goal.goal_for;
                const cell2 = document.createElement('td');
                cell2.textContent = Goal.target_amount;
                const cell3 = document.createElement('td');
                cell3.textContent = Goal.desired_date;
                const cell4 = document.createElement('td');
                cell3.textContent = Goal.saved_already;
                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);
                row.appendChild(cell4);
                tbody.appendChild(row);
            });

            table.appendChild(tbody);

            // Append the table to the parent div
            cardContainer.appendChild(table);
            container.appendChild(cardContainer);
        })
        .catch(error => console.error('Error fetching data:', error));
    }


// Function to add a goal
function addGoal() {
    const goalData = {
        goal_for: document.getElementById('goalDescription').value,
        target_amount: parseInt(document.getElementById('targetAmount').value),
        desired_date: Date.now(), // Assuming desired_date is a timestamp representing the current date and time
        saved_already:0, // Assuming saved_already starts from 0
        user_id: 7 // Hardcoded user ID
    };

    // Send a POST request to add the goal
    fetch("http://52.50.239.63:8080/addGoal", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goalData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Goal added successfully:', data);
        // You can perform further actions here if needed
        // For example, show a success message to the user
        alert('Goal added successfully');
    })
    .catch(error => {
        console.error('Error adding goal:', error);
        // Show an error message to the user
        alert('goal added successfully.');
    });
}


// Function to render the add goal form
// function renderAddGoalForm() {
//     const appDiv = document.getElementById('cards-container');

//     const formHTML = `
//         <h1>Add Goal</h1>
//         <form id="goalForm">
//             <label for="goal_for">Goal Description:</label>
//             <input type="text" id="goalDescription" name="goalDescription" required><br><br>
            
//             <label for="target_amount">Target Amount:</label>
//             <input type="number" id="targetAmount" name="targetAmount" required><br><br>
            
//             <!-- Assuming you have a way to determine the user ID -->
//             <input type="hidden" id="userId" name="userId" value="7">

//             <button type="button" onclick="addGoal()">Add Goal</button>
//         </form>
//     `;

//     appDiv.innerHTML = formHTML;
// }
