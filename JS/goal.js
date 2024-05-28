async function displayGoals() {
  await fetchAllGoal();
  const mainContainer = document.getElementById("dashboard-content");
  mainContainer.innerHTML = "";

  const addBtn = document.createElement("button");
  addBtn.id = "addGoal";
  addBtn.textContent = "Create Goal";
  addBtn.onclick = () => {
    addGoalForm();
  };

  mainContainer.appendChild(addBtn);

  // Add heading
  const heading = document.createElement("h1");
  heading.textContent = "Goals";
  mainContainer.appendChild(heading);

  if (goalData.length > 0) {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.zIndex = "1";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.overflow = "auto";
    modal.style.backgroundColor = "rgba(0,0,0,0.4)";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fefefe";
    modalContent.style.margin = "15% auto";
    modalContent.style.padding = "20px";
    modalContent.style.border = "1px solid #888";
    modalContent.style.width = "80%";
    modalContent.style.maxWidth = "300px";
    modalContent.style.textAlign = "center";

    const closeModal = document.createElement("span");
    closeModal.textContent = "×";
    closeModal.style.color = "#aaa";
    closeModal.style.float = "right";
    closeModal.style.fontSize = "28px";
    closeModal.style.fontWeight = "bold";
    closeModal.style.cursor = "pointer";
    closeModal.onclick = function () {
      modal.style.display = "none";
    };

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Add Amount";

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.id = "amountInput";
    amountInput.placeholder = "Enter amount";

    const modalButtons = document.createElement("div");
    modalButtons.style.display = "flex";
    modalButtons.style.justifyContent = "space-around";
    modalButtons.style.marginTop = "20px";

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancelButton";
    cancelButton.textContent = "CANCEL";
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.fontSize = "16px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.backgroundColor = "#f44336"; // Red
    cancelButton.style.color = "white";
    cancelButton.onclick = function () {
      modal.style.display = "none";
    };

    const insertButton = document.createElement("button");
    insertButton.id = "insertButton";
    insertButton.textContent = "INSERT";
    insertButton.style.padding = "10px 20px";
    insertButton.style.fontSize = "16px";
    insertButton.style.cursor = "pointer";
    insertButton.style.backgroundColor = "#4CAF50"; // Green
    insertButton.style.color = "white";

    modalButtons.appendChild(cancelButton);
    modalButtons.appendChild(insertButton);

    modalContent.appendChild(closeModal);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(amountInput);
    modalContent.appendChild(modalButtons);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    goalData.forEach((goal) => {
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      const goalContent = document.createElement("div");

      const title = document.createElement("h2");
      title.textContent = goal["goal_for"];
      goalContent.appendChild(title);

      const progressContainer = document.createElement("div");
      progressContainer.classList.add("progress-container");

      const progressBar = document.createElement("progress");
      progressBar.value = goal["saved_already"];
      progressBar.max = goal["target_amount"];
      progressContainer.appendChild(progressBar);

      const progressText = document.createElement("p");
      const progress = (goal["saved_already"] / goal["target_amount"]) * 100;
      progressText.textContent = `Saved: ${goal["saved_already"]} out of ${
        goal["target_amount"]
      } (${progress.toFixed(2)}%)`;

      if (progress >= 100) {
        progressText.textContent += " - Goal Completed";
      }

      progressContainer.appendChild(progressText);
      goalContent.appendChild(progressContainer);

      const addSavedAmountBtn = document.createElement("button");
      addSavedAmountBtn.textContent = "Add saved Amount >";
      addSavedAmountBtn.style.marginTop = "10px";
      addSavedAmountBtn.style.color = "#6C9BCF";
      addSavedAmountBtn.style.fontWeight = "bold";
      if (progress >= 100) {
        addSavedAmountBtn.disabled = true;
      } else {
        addSavedAmountBtn.onclick = function () {
          modal.style.display = "block";

          insertButton.onclick = function () {
            const amountToAdd = amountInput.value;
            if (
              amountToAdd !== null &&
              !isNaN(amountToAdd) &&
              parseFloat(amountToAdd) >= 0
            ) {
              const newSavedAmount =
                parseFloat(goal["saved_already"]) + parseFloat(amountToAdd);
              fetch("https://save-it.projects.bbdgrad.com/api/updateGoal", {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  goal_id: goal.goal_id,
                  saved_already: newSavedAmount,
                  goal_for: goal.goal_for,
                  target_amount: goal.target_amount,
                  desired_date: goal.desired_date,
                  user_id: 8,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                })
                .then((data) => {
                  goal["saved_already"] = newSavedAmount;
                  progressBar.value = newSavedAmount;
                  const progress =
                    (newSavedAmount / goal["target_amount"]) * 100;
                  progressText.textContent = `Saved: ${newSavedAmount} out of ${
                    goal["target_amount"]
                  } (${progress.toFixed(2)}%)`;
                  if (progress >= 100) {
                    progressText.textContent += " - Goal Completed";
                    addSavedAmountBtn.disabled = true;
                  }
                  modal.style.display = "none";
                })
                .catch((error) => {
                  console.error(
                    "There was a problem with updating the saved amount:",
                    error
                  );
                });
            } else {
              console.log("Invalid input or user canceled the operation");
            }
          };
        };
      }
      goalContent.appendChild(addSavedAmountBtn);

      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";

      const editIcon = document.createElement("span");
      editIcon.classList.add("material-icons-sharp");
      editIcon.textContent = "edit";
      editIcon.style.color = "#6C9BCF";
      editIcon.style.cursor = "pointer";

      if (progress >= 100) {
        editIcon.style.pointerEvents = "none";
        editIcon.style.opacity = 0.5;
      } else {
        editIcon.onclick = function () {
          addGoalForm();
          editGoal(goal.goal_id);
          editRecord = goal.goal_id;
        };
      }
      buttonContainer.appendChild(editIcon);

      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("material-icons-sharp");
      deleteIcon.textContent = "delete";
      deleteIcon.style.color = "#FF0060";
      deleteIcon.style.cursor = "pointer";
      deleteIcon.onclick = function () {
        deleteGoal(goal.goal_id);
      };
      buttonContainer.appendChild(deleteIcon);

      gridItem.appendChild(goalContent);
      gridItem.appendChild(buttonContainer);

      gridContainer.appendChild(gridItem);
      mainContainer.appendChild(gridContainer);
    });
  } else {
    const head = document.createElement("h1");
    head.style.marginTop="1.7rem"
    head.textContent = "No record to show";
    mainContainer.appendChild(head);
  }
}

