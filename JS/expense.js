async function displayExpense() {
  await fetchAllExpense();
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = "";

  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "center";
  headerContainer.style.marginBottom = "20px"; // Add some space below the header container

  // Add heading
  const heading = document.createElement("h1");
  heading.textContent = "Expense";
  heading.style.margin = "0"; // Remove default margin
  headerContainer.appendChild(heading);

  // Create a container for the button
  const buttonContainer = document.createElement("div");
  const addBtn = document.createElement("button");
  addBtn.id = "addExpense";
  addBtn.textContent = "Add Expense";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.style.fontWeight = "bold";
  addBtn.onclick = () => {
    createxpenseForm(null);
  };

  buttonContainer.appendChild(addBtn);
  headerContainer.appendChild(buttonContainer);

  mainContainer.appendChild(headerContainer);

  if (expenseData.length>0) {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    expenseData.forEach((expense) => {
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      // Expense content container
      const expenseContent = document.createElement("div");

      for (const key in expense) {
        if (Object.hasOwnProperty.call(expense, key) && key !== "userId") {
          const item = document.createElement("div");
          item.style.marginBottom = "5px";
          item.style.fontSize = "15px";
          
          const keySpan = document.createElement("span");
          keySpan.style.fontWeight = "bold";
          keySpan.textContent = key.replace("_", " ").toUpperCase() + ": ";
      
          if (key === "expenseCategory") {
            expenseAllCategory.map((v) => {
              if (v.expenseCategoryId === expense[key]) {
                item.appendChild(keySpan);
                item.appendChild(document.createTextNode(v.expenseCategoryName));
              }
            });
          } else if (key === "expenseId") {
            // Skip expenseId content
            continue;
          } else if (key === "spendDate") {
            const date = new Date(expense[key]);
            item.appendChild(keySpan);
            item.appendChild(document.createTextNode(date.toDateString()));
          } else {
            item.appendChild(keySpan);
            item.appendChild(document.createTextNode(expense[key]));
          }
          expenseContent.appendChild(item);
        }
      }
      

      const actionsContainer = document.createElement("div");
      actionsContainer.style.display = "flex";
      actionsContainer.style.gap = "10px";

      // Edit icon
      const editIcon = document.createElement("span");
      editIcon.classList.add("material-icons-sharp");
      editIcon.textContent = "edit";
      editIcon.style.color = "#6C9BCF";
      editIcon.style.cursor = "pointer";
      editIcon.onclick = function () {
        createxpenseForm(expense.expenseId);
      };
      actionsContainer.appendChild(editIcon);

      // Delete icon
      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("material-icons-sharp");
      deleteIcon.textContent = "delete";
      deleteIcon.style.color = "#FF0060";
      deleteIcon.style.cursor = "pointer";
      deleteIcon.onclick = function () {
        deleteExpense(expense.expenseId);
      };
      actionsContainer.appendChild(deleteIcon);

      gridItem.appendChild(expenseContent);
      gridItem.appendChild(actionsContainer);
      gridContainer.appendChild(gridItem);
    });
 mainContainer.appendChild(gridContainer);
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
    // const style = document.createElement("style");
    // style.textContent = `
    //   .expense-form-container {
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     margin-top: 20px;
    //   }
    //   .expense-form {
    //     background-color: #f9f9f9;
    //     padding: 20px;
    //     border-radius: 8px;
    //     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //     width: 100%;
    //     max-width: 500px;
    //   }
    //   .form-group {
    //     margin-bottom: 15px;
    //   }
    //   .form-label {
    //     display: block;
    //     margin-bottom: 5px;
    //     font-weight: bold;
    //   }
    //   .form-control {
    //     width: 100%;
    //     padding: 10px;
    //     border: 1px solid #ddd;
    //     border-radius: 4px;
    //     box-sizing: border-box;
    //   }
    //   .form-control:focus {
    //     border-color: #5b9bd5;
    //     box-shadow: 0 0 5px rgba(91, 155, 213, 0.5);
    //     outline: none;
    //   }
    //   .submit-button {
    //     background-color: #5b9bd5;
    //     color: white;
    //     border: none;
    //     cursor: pointer;
    //     padding: 10px 20px;
    //     border-radius: 4px;
    //     font-size: 16px;
    //   }
    //   .submit-button:hover {
    //     background-color: #4a8ccc;
    //   }
    // `;
    // document.head.appendChild(style);
  
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");
  
    const form = document.createElement("form");
    form.id = "addExpenseForm";
    form.classList.add("form");
  
    formElements.forEach((element) => {
      const formGroup = document.createElement("div");
      formGroup.classList.add("form-group");
  
      const label = document.createElement("label");
      label.textContent = element.labelText;
      label.classList.add("form-label");
      formGroup.appendChild(label);
  
      if (element.name === "expenseCategory") {
        const expenseCategorySelect = createSelect(expenseAllCategory,element,"expenseCategoryId","expenseCategoryName")
        formGroup.appendChild(expenseCategorySelect);
      }
       else {
        const input = createInput(element)
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
          document.getElementsByName("spendDate")[0].value = getCurrentFormatDate(data.spendDate);
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
  

