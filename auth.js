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
  console.log("getJwtToken");
  try {
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
          showSuccessMessage("Already a user please login !!");
          sessionStorage.clear();
          localStorage.clear();
        }
        if (response.ok) {
          showSuccessMessage("User Created!!!");
        }
      });
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
        sessionStorage.clear();
        localStorage.clear();
        throw new Error("Network response was not ok");
      }
      const verifiedUser = await response.json();
      sessionStorage.setItem("userToken", verifiedUser.token);
      console.log(verifiedUser.user[0]);
      localStorage.setItem("userId", verifiedUser.user[0].userId);
      localStorage.setItem("userName", verifiedUser.user[0].userName);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  setTimeout(() => {
    window.location.href = "http://127.0.0.1:5500/Index.html";
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
    var url = new URL("http://127.0.0.1:5500/Index.html");
    localStorage.clear();
    window.location.href = "http://127.0.0.1:5500/Index.html";
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
    redirect_uri: "http://127.0.0.1:5500/Index.html",
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
