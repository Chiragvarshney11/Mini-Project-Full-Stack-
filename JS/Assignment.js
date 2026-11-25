
document.addEventListener("DOMContentLoaded", function () {

    // ASSIGNMENT DEFAULT DATA
    const defaultStatuses = {
        "HTML Basics": "Submitted",
        "CSS Fundamentals": "Submitted",
        "JavaScript Basics": "Upcoming",
        "Python Programming": "Submitted",
        "Database Management": "Pending",
        "Data Structures": "Submitted",
        "Computer Networks": "Upcoming"
    };

    const assignmentRows = Array.from(document.querySelectorAll("tbody tr"));

    function getAssignmentName(row) {
        const element = row.querySelector(".assignment-name strong") ||
            row.querySelector(".assignment-name") ||
            row.querySelector("td:first-child strong");

        return element ? element.textContent.trim() : "";
    }

    function getStatus(name) {
        return localStorage.getItem("assignment_" + name) ||
            defaultStatuses[name] || "Pending";
    }

    function paintStatus(element, status) {
        if (!element) return;

        element.textContent = status;
        element.classList.remove("pending", "submitted", "upcoming");
        element.classList.add(status.toLowerCase());
    }

    // ASSIGNMENT LIST
    function updateAssignmentList() {
        let submitted = 0;
        let pending = 0;
        let upcoming = 0;

        assignmentRows.forEach(row => {
            const name = getAssignmentName(row);
            const statusElement = row.querySelector(".status");
            const submitButton = row.querySelector(".submit-btn");

            if (!name || !statusElement) return;

            const status = getStatus(name);
            paintStatus(statusElement, status);

            if (status === "Submitted") submitted++;
            else if (status === "Upcoming") upcoming++;
            else pending++;

            if (submitButton) {
                submitButton.style.display =
                    status === "Pending" ? "inline-block" : "none";
            }
        });

        const summaryValues = document.querySelectorAll(".summary-card h2");

        if (summaryValues.length >= 4) {
            summaryValues[0].textContent = assignmentRows.length;
            summaryValues[1].textContent = submitted;
            summaryValues[2].textContent = pending;
            summaryValues[3].textContent = upcoming;
        }
    }

    updateAssignmentList();

    // REMEMBER SELECTED ASSIGNMENT
    document.querySelectorAll(".submit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest("tr");

            if (row) {
                sessionStorage.setItem(
                    "currentAssignment",
                    getAssignmentName(row)
                );
            }
        });
    });

    // SEARCH
    const searchInput =
        document.getElementById("searchInput") ||
        document.querySelector(".search-box input");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.trim().toLowerCase();

            assignmentRows.forEach(row => {
                row.style.display = row.textContent
                    .toLowerCase().includes(query) ? "" : "none";
            });

            document.querySelectorAll(".course-card").forEach(card => {
                card.style.display = card.textContent
                    .toLowerCase().includes(query) ? "" : "none";
            });
        });
    }

    // STATUS FILTER
    const statusFilter = document.getElementById("statusFilter");

    if (statusFilter) {
        statusFilter.addEventListener("change", function () {
            const selected = this.value.trim().toLowerCase();

            assignmentRows.forEach(row => {
                const status = row.querySelector(".status");
                if (!status) return;

                row.style.display =
                    !selected ||
                    selected === "all" ||
                    status.textContent.trim().toLowerCase() === selected
                        ? "" : "none";
            });
        });
    }

    // ASSIGNMENT DETAILS
    const detailTitle = document.querySelector(".assignment-title h1");

    if (detailTitle) {
        const name = detailTitle.textContent.trim();
        const status = getStatus(name);

        document.querySelectorAll(
            ".assignment-header .status, .submission-status .status"
        ).forEach(el => paintStatus(el, status));

        const message = document.querySelector(".submission-status p");

        if (message) {
            message.textContent = status === "Submitted"
                ? "Your assignment has been submitted successfully."
                : status === "Upcoming"
                    ? "This assignment is not open for submission yet."
                    : "You have not submitted this assignment yet.";
        }

        const detailSubmit = document.querySelector(".actions .submit-btn");

        if (detailSubmit) {
            detailSubmit.style.display =
                status === "Pending" ? "inline-block" : "none";
        }
    }

    // ASSIGNMENT SUBMISSION
    const submitAssignment = document.getElementById("submitAssignment");
    const assignmentFile = document.getElementById("assignmentFile");
    const submissionStatus = document.getElementById("submissionStatus");

    const selectedAssignment =
        sessionStorage.getItem("currentAssignment") || "CSS Fundamentals";

    const selectedKey = "assignment_" + selectedAssignment;

    if (assignmentFile) {
        const pageDescription = document.querySelector(".page-header p");
        const infoName = document.querySelector(".assignment-info .info-card strong");

        if (pageDescription) {
            pageDescription.textContent =
                "Upload your work for " + selectedAssignment;
        }

        if (infoName) {
            infoName.textContent = selectedAssignment;
        }

        const selectedStatus = getStatus(selectedAssignment);
        paintStatus(submissionStatus, selectedStatus);

        if (submitAssignment) {
            submitAssignment.style.display =
                selectedStatus === "Pending" ? "inline-block" : "none";
        }
    }

    if (submitAssignment) {
        submitAssignment.addEventListener("click", function (event) {
            event.preventDefault();

            if (!assignmentFile || !assignmentFile.files.length) {
                alert("Please select a file first!");
                return;
            }

            const file = assignmentFile.files[0];
            const allowedExtensions = ["pdf", "doc", "docx", "zip"];
            const extension = file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(extension)) {
                alert("Please upload a PDF, DOC, DOCX or ZIP file.");
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                alert("File size should not exceed 10MB!");
                return;
            }

            localStorage.setItem(selectedKey, "Submitted");
            sessionStorage.removeItem("currentAssignment");

            alert("Assignment submitted successfully!");
            window.location.href = "assignment-list.html";
        });
    }

    // MY PROGRESS
   // MY PROGRESS
