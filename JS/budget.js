function displayBudget() {
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = ""; 
  const addBtn = document.createElement("button");
  addBtn.id = "addBudget";
  addBtn.textContent = "Create Budget";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.style.fontWeight = "bold";
  addBtn.onclick = () => {
    createBudgetForm();
  };
  mainContainer.appendChild(addBtn);

  fetch(`https://save-it.projects.bbdgrad.com/api/getBudgetByUserId/${userId}`, {
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
      // Create a container with CSS Grid
      const gridContainer = document.createElement("div");
      gridContainer.classList.add("grid-container");

      data.forEach((budget) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");

        // Budget content container
        const budgetContent = document.createElement("div");

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
            }else if(key=="budget_id"){
              infoItem.textContent ="";
            }else if(key=="budget_category"){
             
              budgetAllCategory.map((v) => {
                if (v.budgetCategoryId == budget[key]) {
                  infoItem.textContent =
                    key.replace("_", " ").toUpperCase() +
                    ": " +
                    v.budgetCategoryName;
                }
              });
            }    
            else {
              infoItem.textContent = `${key.replace("_", " ").toUpperCase()}: ${
                budget[key]
              }`;
            }

            budgetContent.appendChild(infoItem);
          }
        }

        // Display category
        // const categoryItem = document.createElement("div");
        // categoryItem.style.marginBottom = "5px";
        // categoryItem.style.fontSize = "15px";
        // categoryItem.style.fontWeight = "bold";
        // categoryItem.textContent = `CATEGORY: ${budget.budget_category}`;
        // budgetContent.appendChild(categoryItem);

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
        budgetContent.appendChild(progressContainer);

        gridItem.appendChild(budgetContent);

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

        gridItem.appendChild(actionsContainer);
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
        inputType: "number",
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
  
    const formContainer = document.createElement("div");
    formContainer.classList.add("budget-form-container"); // New class
  
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
    if (element.name == "budget_category") {
      const budgetCategorySelect = document.createElement("select");
      budgetCategorySelect.id = "budgetCategory";
      budgetCategorySelect.name = "budget_category";
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
        budgetCategorySelect.classList.add("form-control");
        formGroup.appendChild(budgetCategorySelect);
      });
    } else {
      const input = document.createElement("input");
      input.type = element.inputType;
      input.name = element.name;
      input.id = element.name;
      input.required = true;
      input.classList.add("form-control");
      formGroup.appendChild(input);
    }
    form.appendChild(formGroup);
  }
  )
  mainContainer.replaceChildren(form)
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
        document.getElementsByName("budget_category")[0].value =
          data.budget_category;
        document.getElementsByName("amount")[0].value = data.amount;
        // document.getElementsByName("start_date")[0].value =
        //   data.start_date.split("T")[0];
        // document.getElementsByName("end_date")[0].value =
        //   data.end_date.split("T")[0];
        document.getElementsByName("budget_description")[0].value =
          data.budget_description;
        form.elements["addBudget"].name = "Update Budget"; // Update submit button text
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
    const formData = new FormData(this);
    let bodyData = {};
    if (id) {
      bodyData = {
        budget_category: formData.get("budget_category"),
        amount: formData.get("amount"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        budget_description: formData.get("budget_description"),
        user_id: 8,
        budget_id: id,
      };
    } else {
      bodyData = {
        budget_category: formData.get("budget_category"),
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
      })
      .then((data) => {
        setTimeout(() => {
          showSuccessMessage(id ? "Updated Budget" : "Added Budget");
          displayBudget();
        }, 1000);
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
  