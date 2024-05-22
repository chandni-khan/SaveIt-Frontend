async function displayExpense() {
    await fetchAllExpense();
    const mainContainer = document.getElementById("dashboard-content");
    mainContainer.innerHTML = "";
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
    mainContainer.appendChild(addBtn);
    if (expenseData) {
      const listContainer = document.createElement("ul");
      listContainer.style.marginTop = "20px";
      listContainer.style.listStyleType = "none";
      listContainer.style.padding = "0";
  
      expenseData.forEach((expense) => {
        const listItem = document.createElement("li");
        listItem.style.border = "1px solid black";
        listItem.style.padding = "10px";
        listItem.style.borderRadius = "5px";
        listItem.style.marginBottom = "10px";
        listItem.style.display = "flex";
        listItem.style.justifyContent = "space-between";
  
        const expenseInfo = document.createElement("div");
        for (const key in expense) {
          if (Object.hasOwnProperty.call(expense, key) && key !== "userId") {
            const item = document.createElement("div");
            item.style.marginBottom = "5px";
            item.style.fontSize = "15px";
            item.style.fontWeight = "bold";
            if (key == "expenseCategory") {
              expenseAllCategory.map((v) => {
                if (v.expenseCategoryId == expense[key]) {
                  item.textContent =
                    key.replace("_", " ").toUpperCase() +
                    ": " +
                    v.expenseCategoryName;
                }
              });
            } else if (key == "expenseId") {
              item.textContent = "";
            } else if (key == "spendDate") {
              const date = new Date(expense[key]);
              item.textContent = key.toUpperCase() + ": " + date.toDateString();
            } else {
              item.textContent = key.toUpperCase() + ": " + expense[key];
            }
            expenseInfo.appendChild(item);
          }
        }
  
        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = "10px";
  
        const editIcon = document.createElement("span");
        editIcon.classList.add("material-icons-sharp");
        editIcon.textContent = "edit";
        editIcon.style.color = "#6C9BCF";
        editIcon.style.cursor = "pointer";
        editIcon.onclick = function () {
          createxpenseForm(expense.expenseId);
        };
        actions.appendChild(editIcon);
  
        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("material-icons-sharp");
        deleteIcon.textContent = "delete";
        deleteIcon.style.color = "#FF0060";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.onclick = function () {
          deleteExpense(expense.expenseId);
        };
        actions.appendChild(deleteIcon);
  
        listItem.appendChild(expenseInfo);
        listItem.appendChild(actions);
  
        listContainer.appendChild(listItem);
      });
  
      mainContainer.appendChild(listContainer);
    } else {
      const head = document.createElement("h1");
      head.textContent = "No record to show";
      mainContainer.appendChild(head);
    }
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
        labelText: "Amount Spend:",
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
  
    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .expense-form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
      }
      .expense-form {
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
    formContainer.classList.add("expense-form-container");
  
    const form = document.createElement("form");
    form.id = "addExpenseForm";
    form.classList.add("expense-form");
  
    formElements.forEach((element) => {
      const formGroup = document.createElement("div");
      formGroup.classList.add("form-group");
  
      const label = document.createElement("label");
      label.textContent = element.labelText;
      label.classList.add("form-label");
      formGroup.appendChild(label);
  
      if (element.name === "expenseCategory") {
        const expenseCategorySelect = document.createElement("select");
        expenseCategorySelect.id = "expenseCategory";
        expenseCategorySelect.name = "expenseCategory";
        expenseCategorySelect.required = true;
        expenseCategorySelect.classList.add("form-control");
  
        expenseAllCategory?.forEach((expenseCategoryItem) => {
          const option = document.createElement("option");
          option.value = expenseCategoryItem.expenseCategoryId;
          option.textContent = expenseCategoryItem.expenseCategoryName;
          expenseCategorySelect.appendChild(option);
        });
  
        formGroup.appendChild(expenseCategorySelect);
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
  
    if (id != null) {
      fetch(`https://save-it.projects.bbdgrad.com/api/getExpenseById/${id}`, {
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
          document.getElementsByName("expenseDescription")[0].value =
            data.expenseDescription;
          document.getElementsByName("spendDate")[0].value = data.spendDate;
          document.getElementsByName("amountSpend")[0].value = data.amountSpend;
          document.getElementsByName("expenseCategory")[0].value =
            data.expenseCategory;
          document.getElementsByName("addExpense")[0].value = "Update Expense"; // Update submit button text
          id = data.expenseId;
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
          userId: userId,
          expenseCategory: formData.get("expenseCategory"),
          expenseId: id,
        };
      } else {
        bodyData = {
          expenseDescription: formData.get("expenseDescription"),
          spendDate: formData.get("spendDate"),
          amountSpend: formData.get("amountSpend"),
          userId: userId,
          expenseCategory: formData.get("expenseCategory"),
        };
      }
      fetch(
        id
          ? "https://save-it.projects.bbdgrad.com/api/updateExpense"
          : "https://save-it.projects.bbdgrad.com/api/addExpense",
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
        return response.text(); 
      })
      .then((message) => {
        console.log("message", message);
        setTimeout(() => {
          showSuccessMessage(message);
          displayExpense();
        }, 500);
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
      });
      
    });
  }
  
  
  function deleteExpense(expenseId) {
    if (window.confirm("Do you want to Delete?")) {
      fetch(`https://save-it.projects.bbdgrad.com/api/deleteExpense/${expenseId}`, {
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
          console.log("message", message); 
          showSuccessMessage("Expense Deleted");
          displayExpense(); 
        })
        .catch((error) => {
          console.error("Error:", error);
          showErrorMessage("An error occurred. Please try again later.");
        });
    }
    console.log("Deleting expense with ID:", expenseId);
  }
  

