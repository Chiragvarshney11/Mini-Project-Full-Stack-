document.addEventListener("DOMContentLoaded", function () {

   
    const roleButtons = document.querySelectorAll(".role-btn");

    const welcomeTitle = document.getElementById("welcomeTitle");
    const welcomeText = document.getElementById("welcomeText");

    const loginForm = document.getElementById("loginForm");

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");

    const rememberMe = document.getElementById("rememberMe");

    const forgotLink = document.getElementById("forgotLink");
    const googleBtn = document.getElementById("googleBtn");
    const signupLink = document.getElementById("signupLink");

    const formMessage = document.getElementById("formMessage");


   

    let selectedRole = "student";


   

    function showMessage(message, type) {

        if (!formMessage) return;

        formMessage.textContent = message;

        formMessage.style.color =
            type === "success" ? "#16834b" : "#c74646";
    }


    function selectRole(role) {

        selectedRole = role;

        // Update active button
        roleButtons.forEach(function (button) {

            button.classList.remove("active");

            if (button.dataset.role === role) {
                button.classList.add("active");
            }

        });


       
        if (role === "student") {

            welcomeTitle.textContent = "Welcome Back, Student!";

            welcomeText.textContent =
                "Login to continue your learning journey.";

            username.placeholder = "Enter your student email";

        }

        else if (role === "teacher") {

            welcomeTitle.textContent = "Welcome Back, Teacher!";

            welcomeText.textContent =
                "Login to manage your courses and students.";

            username.placeholder = "Enter your teacher email";

        }

        showMessage("", "success");

    }


   
    roleButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const role = this.getAttribute("data-role");

            if (role === "student" || role === "teacher") {
                selectRole(role);
            }

        });

    });


   

    if (togglePassword && password) {

        togglePassword.addEventListener("click", function () {

            const isPasswordHidden = password.type === "password";

            if (isPasswordHidden) {

                password.type = "text";
                togglePassword.textContent = "Hide";

            }

            else {

                password.type = "password";
                togglePassword.textContent = "Show";

            }

        });

    }


   

    const savedUsername = localStorage.getItem(
        "learnhubRememberedUser"
    );

    if (savedUsername) {

        username.value = savedUsername;

        if (rememberMe) {
            rememberMe.checked = true;
        }

    }


   

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const enteredUsername = username.value.trim();
            const enteredPassword = password.value.trim();

            if (!enteredUsername) {

                showMessage("Please enter your username.", "error");
                username.focus();
                return;

            }

            if (!enteredPassword) {

                showMessage("Please enter your password.", "error");
                password.focus();
                return;

            }


        
            if (rememberMe && rememberMe.checked) {

                localStorage.setItem(
                    "learnhubRememberedUser",
                    enteredUsername
                );

            }

            else {

                localStorage.removeItem("learnhubRememberedUser");

            }


         
            sessionStorage.setItem("userRole", selectedRole);
            sessionStorage.setItem("username", enteredUsername);
            sessionStorage.setItem("isLoggedIn", "true");


            showMessage("Login successful! Redirecting...", "success");


          
            setTimeout(function () {

                if (selectedRole === "teacher") {

                    window.location.href = "dashboard.html";

                }

                else {

                    window.location.href = "my-progress.html";

                }

            }, 700);

        });

    }




    if (forgotLink) {

        forgotLink.addEventListener("click", function (event) {

            event.preventDefault();

            alert("Please contact the administrator to reset your password.");

        });

    }


   

    if (googleBtn) {

        googleBtn.addEventListener("click", function () {

            alert("Google Authentication will be integrated later.");

        });

    }


    

    if (signupLink) {

        signupLink.addEventListener("click", function (event) {

            event.preventDefault();

            alert("Registration page will be integrated later.");

        });

    }



    selectRole("student");


    console.log("LearnHub Login System Connected Successfully");

});