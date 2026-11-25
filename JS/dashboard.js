
const STORAGE_KEY = "learnhubCourses";
const PROFILE_KEY = "learnhubTeacherProfile";

const courseTable = document.querySelector(".course-table");
const searchInput = document.querySelector(".search input");

let courses = [];

function loadCourses() {
    try {
        const savedCourses = localStorage.getItem(STORAGE_KEY);

        courses = savedCourses ? JSON.parse(savedCourses) : [];

        if (!Array.isArray(courses)) {
            courses = [];
        }
    } catch (error) {
        console.error("Unable to load courses:", error);
        courses = [];
    }
}

function updateStatistics() {
    const totalCourses = courses.length;

    const totalStudents = courses.reduce((sum, course) => {
        return sum + Number(course.students || 0);
    }, 0);

    const totalLessons = courses.reduce((sum, course) => {
        const lectures = Array.isArray(course.lectures)
            ? course.lectures.length
            : 0;

        return sum + lectures;
    }, 0);

    const stats = document.querySelector(".stats");

    if (!stats) return;

    const values = stats.querySelectorAll("h2");

    if (values[0]) values[0].textContent = totalCourses;
    if (values[1]) values[1].textContent = totalStudents;
    if (values[2]) values[2].textContent = totalLessons;
}

function renderCourses() {
    if (!courseTable) return;

    const existingHeader = courseTable.querySelector(".table-header");

    courseTable.innerHTML = "";

    if (existingHeader) {
        courseTable.appendChild(existingHeader);
    }

    if (courses.length === 0) {
        const emptyMessage = document.createElement("div");

        emptyMessage.className = "course-row";
        emptyMessage.textContent = "No courses available. Add your first course.";

        courseTable.appendChild(emptyMessage);
        return;
    }

    const searchValue = searchInput?.value.toLowerCase().trim() || "";

    const filteredCourses = courses.filter(course => {
        const title = String(course.title || course.name || "").toLowerCase();
        const description = String(course.description || "").toLowerCase();

        return title.includes(searchValue) || description.includes(searchValue);
    });

    if (filteredCourses.length === 0) {
        const emptyMessage = document.createElement("div");

        emptyMessage.className = "course-row";
        emptyMessage.textContent = "No matching courses found.";

        courseTable.appendChild(emptyMessage);
        return;
    }

    filteredCourses.forEach(course => {
        const row = document.createElement("div");
        row.className = "course-row";

        const courseInfo = document.createElement("div");
        courseInfo.className = "course-info";

        const image = document.createElement("img");

        image.src = course.image || course.coverImage || course.thumbnail ||
            "../assets/teacher-Learnhub logo.png";

        image.alt = course.title || "Course";

        image.onerror = () => {
            image.onerror = null;
            image.src = "../assets/teacher-Learnhub logo.png";
        };

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = course.title || course.name || "Untitled Course";

        const description = document.createElement("p");
        description.textContent = course.description || course.category || "";

        details.append(title, description);
        courseInfo.append(image, details);

        const students = document.createElement("div");
        students.className = "number";
        students.textContent = Number(course.students || 0);

        const lessons = document.createElement("div");
        lessons.className = "number";

        lessons.textContent = Array.isArray(course.lectures)
            ? course.lectures.length
            : 0;

        const statusContainer = document.createElement("div");

        const status = document.createElement("span");
        const courseStatus = course.status || "Draft";

        status.className = `status ${courseStatus.toLowerCase()}`;
        status.textContent = courseStatus;

        statusContainer.appendChild(status);

        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            window.location.href = "managecourses.html";
        });

        const moreButton = document.createElement("button");
        moreButton.className = "more";
        moreButton.textContent = "⋮";
        moreButton.title = "Manage Course";

        moreButton.addEventListener("click", () => {
            window.location.href = "managecourses.html";
        });

        actions.append(editButton, moreButton);

        row.append(
            courseInfo,
            students,
            lessons,
            statusContainer,
            actions
        );

        courseTable.appendChild(row);
    });
}

function loadTeacherProfile() {
    try {
        const savedProfile = localStorage.getItem(PROFILE_KEY);

        if (!savedProfile) return;

        const profile = JSON.parse(savedProfile);

        const teacherName = profile.fullName;

        if (!teacherName) return;

        const welcomeHeading = document.querySelector(".welcome-tag h1");
        const profileName = document.querySelector(".profile-name span");
        const profilePhoto = document.querySelector(".profile-photo");

        if (welcomeHeading) {
            welcomeHeading.textContent = `Welcome back, ${teacherName}!`;
        }

        if (profileName) {
            profileName.textContent = teacherName;
        }

        if (profilePhoto) {
            profilePhoto.textContent = teacherName.charAt(0).toUpperCase();
        }

    } catch (error) {
        console.error("Unable to load teacher profile:", error);
    }
}

function setupQuickActions() {
    const addCourse = document.querySelector(".addcourse");
    const addLesson = document.querySelector(".addlesson");
    const viewStudents = document.querySelector(".viewstud");
    const viewReports = document.querySelector(".viewreports");
    const viewAll = document.querySelector(".view-all");

    if (addCourse) {
        addCourse.href = "addcourses.html";
    }

    if (addLesson) {
        addLesson.href = "managecourses.html";
    }

    if (viewStudents) {
        viewStudents.href = "students.html";
    }

    if (viewReports) {
        viewReports.href = "#";
        viewReports.addEventListener("click", event => {
            event.preventDefault();
            alert("Reports section will be available soon.");
        });
    }

    if (viewAll) {
        viewAll.href = "managecourses.html";
    }
}

function setupSearch() {
    if (searchInput) {
        searchInput.addEventListener("input", renderCourses);
    }
}

function initializeDashboard() {
    loadCourses();
    updateStatistics();
    renderCourses();
    loadTeacherProfile();
    setupQuickActions();
    setupSearch();
}

window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) {
        loadCourses();
        updateStatistics();
        renderCourses();
    }

    if (event.key === PROFILE_KEY) {
        loadTeacherProfile();
    }
});

initializeDashboard();

console.log("LearnHub Dashboard JavaScript Connected Successfully");


document.addEventListener("DOMContentLoaded", function () {

    const savedProfile = JSON.parse(
        localStorage.getItem("learnhubTeacherProfile")
    );

    if (!savedProfile) return;

    const topbarName = document.querySelector(".profile-name span");

    if (topbarName) {
        topbarName.textContent = savedProfile.fullName;
    }

    const profilePhoto = document.querySelector(".profile-photo");

    if (profilePhoto) {
        profilePhoto.textContent =
            savedProfile.fullName.charAt(0).toUpperCase();
    }

});