function editGoal(goalId) {
  fetch(`https://save-it.projects.bbdgrad.com/api/getGoalById/${goalId}`, {
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
    .then((goalData) => {
      addGoalForm(goalData);
    })
    .catch((error) => {
      showErrorMessage(
        "Error occurred while fetching goal data. Please try again later!"
      );
    });
}

function addGoalForm(goalData = null) {
  const mainContainer = document.getElementById("dashboard-content");
  const formElements = [
    {
      type: "input",
      inputType: "text",
      name: "goal_for",
      labelText: "Goal For:",
    },
    {
      type: "input",
      inputType: "number",
      name: "target_amount",
      labelText: "Target Amount:",
    },
    {
      type: "input",
      inputType: "date",
      name: "desired_date",
      labelText: "Desired Date:",
    },
    {
      type: "input",
      inputType: "number",
      name: "saved_already",
      labelText: "Saved Already:",
    },
    {
      type: "input",
      inputType: "submit",
      name: "createGoal",
      value: "Add Goal",
    }, // Updated submit button
  ];


  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  const form = document.createElement("form");
  form.id = "GoalForm";
  form.classList.add("form");

  formElements.forEach((element) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = element.labelText;
    label.classList.add("form-label");
    formGroup.appendChild(label);

    const input = createInput(element)

    if (goalData && goalData[element.name] !== undefined) {
      input.value = goalData[element.name];
    }

    if (element.inputType === "submit") {
      input.value = goalData ? "Update Goal" : "Add Goal";
      input.classList.add("submit-button");
    }
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  // Replace existing content with the goal form
  mainContainer.replaceChildren(formContainer);

  formContainer.appendChild(form);

  // Add form submission event listener
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const bodyData = {
      goal_for: formData.get("goal_for"),
      target_amount: formData.get("target_amount"),
      desired_date: formData.get("desired_date"),
      saved_already: formData.get("saved_already"),
      user_id: 8, // You may need to update this based on your requirements
    };

    let url = "https://save-it.projects.bbdgrad.com/api/addGoal";
    let method = "POST";

    if (goalData) {
      url = `https://save-it.projects.bbdgrad.com/api/updateGoal`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...bodyData, goal_id: goalData.goal_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((responseText) => {
        if (goalData) {
          showSuccessMessage("Goal updated successfully!");
        } else {
          showSuccessMessage("Goal added successfully!");
        }
        displayGoals();
      })
      .catch((error) => {
        showErrorMessage("Error occurred. Please try again later!");
        console.error(error);
      });
  });
}

function deleteGoal(goalId) {
  if (window.confirm("Do you want to delete?")) {
    fetch(`https://save-it.projects.bbdgrad.com/api/deleteGoal/${goalId}`, {
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
        return response.text(); // Assuming the response is plain text
      })
      .then((message) => {
        console.log("Delete response message:", message); // Log the response message
        showSuccessMessage("Deleted successfully");
        displayGoals(); // Refresh the goals list or update the UI accordingly
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorMessage("An error occurred. Please try again later.");
      });

    console.log("Deleting goal with ID:", goalId);
  }
}
