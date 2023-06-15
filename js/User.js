
function validatePassword() {
    var passwordInput = document.getElementById("password");
    var passwordError = document.getElementById("passwordError");

    if (passwordInput.value.length < 6) {
        passwordInput.classList.add("invalid");
        passwordError.textContent = "Password must be at least 6 characters long";
    } else {
        passwordInput.classList.remove("invalid");
        passwordError.textContent = "";
    }
}

function validateForm() {
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");

    if (!usernameInput.value.match(/^[a-zA-Z]+$/)) {
        usernameInput.classList.add("invalid");
        document.getElementById("usernameError").textContent = "Username must include only letters";
        return false;
    } else {
        usernameInput.classList.remove("invalid");
        document.getElementById("usernameError").textContent = "";
    }

    if (passwordInput.value.length < 6) {
        passwordInput.classList.add("invalid");
        document.getElementById("passwordError").textContent = "Password must be at least 6 characters long";
        return false;
    } else {
        passwordInput.classList.remove("invalid");
        document.getElementById("passwordError").textContent = "";
    }

    return true;
}