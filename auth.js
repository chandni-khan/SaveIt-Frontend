window.onload = async function () {
  if (userToken == null) {
    function createAndStyleElement(tag, textContent, styles) {
      const element = document.createElement(tag);
      element.textContent = textContent;
      Object.assign(element.style, styles);
      return element;
    }

    const mainContainer = document.getElementById("main");
    mainContainer.innerHTML = "";

    const container = document.createElement("div");
    container.id = "container";
    Object.assign(container.style, {
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto",
    });
    const welcomeHeading = createAndStyleElement(
      "h1",
      "Welcome to SaveIt App",
      {
        color: "#333",
        marginBottom: "1rem",
      }
    );

    // Create and style the quote
    const quote = createAndStyleElement(
      "p",
      "“A budget is telling your money where to go instead of wondering where it went.” – Dave Ramsey",
      {
        color: "#555",
        fontSize: "1.2rem",
        marginBottom: "1rem",
        fontStyle: "italic",
      }
    );

    // Create and style the additional text
    const additionalText = createAndStyleElement(
      "p",
      "Manage your expenses effectively and efficiently.",
      {
        color: "#555",
        fontSize: "1.2rem",
        marginBottom: "2rem",
      }
    );

    // Create and style the login button
    const loginBtn = createAndStyleElement("button", "Login", {
      color: "white",
      backgroundColor: "green",
      height: "3rem",
      width: "10rem",
      margin: "1rem",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    });
    loginBtn.id = "login";
    loginBtn.onclick = SignIn;

    // Create and style the signup button
    const signupBtn = createAndStyleElement("button", "Sign Up", {
      color: "white",
      backgroundColor: "blue",
      height: "3rem",
      width: "10rem",
      margin: "1rem",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    });
    signupBtn.id = "signup";
    signupBtn.onclick = SignUp;

    function SignUp() {
      // Add your sign-up logic here
      console.log("Sign Up button clicked");
    }

    // Append all elements to the container
    container.appendChild(welcomeHeading);
    container.appendChild(quote);
    container.appendChild(additionalText);
    container.appendChild(loginBtn);
    container.appendChild(signupBtn);

    // Append the container to the main container
    mainContainer.appendChild(container);

    // Add some basic styling to the body
    document.body.style.cssText = `
      font-family: Arial, sans-serif;
      background-color: #f0f8ff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 1rem;
      box-sizing: border-box;
    `;

    // Add hover effects for buttons
    const buttons = [loginBtn, signupBtn];
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor =
          button.id === "login" ? "#004d00" : "#0000a0"; // Darken on hover
      });
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = button.id === "login" ? "green" : "blue"; // Original color
      });
    });

    // const mainContainer = document.getElementById("body");
    // const addBtn = document.createElement("button");
    // addBtn.id = "login";
    // addBtn.textContent = "Login";
    // addBtn.style.color = "white";
    // addBtn.style.backgroundColor = "green";
    // addBtn.style.height = "5rem";
    // addBtn.style.width = "15rem";
    // addBtn.style.margin = "10rem";
    // addBtn.onclick = () => {
    //   SignIn();
    // };
    // addBtn.style.fontWeight = "bold";
    // mainContainer.replaceChildren(addBtn);
  } else {
    await createDashboard();
  }
};

async function getUserInfo(accessToken) {
  fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
      accessToken
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("email", data.email);
      sessionStorage.setItem("authToken", accessToken);
      localStorage.setItem("profileImg", data.picture);
      getJwtToken(data);
    })
    .catch((error) => console.error("Error fetching user info:", error));
}
async function getJwtToken(data) {
  try {
    const response = await fetch(
      "https://save-it.projects.bbdgrad.com/api/login/auth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const verifiedUser = await response.json();
    sessionStorage.setItem("userToken", verifiedUser.token);
    console.log(verifiedUser.user[0]);
    localStorage.setItem("userId", verifiedUser.user[0].userId);
    localStorage.setItem("userName", verifiedUser.user[0].userName);
    var url = new URL("https://save-it.projects.bbdgrad.com/web/");
    window.location.href = "https://save-it.projects.bbdgrad.com/web/";
    return token;
  } catch (error) {
    console.error("Error:", error);
  }
}

function LogOut() {
  let authToken = sessionStorage.getItem("authToken");
  if (sessionStorage.getItem("userToken") != null) {
    fetch("https://oauth2.googleapis.com/revoke?token=" + authToken, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    }).then((data) => console.log(data));
    sessionStorage.clear();
    var url = new URL("https://save-it.projects.bbdgrad.com/web/");
    localStorage.clear();
    window.location.href = "https://save-it.projects.bbdgrad.com/web/";
  } else {
    window.alert("Already Logged Out");
  }
}

function SignIn() {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  let params = {
    client_id:
      "768762679937-1b30jk5c9v58cc3rok3pkcab5og53kjg.apps.googleusercontent.com",
    redirect_uri: "https://save-it.projects.bbdgrad.com/web/",
    response_type: "token",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);

  form.submit();
}
