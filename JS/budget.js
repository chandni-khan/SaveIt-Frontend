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

function displayBudget() {
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = "";

  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "center";
  headerContainer.style.marginBottom = "20px"; 

  // Add heading
  const heading = document.createElement("h1");
  heading.textContent = "Budget";
  heading.style.margin = "0"; 
  headerContainer.appendChild(heading);

  // Create a container for the button
  const buttonContainer = document.createElement("div");

  const addBtn = document.createElement("button");
  addBtn.id = "addBudget";
  addBtn.textContent = "Create Budget";
  addBtn.style.color = "#1B9C85";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.style.fontWeight = "bold";
  addBtn.onclick = () => {
    createBudgetForm();
  };

  buttonContainer.appendChild(addBtn);
  headerContainer.appendChild(buttonContainer);

  mainContainer.appendChild(headerContainer);
  TurnOnLoader();
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
      const totalBudget = data.reduce(
        (acc, budget) => acc + budget.amount,
        0
      );

      TurnOffLoader();
      const gridContainer = document.createElement("div");
      gridContainer.classList.add("grid-container");

      data.forEach((budget) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");

        const budgetContent = document.createElement("div");
        budgetContent.style.display = "flex";
        budgetContent.style.justifyContent = "space-between";
        budgetContent.style.alignItems = "center";

        const infoContainer = document.createElement("div");

        for (const key in budget) {
          if (Object.hasOwnProperty.call(budget, key) && key !== "user_id") {
            const infoItem = document.createElement("div");
            infoItem.style.marginBottom = "5px";
            infoItem.style.fontSize = "15px";
            if (key === "start_date" || key === "end_date") {
              const timestamp = budget[key];
              const date = new Date(timestamp);
              infoItem.textContent = `${key
                .replace("_", " ")
                .toUpperCase()}: ${date.toDateString()}`;
            } else if (key === "budget_id") {
              infoItem.textContent = "";
            } else if (key === "budget_category") {
              budgetAllCategory.map((v) => {
                if (v.budgetCategoryId === budget[key]) {
                  infoItem.textContent =
                    key.replace("_", " ").toUpperCase() +
                    ": " +
                    v.budgetCategoryName;
                }
              });
            } else {
              infoItem.textContent = `${key.replace("_", " ").toUpperCase()}: ${
                budget[key]
              }`;
            }

            infoContainer.appendChild(infoItem);
          }
        }

        const progressContainer = document.createElement("div");
        progressContainer.style.position = "relative"; 
        progressContainer.style.width = "100%";
        progressContainer.style.height = "25px"; 
        progressContainer.style.backgroundColor = "#f0f0f0";
        progressContainer.style.borderRadius = "5px";

        const progressBar = document.createElement("div");
        const percentage = (budget.amount / totalBudget) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.style.height = "100%";
        progressBar.style.backgroundColor = "#1B9C85";
        progressBar.style.borderRadius = "5px";
        progressBar.style.position = "absolute"; 
        progressBar.style.top = "0"; 
        progressBar.style.left = "0"; 


        const percentageText = document.createElement("span");
        percentageText.textContent = `${percentage.toFixed(2)}%`; // Show percentage with two decimal places
        percentageText.style.position = "absolute";
        percentageText.style.top = "50%";
        percentageText.style.left = "50%";
        percentageText.style.transform = "translate(-50%, -50%)";
        percentageText.style.color = "white";
        percentageText.style.fontWeight = "bold";

        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(percentageText);
        infoContainer.appendChild(progressContainer);

        budgetContent.appendChild(infoContainer);

        const actionsContainer = document.createElement("div");
        actionsContainer.style.display = "flex";
        actionsContainer.style.gap = "10px";

        const editIcon = document.createElement("span");
        editIcon.classList.add("material-icons-sharp");
        editIcon.textContent = "edit";
        editIcon.style.color = "#6C9BCF";
        editIcon.style.cursor = "pointer";
        editIcon.onclick = function () {
          editRecord = budget.budget_id;
          createBudgetForm(budget.budget_id);
        };
        actionsContainer.appendChild(editIcon);

        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("material-icons-sharp");
        deleteIcon.textContent = "delete";
        deleteIcon.style.color = "#FF0060";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.onclick = function () {
          deleteBudget(budget.budget_id);
        };
        actionsContainer.appendChild(deleteIcon);

        budgetContent.appendChild(actionsContainer);
        gridItem.appendChild(budgetContent);
        gridContainer.appendChild(gridItem);
      });

      mainContainer.appendChild(gridContainer);
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
      inputType: "select",
      name: "budget_category",
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

  const style = document.createElement("style");
  style.textContent = `
    .budget-form-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
    .budget-form {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .form-control:focus {
      border-color: #5b9bd5;
      box-shadow: 0 0 5px rgba(91, 155, 213, 0.5);
      outline: none;
    }
    .submit-button {
      background-color: #5b9bd5;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
    }
    .submit-button:hover {
      background-color: #4a8ccc;
    }
  `;
  document.head.appendChild(style);

  const formContainer = document.createElement("div");
  formContainer.classList.add("budget-form-container");

  const form = document.createElement("form");
  form.id = "addBudgetForm";
  form.classList.add("budget-form");

  formElements.forEach((element) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = element.labelText;
    label.classList.add("form-label");
    formGroup.appendChild(label);

    if (element.name === "budget_category") {
      const budgetCategorySelect = document.createElement("select");
      budgetCategorySelect.id = "budgetCategory";
      budgetCategorySelect.name = "budget_category";
      budgetCategorySelect.required = true;
      budgetCategorySelect.classList.add("form-control");

      budgetAllCategory?.forEach((budgetCategoryItem) => {
        const option = document.createElement("option");
        option.value = budgetCategoryItem.budgetCategoryId;
        option.textContent = budgetCategoryItem.budgetCategoryName;
        budgetCategorySelect.appendChild(option);
      });

      formGroup.appendChild(budgetCategorySelect);
    } else {
      const input = document.createElement("input");
      input.type = element.inputType;
      input.name = element.name;
      input.id = element.name;
      input.required = true;
      input.classList.add("form-control");
      if (element.inputType === "submit") {
        input.value = element.value;
        input.classList.add("submit-button");
      }
      formGroup.appendChild(input);
    }
    form.appendChild(formGroup);
  });

  
  mainContainer.replaceChildren(form);
  if (id != null) {
    TurnOnLoader();
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
        TurnOffLoader();
        document.getElementsByName("budget_category")[0].value =
          data.budget_category;
        document.getElementsByName("budget_category")[0].value = data.budget_category;
        document.getElementsByName("amount")[0].value = data.amount;
        document.getElementsByName("start_date")[0].value = data.start_date.split("T")[0];
        document.getElementsByName("end_date")[0].value = data.end_date.split("T")[0];
        document.getElementsByName("budget_description")[0].value = data.budget_description;
        document.getElementsByName("addBudget")[0].value = "Update Budget"; // Update submit button text
        id = data.budget_id;
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  formContainer.appendChild(form);
  mainContainer.replaceChildren(formContainer);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    TurnOnLoader()
    const formData = new FormData(this);
    let bodyData = {};
    if (id) {
      bodyData = {
        budget_category: formData.get("budget_category"),
        amount: formData.get("amount"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        budget_description: formData.get("budget_description"),
        user_id: userId,
        budget_id: id,
      };
    } else {
      bodyData = {
        budget_category: formData.get("budget_category"),
        amount: formData.get("amount"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        budget_description: formData.get("budget_description"),
        user_id: userId,
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
        TurnOffLoader()
        return response.text();
      })
      .then((message) => {
        console.log("message", message);
        setTimeout(() => {
          showSuccessMessage(message);
          displayBudget();
        }, 500);
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((message) => {
        console.log("Delete response message:", message);
        showSuccessMessage("Deleted Successfully");
        displayBudget();
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
      });

    console.log("Deleting budget with ID:", budgetId);
  }
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
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text(); 
        })
        .then((message) => {
          console.log("Delete response message:", message); 
          showSuccessMessage("Deleted Successfully");
          displayBudget(); 
        })
        .catch((error) => {
          console.error("Error:", error);
          showErrorMessage("An error occurred. Please try again later.");
        });
  
      console.log("Deleting budget with ID:", budgetId);
    }
  }
  