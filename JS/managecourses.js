const STORAGE_KEY = "learnhubCourses";
const tableBody = document.getElementById("courseTableBody");
const searchInput = document.getElementById("courseSearch");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

const DEFAULT_IMAGE = "\assets\assessment-logo.png";


let courses = [];
let selectedCourseId = null;

function createId() {
    return Date.now().toString() + Math.floor(Math.random() * 10000);
}

function normalizeCourse(course) {
    return {
        id: String(course.id ?? createId()),
        title: course.title ?? course.name ?? "Untitled Course",
        description: course.description ?? "",
        category: course.category ?? "Programming",
        duration: course.duration ?? "Not specified",
        image: course.image ?? course.coverImage ?? course.thumbnail ?? "",
        status: course.status ?? "Draft",
        students: Number(course.students ?? 0),
        level: course.level ?? "Beginner",
        lectures: Array.isArray(course.lectures)
            ? course.lectures.map(lecture => ({
                id: String(lecture.id ?? createId()),
                title: lecture.title ?? lecture.name ?? "Untitled Lecture",
                duration: lecture.duration ?? "Not specified",
                video: lecture.video ?? lecture.videoUrl ?? "",
                thumbnail: lecture.thumbnail ?? "",
                description: lecture.description ?? "",
                resource: lecture.resource ?? ""
            }))
            : []
    };
}

function saveCourses() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        return true;
    } catch (error) {
        console.error("Storage error:", error);
        alert("Unable to save data. Browser storage may be full.");
        return false;
    }
}

function initializeCourses() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);

            if (!Array.isArray(parsedData)) {
                throw new Error("Invalid course data");
            }

            courses = parsedData.map(normalizeCourse);
        } catch (error) {
            console.error("Unable to read saved courses:", error);
            courses = [];
        }
    } else {
        courses = [];

        if (tableBody) {
            const rows = tableBody.querySelectorAll("tr[data-course-id]");

            rows.forEach((row, index) => {
                const title = row.querySelector(".course-name-cell h4");
                const description = row.querySelector(".course-name-cell p");
                const image = row.querySelector(".course-name-cell img");
                const cells = row.querySelectorAll("td");
                const status = row.querySelector(".status");

                courses.push({
                    id: row.dataset.courseId || String(index + 1),
                    title: title?.textContent.trim() || "Untitled Course",
                    description: description?.textContent.trim() || "",
                    category: cells[1]?.textContent.trim() || "Programming",
                    duration: "Not specified",
                    image: image?.getAttribute("src") || "",
                    status: status?.textContent.trim() || "Draft",
                    students: Number(cells[3]?.textContent.trim() || 0),
                    level: "Beginner",
                    lectures: []
                });
            });
        }

        const firstCourse = courses[0];
        const sampleLectures = document.querySelectorAll(
            ".lecture-list .lecture-item"
        );

        if (firstCourse && sampleLectures.length) {
            firstCourse.lectures = Array.from(sampleLectures).map(item => ({
                id: item.dataset.lectureId || createId(),
                title: item.querySelector(".lecture-info h4")?.textContent.trim() || "",
                duration: item.querySelector(".lecture-info p")?.textContent.trim() || "",
                video: "",
                thumbnail: "",
                description: "",
                resource: ""
            }));
        }

        saveCourses();
    }

    selectedCourseId = courses[0]?.id || null;

    renderCourses();
}

function updateStatistics() {
    const total = courses.length;
    const published = courses.filter(course => course.status === "Published").length;
    const draft = courses.filter(course => course.status === "Draft").length;
    const archived = courses.filter(course => course.status === "Archived").length;

    const totalStudents = courses.reduce(
        (sum, course) => sum + course.students, 0
    );

    const update = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    update("totalCourses", total);
    update("publishedCourses", published);
    update("draftCourses", draft);
    update("archivedCourses", archived);

    const enrollmentTotal = document.querySelector(
        ".enrollment-card:first-child h2"
    );

    if (enrollmentTotal) {
        enrollmentTotal.textContent = totalStudents;
    }
}

