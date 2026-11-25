
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. GET HTML ELEMENTS
    // =====================================

    const roleButtons = document.querySelectorAll(".role-btn");
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const rememberMe = document.getElementById("rememberMe");
    const welcomeTitle = document.getElementById("welcomeTitle");
    const welcomeText = document.getElementById("welcomeText");
    const formMessage = document.getElementById("formMessage");
    const forgotLink = document.getElementById("forgotLink");
    const signupLink = document.getElementById("signupLink");
    const googleBtn = document.getElementById("googleBtn");

    // =====================================
    // 2. REGISTERED USERS MANAGEMENT
    // =====================================
    const USERS_STORAGE_KEY = "learnhubRegisteredUsers";

    // Default registered accounts
    const defaultAccounts = [
        // Students
        { username: "ram", email: "ram@example.com", password: "password123", role: "student", name: "Ram" },
        { username: "aman", email: "aman@example.com", password: "password123", role: "student", name: "Aman" },
        { username: "student", email: "student@learnhub.com", password: "password123", role: "student", name: "Student" },
        // Teachers
        { username: "teacher", email: "teacher@learnhub.com", password: "password123", role: "teacher", name: "Teacher" },
        { username: "admin", email: "admin@learnhub.com", password: "password123", role: "teacher", name: "Admin" }
    ];

    function getRegisteredUsers() {
        try {
            const stored = localStorage.getItem(USERS_STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultAccounts));
                return defaultAccounts;
            }
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : defaultAccounts;
        } catch (e) {
            console.error("Error reading users:", e);
            return defaultAccounts;
        }
    }

    function saveUser(user) {
        const users = getRegisteredUsers();
        users.push(user);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    // Initialize registered users in localStorage if not already present
    getRegisteredUsers();

    // Check if student profile exists in localStorage; if so ensure it's registered
    try {
        const studentProfile = localStorage.getItem("learnhubStudentProfile");
        if (studentProfile) {
            const profile = JSON.parse(studentProfile);
            const users = getRegisteredUsers();
            const exists = users.some(u => 
                (profile.email && u.email.toLowerCase() === profile.email.toLowerCase()) ||
                (profile.fullName && u.username.toLowerCase() === profile.fullName.toLowerCase().replace(/\s+/g, ''))
            );
            if (!exists && profile.email) {
                saveUser({
                    username: profile.fullName ? profile.fullName.toLowerCase().replace(/\s+/g, '') : "student",
                    email: profile.email.toLowerCase(),
                    password: "password123",
                    role: "student",
                    name: profile.fullName || "Student"
                });
            }
        }
    } catch (e) {
        console.error(e);
    }

    // =====================================
    // 3. DEFAULT ROLE & REMEMBER ME
    // =====================================

    let selectedRole = "student";

    const rememberedUser = localStorage.getItem("learnhubRememberedUser");
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberMe.checked = true;
    }

    // =====================================
    // 4. ROLE SELECTION
    // =====================================

    roleButtons.forEach(button => {
        button.addEventListener("click", function () {
            roleButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            selectedRole = this.dataset.role;

            if (selectedRole === "student") {
                welcomeTitle.textContent = "Welcome Back!";
                welcomeText.textContent = "Please login to continue your learning journey.";
                usernameInput.placeholder = "Enter your username or email";
            } else if (selectedRole === "teacher") {
                welcomeTitle.textContent = "Welcome Back!";
                welcomeText.textContent = "Please login to continue your teaching journey.";
                usernameInput.placeholder = "Enter your username or email";
            }

            formMessage.textContent = "";
        });
    });

    // =====================================
    // 5. PASSWORD SHOW / HIDE
    // =====================================

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                passwordInput.type = "password";
                this.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        });
    }

    // =====================================
    // 6. LOGIN FORM SUBMISSION WITH ACCOUNT CHECK
    // =====================================

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const identifier = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        // 1. Check empty fields
        if (identifier === "" || password === "") {
            formMessage.style.color = "#dc2626";
            formMessage.textContent = "Please enter username/email and password.";
            return;
        }

        // 2. Lookup registered users
        const users = getRegisteredUsers();

        // Check if an account exists with this username or email
        const userAccount = users.find(u => 
            (u.username && u.username.toLowerCase() === identifier) ||
            (u.email && u.email.toLowerCase() === identifier)
        );

        // If no account found -> User has not created an account
        if (!userAccount) {
            formMessage.style.color = "#dc2626";
            formMessage.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> You have not created an account. Please sign up first!';
            return;
        }

        // 3. Check password
        if (userAccount.password && userAccount.password !== password) {
            formMessage.style.color = "#dc2626";
            formMessage.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Incorrect password. Please try again.';
            return;
        }

        // 4. Remember username
        if (rememberMe.checked) {
            localStorage.setItem("learnhubRememberedUser", usernameInput.value.trim());
        } else {
            localStorage.removeItem("learnhubRememberedUser");
        }

        // 5. Save login session
        const effectiveRole = userAccount.role || selectedRole;
        sessionStorage.setItem("userRole", effectiveRole);
        sessionStorage.setItem("username", userAccount.name || userAccount.username);
        sessionStorage.setItem("userEmail", userAccount.email || "");
        sessionStorage.setItem("isLoggedIn", "true");

        // Sync with student profile if student
        if (effectiveRole === "student") {
            const currentStudentProfile = localStorage.getItem("learnhubStudentProfile");
            if (!currentStudentProfile && userAccount.name) {
                localStorage.setItem("learnhubStudentProfile", JSON.stringify({
                    fullName: userAccount.name,
                    email: userAccount.email || `${userAccount.username}@example.com`,
                    phone: "+91 98765 43210",
                    course: "B.Tech Computer Science"
                }));
            }
        }

        // 6. Show success message
        formMessage.style.color = "#15803d";
        formMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Login successful! Redirecting...';

        // 7. Redirect according to role
        setTimeout(function () {
            if (effectiveRole === "student") {
                window.location.href = "student-learning.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 600);
    });

    // =====================================
    // 7. GOOGLE SIGN-IN MODAL / FUNCTIONALITY
    // =====================================

    // Create and inject a modern Google Sign-in modal into the page
    const googleModalHTML = `
        <div id="googleAuthModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
            <div style="background:#ffffff; width:90%; max-width:400px; border-radius:16px; padding:28px 24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); font-family:Arial,sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                        <h3 style="font-size:18px; margin:0; color:#1f2937;">Sign in with Google</h3>
                    </div>
                    <button type="button" id="closeGoogleModal" style="background:none; border:none; font-size:20px; cursor:pointer; color:#9ca3af;">&times;</button>
                </div>
                <p style="font-size:13px; color:#6b7280; margin-bottom:18px;">Choose an account or enter your Google email to sign in to LearnHub.</p>
                
                <!-- Quick Google account options -->
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <button type="button" class="google-acc-btn" data-email="ram@gmail.com" data-name="Ram" style="display:flex; align-items:center; gap:12px; padding:10px 14px; border:1px solid #e5e7eb; border-radius:10px; background:#f9fafb; cursor:pointer; text-align:left;">
                        <div style="width:32px; height:32px; border-radius:50%; background:#2563eb; color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:13px;">R</div>
                        <div>
                            <div style="font-size:13px; font-weight:600; color:#111827;">Ram</div>
                            <div style="font-size:12px; color:#6b7280;">ram@gmail.com</div>
                        </div>
                    </button>
                    <button type="button" class="google-acc-btn" data-email="aman@gmail.com" data-name="Aman" style="display:flex; align-items:center; gap:12px; padding:10px 14px; border:1px solid #e5e7eb; border-radius:10px; background:#f9fafb; cursor:pointer; text-align:left;">
                        <div style="width:32px; height:32px; border-radius:50%; background:#10b981; color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:13px;">A</div>
                        <div>
                            <div style="font-size:13px; font-weight:600; color:#111827;">Aman</div>
                            <div style="font-size:12px; color:#6b7280;">aman@gmail.com</div>
                        </div>
                    </button>
                </div>

                <div style="position:relative; text-align:center; margin:14px 0;">
                    <hr style="border:none; border-top:1px solid #e5e7eb;">
                    <span style="position:absolute; top:-9px; left:50%; transform:translateX(-50%); background:white; padding:0 8px; font-size:11px; color:#9ca3af;">OR ENTER EMAIL</span>
                </div>

                <form id="customGoogleForm" style="display:flex; flex-direction:column; gap:10px;">
                    <input type="email" id="customGoogleEmail" placeholder="e.g. yourname@gmail.com" required style="width:100%; height:40px; padding:0 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none; box-sizing:border-box;">
                    <button type="submit" style="width:100%; height:40px; background:#2563eb; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">Continue with this Google Account</button>
                </form>
                <p id="googleModalMessage" style="font-size:12px; margin-top:10px; text-align:center; min-height:16px;"></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", googleModalHTML);

    const googleAuthModal = document.getElementById("googleAuthModal");
    const closeGoogleModal = document.getElementById("closeGoogleModal");
    const customGoogleForm = document.getElementById("customGoogleForm");
    const customGoogleEmail = document.getElementById("customGoogleEmail");
    const googleModalMessage = document.getElementById("googleModalMessage");

    // Open Google modal
    if (googleBtn) {
        googleBtn.addEventListener("click", function () {
            formMessage.textContent = "";
            googleModalMessage.textContent = "";
            googleAuthModal.style.display = "flex";
        });
    }

    // Close Google modal
    if (closeGoogleModal) {
        closeGoogleModal.addEventListener("click", function () {
            googleAuthModal.style.display = "none";
        });
    }

    googleAuthModal.addEventListener("click", function (e) {
        if (e.target === googleAuthModal) {
            googleAuthModal.style.display = "none";
        }
    });

    function processGoogleLogin(email, name) {
        const users = getRegisteredUsers();
        const cleanEmail = email.trim().toLowerCase();

        // Check if this Google account is registered in LearnHub
        const userAccount = users.find(u => 
            (u.email && u.email.toLowerCase() === cleanEmail) ||
            (u.username && cleanEmail.startsWith(u.username.toLowerCase()))
        );

        if (!userAccount) {
            googleModalMessage.style.color = "#dc2626";
            googleModalMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <strong>${email}</strong> has not created an account. Please sign up first!`;
            return;
        }

        googleModalMessage.style.color = "#15803d";
        googleModalMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> Welcome back, ${name || userAccount.name || userAccount.username}! Redirecting...`;

        const effectiveRole = userAccount.role || selectedRole;
        sessionStorage.setItem("userRole", effectiveRole);
        sessionStorage.setItem("username", userAccount.name || name || userAccount.username);
        sessionStorage.setItem("userEmail", cleanEmail);
        sessionStorage.setItem("isLoggedIn", "true");

        setTimeout(function () {
            googleAuthModal.style.display = "none";
            if (effectiveRole === "student") {
                window.location.href = "student-learning.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 700);
    }

    // Pre-configured Google account click
    document.querySelectorAll(".google-acc-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const email = this.dataset.email;
            const name = this.dataset.name;
            processGoogleLogin(email, name);
        });
    });

    // Custom Google email form
    if (customGoogleForm) {
        customGoogleForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = customGoogleEmail.value.trim();
            if (!email) return;
            const name = email.split("@")[0];
            processGoogleLogin(email, name);
        });
    }

    // =====================================
    // 8. SIGNUP LINK - ALLOW REGISTRATION
    // =====================================

    const signupModalHTML = `
        <div id="signupModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
            <div style="background:#ffffff; width:90%; max-width:420px; border-radius:16px; padding:28px 24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); font-family:Arial,sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h3 style="font-size:18px; margin:0; color:#1f2937;">Create a New Account</h3>
                    <button type="button" id="closeSignupModal" style="background:none; border:none; font-size:20px; cursor:pointer; color:#9ca3af;">&times;</button>
                </div>
                <form id="signupForm" style="display:flex; flex-direction:column; gap:12px;">
                    <div>
                        <label style="font-size:12px; font-weight:600; color:#374151; display:block; margin-bottom:4px;">Full Name</label>
                        <input type="text" id="regName" placeholder="e.g. Rohit Kumar" required style="width:100%; height:38px; padding:0 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600; color:#374151; display:block; margin-bottom:4px;">Username or Email</label>
                        <input type="text" id="regIdentifier" placeholder="e.g. rohit@gmail.com" required style="width:100%; height:38px; padding:0 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600; color:#374151; display:block; margin-bottom:4px;">Password</label>
                        <input type="password" id="regPassword" placeholder="Create a password" required style="width:100%; height:38px; padding:0 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600; color:#374151; display:block; margin-bottom:4px;">Role</label>
                        <select id="regRole" style="width:100%; height:38px; padding:0 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none; box-sizing:border-box; background:white;">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" style="width:100%; height:40px; background:#2563eb; color:white; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; margin-top:6px;">Create Account</button>
                    <p id="signupMessage" style="font-size:12px; text-align:center; margin:0; min-height:16px;"></p>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", signupModalHTML);

    const signupModal = document.getElementById("signupModal");
    const closeSignupModal = document.getElementById("closeSignupModal");
    const signupForm = document.getElementById("signupForm");
    const regName = document.getElementById("regName");
    const regIdentifier = document.getElementById("regIdentifier");
    const regPassword = document.getElementById("regPassword");
    const regRole = document.getElementById("regRole");
    const signupMessage = document.getElementById("signupMessage");

    if (signupLink) {
        signupLink.addEventListener("click", function (e) {
            e.preventDefault();
            signupMessage.textContent = "";
            signupModal.style.display = "flex";
        });
    }

    if (closeSignupModal) {
        closeSignupModal.addEventListener("click", function () {
            signupModal.style.display = "none";
        });
    }

    signupModal.addEventListener("click", function (e) {
        if (e.target === signupModal) {
            signupModal.style.display = "none";
        }
    });

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = regName.value.trim();
            const idVal = regIdentifier.value.trim().toLowerCase();
            const pass = regPassword.value.trim();
            const role = regRole.value;

            if (!name || !idVal || !pass) return;

            const users = getRegisteredUsers();
            const alreadyExists = users.some(u => 
                (u.username && u.username.toLowerCase() === idVal) ||
                (u.email && u.email.toLowerCase() === idVal)
            );

            if (alreadyExists) {
                signupMessage.style.color = "#dc2626";
                signupMessage.textContent = "An account with this username/email already exists.";
                return;
            }

            const isEmail = idVal.includes("@");
            const newUser = {
                username: isEmail ? idVal.split("@")[0] : idVal,
                email: isEmail ? idVal : `${idVal}@learnhub.com`,
                password: pass,
                role: role,
                name: name
            };

            saveUser(newUser);

            signupMessage.style.color = "#15803d";
            signupMessage.textContent = "Account created successfully! Auto-filling login...";

            setTimeout(function () {
                usernameInput.value = idVal;
                passwordInput.value = pass;
                signupModal.style.display = "none";
                signupForm.reset();
            }, 1000);
        });
    }

    // =====================================
    // 9. FORGOT PASSWORD
    // =====================================

    if (forgotLink) {
        forgotLink.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Default demo accounts:\nStudent: 'ram' or 'ram@example.com' (password: password123)\nTeacher: 'teacher' or 'teacher@learnhub.com' (password: password123)");
        });
    }

});
