document.addEventListener("DOMContentLoaded", function () {

    console.log("Student Profile JS Connected!");

    // =====================================
    // 1. SELECT HTML ELEMENTS
    // =====================================

    const profileForm = document.getElementById("profile-form");
    const saveButton = document.querySelector(".save-btn");

    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const courseInput = document.getElementById("course");

    const displayName = document.getElementById("display-name");
    const displayEmail = document.getElementById("display-email");
    const displayPhone = document.getElementById("display-phone");

    const topAvatar = document.getElementById("top-avatar");
    const topUsername = document.getElementById("top-username");

    const studentAvatar = document.querySelector(".student-avatar");
    const studentRole = document.querySelector(".student-role");

    const saveMessage = document.getElementById("save-message");

    const STORAGE_KEY = "learnhubStudentProfile";


    // =====================================
    // 2. CHECK ELEMENTS
    // =====================================

    if (
        !profileForm ||
        !nameInput ||
        !emailInput ||
        !phoneInput ||
        !courseInput
    ) {
        console.error("Profile form or input elements not found!");
        return;
    }


    // =====================================
    // 3. GET FORM DATA
    // =====================================

    function getProfileData() {

        return {
            fullName: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            course: courseInput.value.trim()
        };

    }


    // =====================================
    // 4. UPDATE PROFILE DISPLAY
    // =====================================

    function updateProfile(profile) {

        const firstLetter = profile.fullName
            ? profile.fullName.trim().charAt(0).toUpperCase()
            : "A";


        // Update profile name and verified badge
        if (displayName) {

            displayName.innerHTML = "";

            displayName.appendChild(
                document.createTextNode(profile.fullName + " ")
            );

            const verifiedIcon = document.createElement("i");
            verifiedIcon.className = "fa-solid fa-circle-check verified";

            displayName.appendChild(verifiedIcon);

        }


        // Update email
        if (displayEmail) {
            displayEmail.textContent = profile.email;
        }


        // Update phone
        if (displayPhone) {
            displayPhone.textContent = profile.phone;
        }


        // Update student avatar
        if (studentAvatar) {
            studentAvatar.textContent = firstLetter;
        }


        // Update topbar avatar
        if (topAvatar) {
            topAvatar.textContent = firstLetter;
        }


        // Update topbar username (use first name if available)
        if (topUsername) {
            const firstName = profile.fullName.trim().split(" ")[0];
            topUsername.textContent = firstName || profile.fullName;
        }


        // Update course / role
        if (studentRole) {
            const courseText = profile.course.trim();
            studentRole.textContent = courseText.toLowerCase().endsWith("student")
                ? courseText
                : courseText + " Student";
        }

    }


    // =====================================
    // 5. VALIDATE FORM
    // =====================================

    function validateProfile(profile) {

        if (
            !profile.fullName ||
            !profile.email ||
            !profile.phone ||
            !profile.course
        ) {

            showMessage("Please fill all the fields.", "error");

            return false;

        }


        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(profile.email)) {

            showMessage("Please enter a valid email address.", "error");

            return false;

        }


        const phonePattern = /^[0-9+\-\s()]{10,18}$/;

        if (!phonePattern.test(profile.phone)) {

            showMessage("Please enter a valid contact number.", "error");

            return false;

        }

        return true;

    }


    // =====================================
    // 6. SHOW MESSAGE
    // =====================================

    function showMessage(message, type) {

        if (!saveMessage) return;

        saveMessage.textContent = message;

        if (type === "success") {
            saveMessage.style.color = "#159447";
        } else {
            saveMessage.style.color = "#dc2626";
        }

    }


    // =====================================
    // 7. SAVE PROFILE TO LOCAL STORAGE
    // =====================================

    function saveProfile(profile) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(profile)
        );

    }


    // =====================================
    // 8. LOAD PROFILE FROM LOCAL STORAGE
    // =====================================

    function loadProfile() {

        try {

            const savedData = localStorage.getItem(STORAGE_KEY);

            if (savedData) {

                const profile = JSON.parse(savedData);

                // Fill form inputs
                if (profile.fullName) nameInput.value = profile.fullName;
                if (profile.email) emailInput.value = profile.email;
                if (profile.phone) phoneInput.value = profile.phone;
                if (profile.course) courseInput.value = profile.course;

                // Update profile display
                updateProfile(profile);

                console.log("Saved profile loaded:", profile);

            } else {

                // First visit: use HTML default values
                const defaultProfile = getProfileData();

                updateProfile(defaultProfile);

                console.log("Default profile loaded.");

            }

        } catch (error) {

            console.error("Profile loading error:", error);

            showMessage(
                "Unable to load saved profile.",
                "error"
            );

        }

    }


    // =====================================
    // 9. SAVE HANDLER
    // =====================================

    function handleSave(event) {

        if (event) {
            event.preventDefault();
        }

        console.log("Save Changes triggered!");

        const profile = getProfileData();

        // Validate
        if (!validateProfile(profile)) {
            return;
        }

        try {

            // Save data
            saveProfile(profile);

            // Update page immediately
            updateProfile(profile);

            // Success message
            showMessage(
                "Profile updated successfully!",
                "success"
            );

            console.log("Profile saved successfully:", profile);

        } catch (error) {

            console.error("Profile saving error:", error);

            showMessage(
                "Unable to save profile. Please check browser storage.",
                "error"
            );

        }

    }

    profileForm.addEventListener("submit", handleSave);

    if (saveButton && saveButton.type !== "submit") {
        saveButton.addEventListener("click", handleSave);
    }


    // =====================================
    // 10. CLEAR MESSAGE WHEN USER EDITS
    // =====================================

    profileForm.addEventListener("input", function () {

        if (saveMessage) {
            saveMessage.textContent = "";
        }

    });


    // =====================================
    // 11. SYNC OTHER BROWSER TABS
    // =====================================

    window.addEventListener("storage", function (event) {

        if (event.key === STORAGE_KEY) {
            loadProfile();
        }

    });


    // =====================================
    // 12. INITIALIZE PROFILE
    // =====================================

    loadProfile();


    // =====================================
    // 13. TOPBAR DROPDOWN & LOGOUT
    // =====================================

    const topProfileBtn = document.getElementById("profileBtn") || document.querySelector(".user-menu-trigger");
    const topProfileMenu = document.getElementById("profileMenu") || document.querySelector(".user-dropdown");
    const topLogoutBtn = document.getElementById("logoutBtn");

    if (topProfileBtn && topProfileMenu) {
        topProfileBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            topProfileMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest("#userMenu") && !event.target.closest(".user-menu")) {
                topProfileMenu.classList.remove("show");
            }
        });
    }

    if (topLogoutBtn) {
        topLogoutBtn.addEventListener("click", function () {
            sessionStorage.clear();
        });
    }

});
