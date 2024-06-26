async function displayIncome() {
  await fetchAllIncome();
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = "";

  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "center";
  headerContainer.style.marginBottom = "20px";
  const heading = document.createElement("h1");
  heading.textContent = "Income";
  heading.style.margin = "0";
  headerContainer.appendChild(heading);

  const buttonContainer = document.createElement("div");

  const addBtn = document.createElement("button");
  addBtn.id = "addIncome";
  addBtn.textContent = "Add Income";
  addBtn.style.color = "green";
  addBtn.style.height = "30px";
  addBtn.style.width = "100px";
  addBtn.style.fontWeight = "bold";
  addBtn.onclick = () => {
    createIncomeForm();
  };

  buttonContainer.appendChild(addBtn);
  headerContainer.appendChild(buttonContainer);

  mainContainer.appendChild(headerContainer);

  if (incomeData.length > 0) {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    incomeData.forEach((income) => {
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      const incomeContent = document.createElement("div");

      for (const key in income) {
        if (
          Object.hasOwnProperty.call(income, key) &&
          key !== "userId" &&
          key !== "incomeId"
        ) {
          const item = document.createElement("div");
          item.style.marginBottom = "5px";
          item.style.fontSize = "15px";

          const keySpan = document.createElement("span");
          keySpan.style.fontWeight = "bold";
          keySpan.textContent = key.replace("_", " ").toUpperCase() + ": ";

          if (key === "incomeDate") {
            const timestamp = income[key];
            const date = new Date(timestamp);
            item.appendChild(keySpan);
            item.appendChild(document.createTextNode(date.toDateString()));
          } else if (key === "incomeCategory") {
            incomeAllCategory.map((v) => {
              if (v.incomeCategoryId === income[key]) {
                item.appendChild(keySpan);
                item.appendChild(document.createTextNode(v.incomeCategoryName));
              }
            });
          } else {
            item.appendChild(keySpan);
            item.appendChild(document.createTextNode(income[key]));
          }
          incomeContent.appendChild(item);
        }
      }

      const actionsContainer = document.createElement("div");
      actionsContainer.style.display = "flex";
      actionsContainer.style.gap = "10px";

      const editIcon = document.createElement("span");
      editIcon.classList.add("material-icons-sharp");
      editIcon.textContent = "edit";
      editIcon.style.color = "#6C9BCF";
      editIcon.style.cursor = "pointer";
      editIcon.onclick = function () {
        createIncomeForm(income.incomeId);
      };
      actionsContainer.appendChild(editIcon);

      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("material-icons-sharp");
      deleteIcon.textContent = "delete";
      deleteIcon.style.color = "#FF0060";
      deleteIcon.style.cursor = "pointer";
      deleteIcon.onclick = function () {
        deleteIncome(income.incomeId);
      };
      actionsContainer.appendChild(deleteIcon);

      gridItem.appendChild(incomeContent);
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

function createIncomeForm(id) {
  const mainContainer = document.getElementById("dashboard-content");
  const formElements = [
    {
      type: "select",
      inputType: "text",
      name: "incomeCategory",
      labelText: "Category:",
    },
    {
      type: "input",
      inputType: "text",
      name: "incomeDescription",
      labelText: "Description:",
    },
    {
      type: "input",
      inputType: "date",
      name: "incomeDate",
      labelText: "Date:",
    },
    {
      type: "input",
      inputType: "number",
      name: "incomeAmount",
      labelText: "Income Amount:",
    },
    {
      type: "input",
      inputType: "submit",
      name: "addIncome",
      value: "Add Income",
    },
  ];

  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  const form = document.createElement("form");
  form.id = "addIncomeForm";
  form.classList.add("form");

  formElements.forEach((element) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = element.labelText;
    label.classList.add("form-label");
    formGroup.appendChild(label);

    if (element.name === "incomeCategory") {
      const incomeCategorySelect = createSelect(
        incomeAllCategory,
        element,
        "incomeCategoryId",
        "incomeCategoryName"
      );
      formGroup.appendChild(incomeCategorySelect);
    } else if (element.name == "incomeDate") {
      const formattedDate = getCurrentFormatDate();
      const input = createInput(element);
      input.max = formattedDate;
      input.classList.add("form-control");
      formGroup.appendChild(input);
    } else {
      const input = createInput(element);
      if (element.inputType === "submit") {
        input.value = element.value;
        input.classList.add("submit-button");
      }
      formGroup.appendChild(input);
    }
    form.appendChild(formGroup);
  });

  if (id != null) {
    fetch(`https://save-it.projects.bbdgrad.com/api/getIncomeById/${id}`, {
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
        console.log("Fetched data:", data);
        document.getElementById("incomeCategory").value = data.incomeCategory;
        document.getElementById("incomeDescription").value =
          data.incomeDescription;
        document.getElementsByName("incomeDate")[0].value =
          getCurrentFormatDate(data.incomeDate);
        document.getElementById("incomeAmount").value = data.incomeAmount;
        form.elements["addIncome"].value = "Update Income";
        console.log("Editing income with ID:", id);
      })
      .catch((e) => {
        console.log("error", e);

        // showErrorMessage("Failed to load income data. Please try again later.");
      });
  }

  formContainer.appendChild(form);
  mainContainer.replaceChildren(formContainer);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const bodyData = {
      incomeCategory: formData.get("incomeCategory"),
      incomeDescription: formData.get("incomeDescription"),
      incomeDate: formData.get("incomeDate"),
      incomeAmount: formData.get("incomeAmount"),
      userId: userId,
      ...(id && { incomeId: id }),
    };

    fetch(
      id
        ? "https://save-it.projects.bbdgrad.com/api/updateIncome"
        : "https://save-it.projects.bbdgrad.com/api/addIncome",
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
        showSuccessMessage(id ? "Updated Income" : "Added Income");
        fetchAllIncome();
        displayIncome();
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
      });
  });
}

function deleteIncome(incomeId) {
  if (window.confirm("Do you want to delete?")) {
    fetch(`https://save-it.projects.bbdgrad.com/api/deleteIncome/${incomeId}`, {
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
        showSuccessMessage("Income Deleted successfully");
        displayIncome();
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
      });
  }
  console.log("Deleting income with ID:", incomeId);
}
