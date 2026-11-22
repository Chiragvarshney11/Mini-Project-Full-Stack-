
document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("mail");
    const phoneInput = document.getElementById("phoneno");

    const saveButton = document.querySelector(".details button");

    const STORAGE_KEY = "learnhubTeacherProfile";

    // Show success or error message
    function showMessage(message, type) {

        let messageBox = document.querySelector(".profile-message");

        if (!messageBox) {

            messageBox = document.createElement("p");
            messageBox.className = "profile-message";

            saveButton.insertAdjacentElement("afterend", messageBox);
        }

        messageBox.textContent = message;

        messageBox.style.marginTop = "12px";
        messageBox.style.fontSize = "14px";
        messageBox.style.fontWeight = "500";

        messageBox.style.color =
            type === "success" ? "#21834b" : "#d93636";
    }


    // Validate profile fields
    function validateProfile() {

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name) {
            showMessage("Please enter your full name.", "error");
            nameInput.focus();
            return false;
        }

        if (!email) {
            showMessage("Please enter your email address.", "error");
            emailInput.focus();
            return false;
        }

        if (!emailInput.checkValidity()) {
            showMessage("Please enter a valid email address.", "error");
            emailInput.focus();
            return false;
        }

        if (phone && !/^[0-9+\-\s()]{10,16}$/.test(phone)) {
            showMessage("Please enter a valid contact number.", "error");
            phoneInput.focus();
            return false;
        }

        return true;
    }


    // Update name in topbar
    function updateProfileDisplay(profileData) {

        // Update topbar name
        const topbarName = document.querySelector(".profile-name span");

        if (topbarName) {
            topbarName.textContent = profileData.fullName;
        }

        // Update avatar initial
        const profilePhoto = document.querySelector(".profile-photo");

        if (profilePhoto) {
            profilePhoto.textContent =
                profileData.fullName.charAt(0).toUpperCase();
        }

        // Update profile page heading
        const profileHeading = document.querySelector(".name h2");

        if (profileHeading) {
            profileHeading.textContent = profileData.fullName;
        }
    }


    // Save profile
    function saveProfile() {

        if (!validateProfile()) {
            return;
        }

        const profileData = {

            fullName: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()

        };

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(profileData)
            );

            // Update name immediately
            updateProfileDisplay(profileData);

            // Show success message
            showMessage("Profile saved successfully!", "success");

        }

        catch (error) {

            console.error("Profile saving error:", error);

            showMessage(
                "Unable to save profile. Please try again.",
                "error"
            );
        }
    }


    // Load saved profile
    function loadProfile() {

        const savedProfile = localStorage.getItem(STORAGE_KEY);

        if (!savedProfile) {
            return;
        }

        try {

            const profileData = JSON.parse(savedProfile);

            nameInput.value = profileData.fullName || "";
            emailInput.value = profileData.email || "";
            phoneInput.value = profileData.phone || "";

            updateProfileDisplay(profileData);

        }

        catch (error) {

            console.error("Unable to load profile:", error);
        }
    }


    // Save button event
    if (saveButton) {
        saveButton.addEventListener("click", saveProfile);
    }


    // Clear message when user starts editing
    [nameInput, emailInput, phoneInput].forEach(input => {

        if (input) {

            input.addEventListener("input", function () {

                const messageBox =
                    document.querySelector(".profile-message");

                if (messageBox) {
                    messageBox.textContent = "";
                }

            });

        }

    });


    // Load profile on page opening
    loadProfile();

    console.log("LearnHub Profile Connected Successfully");

});