function renderCourses() {
    if (!tableBody) {
        console.error("Course table body not found.");
        return;
    }

    const search = searchInput?.value.toLowerCase().trim() || "";
    const category = categoryFilter?.value || "all";
    const status = statusFilter?.value || "all";

    const filteredCourses = courses.filter(course => {
        const matchesSearch =
            course.title.toLowerCase().includes(search) ||
            course.description.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || course.category === category;

        const matchesStatus =
            status === "all" || course.status === status;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    tableBody.innerHTML = "";

    if (!filteredCourses.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No courses found.";
        cell.style.textAlign = "center";
        cell.style.padding = "30px";

        row.appendChild(cell);
        tableBody.appendChild(row);
    }

    filteredCourses.forEach(course => {
        const row = document.createElement("tr");
        row.dataset.courseId = course.id;

        const courseCell = document.createElement("td");
        const courseName = document.createElement("div");
        courseName.className = "course-name-cell";

        const image = document.createElement("img");
        image.src = course.image || DEFAULT_IMAGE;
        image.alt = course.title;
        image.onerror = () => {
            image.onerror = null;
            image.src = DEFAULT_IMAGE;
        };

        const details = document.createElement("div");
        const heading = document.createElement("h4");
        const description = document.createElement("p");

        heading.textContent = course.title;
        description.textContent = course.description;

        details.append(heading, description);
        courseName.append(image, details);
        courseCell.appendChild(courseName);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = course.category;

        const lectureCell = document.createElement("td");
        lectureCell.textContent = `${course.lectures.length} Lectures`;

        const studentCell = document.createElement("td");
        studentCell.textContent = course.students;

        const statusCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = `status ${course.status.toLowerCase()}`;
        badge.textContent = course.status;
        statusCell.appendChild(badge);

        const actionCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "table-actions";

        const buttons = [
            ["view-btn", "View Course", "fa-eye"],
            ["edit-btn", "Edit Course", "fa-pen"],
            [
                "status-btn",
                course.status === "Published" ? "Unpublish" : "Publish",
                course.status === "Published" ? "fa-eye-slash" : "fa-upload"
            ],
            ["archive-btn", course.status === "Archived" ? "Restore Course" : "Archive Course", "fa-box-archive"],
            ["delete-btn", "Delete Course", "fa-trash"]
        ];

        buttons.forEach(([className, title, icon]) => {
            const button = document.createElement("button");
            button.className = className;
            button.title = title;

            const iconElement = document.createElement("i");
            iconElement.className = `fa-solid ${icon}`;

            button.appendChild(iconElement);
            actions.appendChild(button);
        });

        actionCell.appendChild(actions);

        row.append(
            courseCell,
            categoryCell,
            lectureCell,
            studentCell,
            statusCell,
            actionCell
        );

        tableBody.appendChild(row);
    });

    updateStatistics();
    renderSelectedCourse();
}

function renderSelectedCourse() {
    const course = courses.find(item => item.id === selectedCourseId);

    if (!course) return;

    const overview = document.querySelector(".course-overview");

    if (overview) {
        const image = overview.querySelector(".course-detail-image img");
        const title = overview.querySelector(".course-detail-info h3");
        const description = overview.querySelector(".course-detail-info > p");
        const status = overview.querySelector(".course-detail-info .status");
        const meta = overview.querySelectorAll(".course-meta span");

        if (image) {
            image.src = course.image || DEFAULT_IMAGE;
            image.alt = course.title;
            image.onerror = () => {
                image.onerror = null;
                image.src = DEFAULT_IMAGE;
            };
        }

        if (title) title.textContent = course.title;
        if (description) description.textContent = course.description;

        if (status) {
            status.className = `status ${course.status.toLowerCase()}`;
            status.textContent = course.status;
        }

        if (meta[0]) {
            meta[0].innerHTML = `<i class="fa-solid fa-book"></i> ${course.lectures.length} Lectures`;
        }

        if (meta[1]) {
            meta[1].innerHTML = `<i class="fa-solid fa-users"></i> ${course.students} Students`;
        }

        if (meta[2]) {
            meta[2].innerHTML = `<i class="fa-solid fa-clock"></i> ${course.duration}`;
        }
    }

    const lectureList = document.querySelector(".lecture-list");

    if (!lectureList) return;

    lectureList.innerHTML = "";

    if (!course.lectures.length) {
        const empty = document.createElement("p");
        empty.textContent = "No lectures available for this course.";
        empty.style.padding = "20px";
        empty.style.color = "#8793a5";
        lectureList.appendChild(empty);
        return;
    }

    course.lectures.forEach((lecture, index) => {
        const item = document.createElement("div");
        item.className = "lecture-item";
        item.dataset.lectureId = lecture.id;

        const number = document.createElement("div");
        number.className = "lecture-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const info = document.createElement("div");
        info.className = "lecture-info";

        const heading = document.createElement("h4");
        heading.textContent = lecture.title;

        const duration = document.createElement("p");
        duration.textContent = lecture.duration;

        info.append(heading, duration);

        const actions = document.createElement("div");
        actions.className = "lecture-actions";

        actions.innerHTML = `
            <button class="lecture-edit-btn" title="Edit Lecture">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="lecture-delete-btn" title="Delete Lecture">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        item.append(number, info, actions);
        lectureList.appendChild(item);
    });
}

function editCourse(course) {
    const title = prompt("Enter course title:", course.title);

    if (title === null) return;

    if (!title.trim()) {
        alert("Course title cannot be empty.");
        return;
    }

    const description = prompt(
        "Enter course description:",
        course.description
    );

    if (description === null) return;

    course.title = title.trim();
    course.description = description.trim();

    if (saveCourses()) renderCourses();
}

function changeCourseStatus(course) {
    if (course.status === "Archived") {
        alert("Restore the archived course before publishing it.");
        return;
    }

    course.status = course.status === "Published" ? "Draft" : "Published";

    if (saveCourses()) renderCourses();
}

function archiveCourse(course) {
    if (course.status === "Archived") {
        if (!confirm(`Restore "${course.title}"?`)) return;
        course.status = "Draft";
    } else {
        if (!confirm(`Archive "${course.title}"?`)) return;
        course.status = "Archived";
    }

    if (saveCourses()) renderCourses();
}

function deleteCourse(course) {
    if (!confirm(`Permanently delete "${course.title}"?`)) return;

    courses = courses.filter(item => item.id !== course.id);

    if (selectedCourseId === course.id) {
        selectedCourseId = courses[0]?.id || null;
    }

    if (saveCourses()) renderCourses();
}

function addLecture(course) {
    const title = prompt("Enter lecture title:");

    if (title === null || !title.trim()) return;

    const duration = prompt("Enter lecture duration:");

    if (duration === null) return;

    const video = prompt("Enter lecture video URL:");

    if (video === null) return;

    course.lectures.push({
        id: createId(),
        title: title.trim(),
        duration: duration.trim() || "Not specified",
        video: video.trim(),
        thumbnail: "",
        description: "",
        resource: ""
    });

    if (saveCourses()) renderCourses();
}

function editLecture(course, lecture) {
    const title = prompt("Enter lecture title:", lecture.title);

    if (title === null || !title.trim()) return;

    const duration = prompt("Enter lecture duration:", lecture.duration);

    if (duration === null) return;

    const video = prompt("Enter video URL:", lecture.video);

    if (video === null) return;

    lecture.title = title.trim();
    lecture.duration = duration.trim();
    lecture.video = video.trim();

    if (saveCourses()) renderCourses();
}

function deleteLecture(course, lecture) {
    if (!confirm(`Delete "${lecture.title}"?`)) return;

    course.lectures = course.lectures.filter(
        item => item.id !== lecture.id
    );

    if (saveCourses()) renderCourses();
}

/* COURSE TABLE EVENTS */

if (tableBody) {
    tableBody.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button) return;

        const row = button.closest("tr");
        if (!row) return;

        const course = courses.find(
            item => item.id === row.dataset.courseId
        );

        if (!course) return;

        if (button.classList.contains("view-btn")) {
            selectedCourseId = course.id;
            renderSelectedCourse();

            document.querySelector(".course-details-section")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (button.classList.contains("edit-btn")) editCourse(course);
        if (button.classList.contains("status-btn")) changeCourseStatus(course);
        if (button.classList.contains("archive-btn")) archiveCourse(course);
        if (button.classList.contains("delete-btn")) deleteCourse(course);
    });
}

/* LECTURE EVENTS */

const manageLectureButton = document.querySelector(".manage-lecture-btn");

if (manageLectureButton) {
    manageLectureButton.addEventListener("click", () => {
        const course = courses.find(
            item => item.id === selectedCourseId
        );

        if (course) addLecture(course);
    });
}

const editDetailsButton = document.querySelector(".edit-course-details-btn");

if (editDetailsButton) {
    editDetailsButton.addEventListener("click", () => {
        const course = courses.find(
            item => item.id === selectedCourseId
        );

        if (course) editCourse(course);
    });
}

const lectureList = document.querySelector(".lecture-list");

if (lectureList) {
    lectureList.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button) return;

        const item = button.closest(".lecture-item");
        if (!item) return;

        const course = courses.find(
            item => item.id === selectedCourseId
        );

        if (!course) return;

        const lecture = course.lectures.find(
            item => item.id === itemElementId(item)
        );

        function itemElementId(element) {
            return element.dataset.lectureId;
        }

        if (!lecture) return;

        if (button.classList.contains("lecture-edit-btn")) {
            editLecture(course, lecture);
        }

        if (button.classList.contains("lecture-delete-btn")) {
            deleteLecture(course, lecture);
        }
    });
}

/* SEARCH AND FILTERS */

if (searchInput) {
    searchInput.addEventListener("input", renderCourses);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", renderCourses);
}

if (statusFilter) {
    statusFilter.addEventListener("change", renderCourses);
}

/* STORAGE SYNC */

window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) {
        initializeCourses();
    }
});

initializeCourses();

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