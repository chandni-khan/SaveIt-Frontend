const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const darkMode = document.querySelector(".dark-mode");

menuBtn.addEventListener("click", () => {
  if (sideMenu.style.display === "block") {
    sideMenu.style.display = "none";
  } else {
    sideMenu.style.display = "block";
  }
});
darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});
const incomeListItem = document.querySelector('a[data-action="income"]');
incomeListItem.addEventListener("click", displayIncome);
const expenseListItem = document.querySelector('a[data-action="expense"]');
expenseListItem.addEventListener("click", displayExpense);
const budgetListItem = document.querySelector('a[data-action="budget"]');
budgetListItem.addEventListener("click", displayBudget);
const goalListItem = document.querySelector('a[data-action="goal"]');
goalListItem.addEventListener("click", displayGoals);
let userName = localStorage.getItem("userName");
let userImage = localStorage.getItem("profileImg");
const userProfileImage = document.getElementById("userImag");
userProfileImage.src = userImage;
const userNameOnDashboard = document.getElementById("username");
userNameOnDashboard.textContent = userName;
menuBtn.addEventListener("click", () => {
    sideMenu.style.display = "block";
  });
  
  closeBtn.addEventListener("click", () => {
    sideMenu.style.display = "none";
  });