const courseCards = document.querySelectorAll(".course-card");

if (courseCards.length > 0) {
    let totalProgress = 0;
    let completedCourses = 0;

    courseCards.forEach(card => {
        const completed = Number(card.dataset.completed) || 0;
        const total = Number(card.dataset.total) || 0;

        const percentage = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        totalProgress += percentage;

        const percentageElement = card.querySelector(".percentage");
        const progressBar = card.querySelector(".progress");
        const lessonCount = card.querySelector(".lesson-count");
        const statusElement = card.querySelector(".course-status");

        if (percentageElement) {
            percentageElement.textContent = percentage + "%";
        }

        if (progressBar) {
            progressBar.style.width = percentage + "%";
        }

        if (lessonCount) {
            lessonCount.textContent =
                completed + " of " + total + " lessons completed";
        }

        const courseStatus =
            total > 0 && percentage === 100 ? "Completed" : "In Progress";

        if (courseStatus === "Completed") {
            completedCourses++;
        }

        if (statusElement) {
            statusElement.textContent = courseStatus;
        }
    });

    const totalCourses = courseCards.length;
    const averageProgress = Math.round(totalProgress / totalCourses);

    const totalEl = document.getElementById("totalCourses");
    const completedEl = document.getElementById("completedCourses");
    const inProgressEl = document.getElementById("inProgressCourses");
    const averageEl = document.getElementById("averageProgress");

    if (totalEl) totalEl.textContent = totalCourses;
    if (completedEl) completedEl.textContent = completedCourses;
    if (inProgressEl) {
        inProgressEl.textContent = totalCourses - completedCourses;
    }
    if (averageEl) {
        averageEl.textContent = averageProgress + "%";
    }
}

    // QUIZ TIMER
    const timerElement = document.getElementById("timer");

    if (timerElement) {
        let timeLeft = 5 * 60;

        const timer = setInterval(function () {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerElement.textContent =
                String(minutes).padStart(2, "0") + ":" +
                String(seconds).padStart(2, "0");

            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time is over!");
                window.location.href = "quiz-result.html";
                return;
            }

            timeLeft--;
        }, 1000);
    }

    // QUIZ QUESTION NAVIGATION
    const questions = document.querySelectorAll(".question");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (questions.length) {
        let currentQuestion = 0;

        function showQuestion(index) {
            questions.forEach((question, i) => {
                question.style.display =
                    i === index ? "block" : "none";
            });

            if (prevBtn) {
                prevBtn.style.display =
                    index === 0 ? "none" : "inline-block";
            }

            if (nextBtn) {
                nextBtn.style.display =
                    index === questions.length - 1
                        ? "none" : "inline-block";
            }
        }

        showQuestion(currentQuestion);

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                if (currentQuestion < questions.length - 1) {
                    showQuestion(++currentQuestion);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                if (currentQuestion > 0) {
                    showQuestion(--currentQuestion);
                }
            });
        }
    }

    // QUIZ RESULT
    const submitQuiz = document.getElementById("submitQuiz");

    if (submitQuiz) {
        submitQuiz.addEventListener("click", function () {
            const correct = document.querySelectorAll(
                ".question input:checked[data-correct='true']"
            ).length;

            const percentage = questions.length
                ? Math.round(correct / questions.length * 100)
                : 0;

            localStorage.setItem("quizScore", correct);
            localStorage.setItem("quizPercentage", percentage);

            window.location.href = "quiz-result.html";
        });
    }

   // QUIZ RESULT
const scoreElement = document.getElementById("score");
const resultPercentage = document.getElementById("percentage");

if (scoreElement) {
    scoreElement.textContent =
        localStorage.getItem("quizScore") || "0";
}

if (resultPercentage) {
    resultPercentage.textContent =
        (localStorage.getItem("quizPercentage") || "0") + "%";
}

// PROFILE DROPDOWN
const profileBtn = document.getElementById("profileBtn") || document.getElementById("userMenuTrigger") || document.querySelector(".user-menu-trigger") || document.querySelector(".student-profile");
const profileMenu = document.getElementById("profileMenu") || document.getElementById("userDropdown") || document.querySelector(".user-dropdown") || document.querySelector(".dropdown-menu");

if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        profileMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".user-menu") && !event.target.closest(".profile-dropdown")) {
            profileMenu.classList.remove("show");
        }
    });
}

// LOGOUT HANDLER
document.querySelectorAll(".logout a, #logoutBtn, .dropdown-item[href='login.html']").forEach(link => {
    link.addEventListener("click", function () {
        sessionStorage.clear();
    });
});

// SYNC PROFILE INFO FROM LOCAL STORAGE
try {
    const savedProfile = localStorage.getItem("learnhubStudentProfile");
    if (savedProfile) {
        const data = JSON.parse(savedProfile);
        const nameEl = document.getElementById("topUsername") || document.querySelector(".student-name") || document.querySelector(".student-info strong");
        const avatarEl = document.getElementById("topAvatar") || document.querySelector(".student-avatar") || document.querySelector(".profile-icon");
        if (nameEl && data.fullName) {
            nameEl.textContent = data.fullName.trim().split(" ")[0] || data.fullName;
        }
        if (avatarEl && data.fullName) {
            avatarEl.textContent = data.fullName.trim().charAt(0).toUpperCase();
        }
    }
} catch (e) {
    console.error("Profile sync error in Assignment.js:", e);
}

});