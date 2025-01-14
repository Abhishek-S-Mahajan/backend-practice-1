const loginForm = document.querySelector(".login-form");
const usernameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");
const dashboardBtn = document.querySelector(".admin");
const homePageBtn = document.querySelector(".user");

let token = "";

// login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resp = await fetch("http://localhost:3000/api/auth/login", {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "content-type": "application/json",
        },
        "body": JSON.stringify({ username: usernameInput.value, password: passwordInput.value })
    });
    const data = await resp.json();
    token = data.accessToken;

    console.log("Login Response: ", data);
});

// go to admin dashboard
dashboardBtn.addEventListener("click", async () => {
    const resp = await fetch("http://localhost:3000/api/admin/dashboard", {
        method: "GET",
        mode: "cors",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    });
    const data = await resp.json();
    console.log("Dashboard Response: ", data);
});

// go to home page
homePageBtn.addEventListener("click", async () => {
    const resp = await fetch("http://localhost:3000/api/user/home", {
        method: "GET",
        mode: "cors",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`

        }
    });
    const data = await resp.json();
    console.log("Home Page Response: ", data);
});
