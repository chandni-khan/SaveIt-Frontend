function startLoading() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "block";
  }
}

function stopLoading() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "none";
  }
}
function getCurrentFormatDate(date) {
  let today ="";
  if(date){
    today = new Date(date);
  }else{
    today = new Date();
  }
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  return formattedDate;
}


function createInput(element) {
  const input = document.createElement("input");
  input.type = element.inputType;
  input.name = element.name;
  input.id = element.name;
  input.required = true;
  input.classList.add("form-control");
  return input;
}

function createSelect(array, element, attribute, attributeValue) {
  let categorySelect = document.createElement("select");
  categorySelect.id = element.name;
  categorySelect.name = element.name;
  categorySelect.required = true;
  categorySelect.classList.add("form-control");
  
  array?.forEach((item) => {
    const option = document.createElement("option");
    option.value = item[attribute]; 
    option.textContent = item[attributeValue]; 
    categorySelect.appendChild(option);
  });

  return categorySelect;
}