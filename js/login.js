// login.js

function updateNavbar() {
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    var logoutLink = document.getElementById("logoutLink");
    var loginLink = document.getElementById("loginLink");
    var registerLink = document.getElementById("registerLink");

    if (isLoggedIn === "true") {
        logoutLink.style.display = "block";
        loginLink.style.display = "none";
        registerLink.style.display = "none";
    } else {
        logoutLink.style.display = "none";
        loginLink.style.display = "block";
        registerLink.style.display = "block";
    }
}

function logout() {
    sessionStorage.setItem("isLoggedIn");
    isLoggedIn = false;
    updateNavbar();
}

// Add event listeners or other functions as needed