async function getUserInfo(accessToken) {
  startLoading();
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
    startLoading();
    if (localStorage.getItem("newUser")) {
      await fetch("https://save-it.projects.bbdgrad.com/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: data.email,
          userName: data.name,
        }),
      }).then((response) => {
        if (response.status == 409) {
           showErrorMessage("Already a user please login !!");
        }
        if (response.ok) {
          showSuccessMessage("User Created. Please Login");
        }
      });
      sessionStorage.clear();
      localStorage.clear();
    } else {
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
        showErrorMessage("Not a User Please create")
        sessionStorage.clear();
        localStorage.clear();
        throw new Error("Network response was not ok");
      }
   
      const verifiedUser = await response.json();
      sessionStorage.setItem("userToken", verifiedUser.token);
      console.log(verifiedUser.user[0]);
      localStorage.setItem("userId", verifiedUser.user[0].userId);
      localStorage.setItem("userName", verifiedUser.user[0].userName);
      stopLoading()
    }
  } catch (error) {
    stopLoading()
    console.error("Error:", error);
  }
  setTimeout(() => {
    window.location.href = "https://save-it.projects.bbdgrad.com/web/";
  }, 1500);
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
  startLoading()
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
