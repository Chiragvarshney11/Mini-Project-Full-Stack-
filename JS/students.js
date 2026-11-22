
const studentTableBody = document.getElementById("studentTableBody");
const studentModal = document.getElementById("studentModal");
const performanceModal = document.getElementById("performanceModal");
const studentForm = document.getElementById("studentForm");

const openAddStudent = document.getElementById("openAddStudent");
const closeStudentModal = document.getElementById("closeStudentModal");
const cancelStudent = document.getElementById("cancelStudent");
const closePerformanceModal = document.getElementById("closePerformanceModal");

const studentSearch = document.getElementById("studentSearch");
const courseFilter = document.getElementById("courseFilter");
const statusFilter = document.getElementById("statusFilter");
const emptyState = document.getElementById("emptyState");

const fields = {
    name: document.getElementById("studentName"),
    email: document.getElementById("studentEmail"),
    studentId: document.getElementById("studentId"),
    phone: document.getElementById("studentPhone"),
    department: document.getElementById("studentDepartment"),
    semester: document.getElementById("studentSemester"),
    course: document.getElementById("studentCourse"),
    progress: document.getElementById("studentProgress"),
    performance: document.getElementById("studentPerformance"),
    attendance: document.getElementById("studentAttendance"),
    assignment: document.getElementById("studentAssignment"),
    quiz: document.getElementById("studentQuiz"),
    enrollment: document.getElementById("studentEnrollment"),
    status: document.getElementById("studentStatus"),
    editId: document.getElementById("studentEditId")
};

const courses = [
    "Web Development",
    "Data Structures",
    "Computer Fundamentals"
];

const today = new Date();

function dateMonthsAgo(months) {
    const date = new Date(today.getFullYear(), today.getMonth() - months, 15);
    return date.toISOString().slice(0, 10);
}

const sampleStudents = [
    {
        id: "1",
        name: "Aarav Sharma",
        email: "aarav@gmail.com",
        studentId: "LH101",
        phone: "9876543210",
        department: "CSE",
        semester: "3",
        course: "Web Development",
        progress: 85,
        performance: 92,
        attendance: 94,
        assignment: 90,
        quiz: 94,
        enrollment: dateMonthsAgo(0),
        status: "Active"
    },
    {
        id: "2",
        name: "Priya Verma",
        email: "priya@gmail.com",
        studentId: "LH102",
        phone: "9876543211",
        department: "CSE",
        semester: "4",
        course: "Data Structures",
        progress: 65,
        performance: 78,
        attendance: 88,
        assignment: 75,
        quiz: 81,
        enrollment: dateMonthsAgo(1),
        status: "Active"
    },
    {
        id: "3",
        name: "Rahul Singh",
        email: "rahul@gmail.com",
        studentId: "LH103",
        phone: "9876543212",
        department: "IT",
        semester: "3",
        course: "Computer Fundamentals",
        progress: 25,
        performance: 38,
        attendance: 55,
        assignment: 35,
        quiz: 41,
        enrollment: dateMonthsAgo(2),
        status: "At Risk"
    },
    {
        id: "4",
        name: "Ananya Gupta",
        email: "ananya@gmail.com",
        studentId: "LH104",
        phone: "9876543213",
        department: "CSE",
        semester: "5",
        course: "Web Development",
        progress: 100,
        performance: 95,
        attendance: 98,
        assignment: 96,
        quiz: 94,
        enrollment: dateMonthsAgo(3),
        status: "Completed"
    },
    {
        id: "5",
        name: "Rohan Kumar",
        email: "rohan@gmail.com",
        studentId: "LH105",
        phone: "9876543214",
        department: "CSE",
        semester: "4",
        course: "Data Structures",
        progress: 40,
        performance: 45,
        attendance: 60,
        assignment: 42,
        quiz: 48,
        enrollment: dateMonthsAgo(4),
        status: "At Risk"
    },
    {
        id: "6",
        name: "Neha Agarwal",
        email: "neha@gmail.com",
        studentId: "LH106",
        phone: "9876543215",
        department: "ECE",
        semester: "2",
        course: "Computer Fundamentals",
        progress: 72,
        performance: 83,
        attendance: 91,
        assignment: 80,
        quiz: 86,
        enrollment: dateMonthsAgo(5),
        status: "Active"
    }
];

let students = [];
let charts = {};

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function saveStudents() {
    try {
        localStorage.setItem("learnhubStudents", JSON.stringify(students));
        return true;
    } catch (error) {
        console.error("Unable to save students:", error);
        alert("Unable to save data. Browser storage may be full.");
        return false;
    }
}

function loadStudents() {
    try {
        const saved = localStorage.getItem("learnhubStudents");

        if (saved === null) {
            students = sampleStudents;
            saveStudents();
        } else {
            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                throw new Error("Invalid student records");
            }

            students = parsed;
        }
    } catch (error) {
        console.error("Unable to load student data:", error);
        students = sampleStudents;
    }

    renderAll();
}

function updateStatistics() {
    const total = students.length;

    const active = students.filter(student =>
        student.status === "Active"
    ).length;

    const risk = students.filter(student =>
        student.status === "At Risk"
    ).length;

    const completed = students.filter(student =>
        student.status === "Completed"
    ).length;

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("activeStudents").textContent = active;
    document.getElementById("riskStudents").textContent = risk;
    document.getElementById("completedStudents").textContent = completed;
}

function getStatusClass(status) {
    if (status === "At Risk") return "status-risk";
    if (status === "Completed") return "status-completed";
    return "status-active";
}

function renderStudents() {
    const searchValue = studentSearch.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredStudents = students.filter(student => {

        const matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.email.toLowerCase().includes(searchValue) ||
            student.studentId.toLowerCase().includes(searchValue);

        const matchesCourse =
            selectedCourse === "all" ||
            student.course === selectedCourse;

        const matchesStatus =
            selectedStatus === "all" ||
            student.status === selectedStatus;

        return matchesSearch && matchesCourse && matchesStatus;
    });

    studentTableBody.innerHTML = "";

    filteredStudents.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="student-info">
                    <div class="student-avatar">
                        ${escapeHTML(student.name.charAt(0).toUpperCase())}
                    </div>

                    <div>
                        <h4>${escapeHTML(student.name)}</h4>
                        <p>${escapeHTML(student.email)}</p>
                    </div>
                </div>
            </td>

            <td>
                <span class="student-id">${escapeHTML(student.studentId)}</span>
            </td>

            <td>${escapeHTML(student.course)}</td>

            <td>
                <div class="progress-cell">
                    <div class="progress-value">
                        <span>Progress</span>
                        <span>${student.progress}%</span>
                    </div>

                    <div class="progress-track">
                        <div class="progress-fill" style="width:${student.progress}%"></div>
                    </div>
                </div>
            </td>

            <td>
                <span class="performance-score">${student.performance}%</span>
            </td>

            <td>${student.attendance}%</td>

            <td>
                <span class="status ${getStatusClass(student.status)}">
                    ${escapeHTML(student.status)}
                </span>
            </td>

            <td>
                <div class="actions">

                    <button class="action-btn view-btn" data-id="${student.id}" title="View Performance">
                        <i class="fa-solid fa-eye"></i>
                    </button>

                    <button class="action-btn edit-btn" data-id="${student.id}" title="Edit Student">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="action-btn delete delete-btn" data-id="${student.id}" title="Remove Student">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </td>
        `;

        studentTableBody.appendChild(row);
    });

    emptyState.classList.toggle("show", filteredStudents.length === 0);
}

function renderHighlights() {

    const topList = document.getElementById("topStudentsList");
    const riskList = document.getElementById("atRiskStudentsList");

    const topStudents = [...students]
        .sort((a, b) => b.performance - a.performance)
        .slice(0, 5);

    const riskStudents = students
        .filter(student =>
            student.status === "At Risk" ||
            student.attendance < 75 ||
            student.performance < 50
        )
        .sort((a, b) => a.performance - b.performance)
        .slice(0, 5);

    if (topStudents.length === 0) {
        topList.innerHTML = `<p class="highlight-empty">No student records available.</p>`;
    } else {
        topList.innerHTML = topStudents.map(student => `
            <div class="highlight-student">
                <div class="highlight-person">
                    <div class="student-avatar">
                        ${escapeHTML(student.name.charAt(0).toUpperCase())}
                    </div>
                    <div>
                        <h4>${escapeHTML(student.name)}</h4>
                        <p>${escapeHTML(student.course)}</p>
                    </div>
                </div>
                <span class="highlight-score">${student.performance}%</span>
            </div>
        `).join("");
    }

    if (riskStudents.length === 0) {
        riskList.innerHTML = `<p class="highlight-empty">No students currently need attention.</p>`;
    } else {
        riskList.innerHTML = riskStudents.map(student => `
            <div class="highlight-student">
                <div class="highlight-person">
                    <div class="student-avatar">
                        ${escapeHTML(student.name.charAt(0).toUpperCase())}
                    </div>
                    <div>
                        <h4>${escapeHTML(student.name)}</h4>
                        <p>${escapeHTML(student.course)}</p>
                    </div>
                </div>
                <span class="highlight-score">${student.performance}%</span>
            </div>
        `).join("");
    }
}

function createChart(id, config) {
    const canvas = document.getElementById(id);

    if (!canvas || typeof Chart === "undefined") return;

    if (charts[id]) {
        charts[id].destroy();
    }

    charts[id] = new Chart(canvas, config);
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    padding: 18,
                    font: {
                        family: "Arial",
                        size: 11
                    }
                }
            }
        }
    };
}

function renderEnrollmentChart() {

    const labels = [];
    const values = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

        labels.push(date.toLocaleString("en-US", { month: "short" }));

        const month = date.getMonth();
        const year = date.getFullYear();

        const count = students.filter(student => {
            if (!student.enrollment) return false;

            const enrollmentDate = new Date(student.enrollment + "T00:00:00");

            return enrollmentDate.getMonth() === month &&
                enrollmentDate.getFullYear() === year;
        }).length;

        values.push(count);
    }

    createChart("enrollmentChart", {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "New Enrollments",
                data: values,
                borderColor: "#2864e8",
                backgroundColor: "rgba(40, 100, 232, 0.12)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: "#2864e8"
            }]
        },
        options: {
            ...getChartOptions(),
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function renderCourseChart() {

    const labels = courses;
    const values = labels.map(course =>
        students.filter(student => student.course === course).length
    );

    createChart("courseChart", {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ["#2864e8", "#304d73", "#8ca6c7"],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },
        options: {
            ...getChartOptions(),
            cutout: "65%"
        }
    });
}

function renderPerformanceChart() {

    const categories = [
        { label: "Excellent", min: 85, max: 100 },
        { label: "Good", min: 70, max: 84 },
        { label: "Average", min: 50, max: 69 },
        { label: "Needs Improvement", min: 0, max: 49 }
    ];

    const values = categories.map(category =>
        students.filter(student =>
            student.performance >= category.min &&
            student.performance <= category.max
        ).length
    );

    createChart("performanceChart", {
        type: "bar",
        data: {
            labels: categories.map(category => category.label),
            datasets: [{
                label: "Number of Students",
                data: values,
                backgroundColor: ["#21834b", "#2864e8", "#d99a35", "#c74646"],
                borderRadius: 6,
                maxBarThickness: 48
            }]
        },
        options: {
            ...getChartOptions(),
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function renderAttendanceChart() {

    const categories = [
        { label: "Good (85%+)", min: 85, max: 100 },
        { label: "Moderate (75–84%)", min: 75, max: 84 },
        { label: "Low (Below 75%)", min: 0, max: 74 }
    ];

    const values = categories.map(category =>
        students.filter(student =>
            student.attendance >= category.min &&
            student.attendance <= category.max
        ).length
    );

    createChart("attendanceChart", {
        type: "doughnut",
        data: {
            labels: categories.map(category => category.label),
            datasets: [{
                data: values,
                backgroundColor: ["#21834b", "#d99a35", "#c74646"],
                borderColor: "#ffffff",
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions(),
            cutout: "62%"
        }
    });
}

function renderCharts() {
    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded. Check the Chart.js CDN.");
        return;
    }

    renderEnrollmentChart();
    renderCourseChart();
    renderPerformanceChart();
    renderAttendanceChart();
}

function renderAll() {
    updateStatistics();
    renderStudents();
    renderHighlights();
    renderCharts();
}

function openModal() {
    studentModal.classList.add("show");
}

function closeModal() {
    studentModal.classList.remove("show");
    studentForm.reset();
    fields.editId.value = "";

    document.getElementById("modalTitle").textContent = "Add New Student";
    document.getElementById("saveStudent").textContent = "Save Student";
    fields.enrollment.value = today.toISOString().slice(0, 10);
}

function editStudent(id) {

    const student = students.find(item => item.id === id);

    if (!student) return;

    fields.editId.value = student.id;
    fields.name.value = student.name;
    fields.email.value = student.email;
    fields.studentId.value = student.studentId;
    fields.phone.value = student.phone || "";
    fields.department.value = student.department || "CSE";
    fields.semester.value = student.semester || "1";
    fields.course.value = student.course;
    fields.progress.value = student.progress;
    fields.performance.value = student.performance;
    fields.attendance.value = student.attendance;
    fields.assignment.value = student.assignment;
    fields.quiz.value = student.quiz;
    fields.enrollment.value = student.enrollment || "";
    fields.status.value = student.status;

    document.getElementById("modalTitle").textContent = "Edit Student";
    document.getElementById("saveStudent").textContent = "Update Student";

    openModal();
}

function deleteStudent(id) {

    const student = students.find(item => item.id === id);

    if (!student) return;

    if (!confirm(`Are you sure you want to remove ${student.name}?`)) {
        return;
    }

    const previousStudents = students;

    students = students.filter(item => item.id !== id);

    if (saveStudents()) {
        renderAll();
    } else {
        students = previousStudents;
    }
}

function showPerformance(id) {

    const student = students.find(item => item.id === id);

    if (!student) return;

    document.getElementById("performanceStudentName").textContent =
        student.name + " - " + student.studentId;

    document.getElementById("performanceContent").innerHTML = `
        <div class="performance-detail">
            <div class="student-avatar">
                ${escapeHTML(student.name.charAt(0).toUpperCase())}
            </div>

            <div>
                <h3>${escapeHTML(student.name)}</h3>
                <p>${escapeHTML(student.course)} | ${escapeHTML(student.department || "N/A")}</p>
            </div>
        </div>

        ${createMetric("Course Progress", student.progress)}
        ${createMetric("Overall Performance", student.performance)}
        ${createMetric("Attendance", student.attendance)}
        ${createMetric("Assignment Average", student.assignment)}
        ${createMetric("Quiz Average", student.quiz)}

        <div class="performance-note">
            <strong>Student ID:</strong> ${escapeHTML(student.studentId)}<br>
            <strong>Email:</strong> ${escapeHTML(student.email)}<br>
            <strong>Phone:</strong> ${escapeHTML(student.phone || "Not provided")}<br>
            <strong>Department:</strong> ${escapeHTML(student.department || "N/A")}<br>
            <strong>Semester:</strong> ${escapeHTML(student.semester || "N/A")}<br>
            <strong>Status:</strong> ${escapeHTML(student.status)}<br>
            <strong>Enrollment Date:</strong> ${escapeHTML(student.enrollment || "N/A")}
        </div>
    `;

    performanceModal.classList.add("show");
}

function createMetric(label, value) {
    return `
        <div class="performance-metric">
            <div class="performance-metric-heading">
                <span>${label}</span>
                <strong>${value}%</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill" style="width:${value}%"></div>
            </div>
        </div>
    `;
}

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const student = {
        id: fields.editId.value || Date.now().toString(),
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        studentId: fields.studentId.value.trim(),
        phone: fields.phone.value.trim(),
        department: fields.department.value,
        semester: fields.semester.value,
        course: fields.course.value,
        progress: Number(fields.progress.value),
        performance: Number(fields.performance.value),
        attendance: Number(fields.attendance.value),
        assignment: Number(fields.assignment.value),
        quiz: Number(fields.quiz.value),
        enrollment: fields.enrollment.value,
        status: fields.status.value
    };

    const percentageFields = [
        student.progress,
        student.performance,
        student.attendance,
        student.assignment,
        student.quiz
    ];

    const validPercentages = percentageFields.every(value =>
        Number.isInteger(value) && value >= 0 && value <= 100
    );

    if (!validPercentages) {
        alert("All percentage values must be between 0 and 100.");
        return;
    }

    const duplicateId = students.some(item =>
        item.studentId.toLowerCase() === student.studentId.toLowerCase() &&
        item.id !== student.id
    );

    if (duplicateId) {
        alert("This Student ID already exists.");
        return;
    }

    const duplicateEmail = students.some(item =>
        item.email.toLowerCase() === student.email.toLowerCase() &&
        item.id !== student.id
    );

    if (duplicateEmail) {
        alert("This email is already registered.");
        return;
    }

    const previousStudents = students;

    if (fields.editId.value) {
        students = students.map(item =>
            item.id === student.id ? student : item
        );
    } else {
        students = [...students, student];
    }

    if (saveStudents()) {
        closeModal();
        renderAll();
    } else {
        students = previousStudents;
    }
});

studentTableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("view-btn")) {
        showPerformance(id);
    }

    if (button.classList.contains("edit-btn")) {
        editStudent(id);
    }

    if (button.classList.contains("delete-btn")) {
        deleteStudent(id);
    }
});

openAddStudent.addEventListener("click", function() {
    studentForm.reset();
    fields.editId.value = "";
    fields.enrollment.value = today.toISOString().slice(0, 10);

    document.getElementById("modalTitle").textContent = "Add New Student";
    document.getElementById("saveStudent").textContent = "Save Student";

    openModal();
});

closeStudentModal.addEventListener("click", closeModal);
cancelStudent.addEventListener("click", closeModal);

closePerformanceModal.addEventListener("click", function() {
    performanceModal.classList.remove("show");
});

studentSearch.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
statusFilter.addEventListener("change", renderStudents);

studentModal.addEventListener("click", function(event) {
    if (event.target === studentModal) closeModal();
});

performanceModal.addEventListener("click", function(event) {
    if (event.target === performanceModal) {
        performanceModal.classList.remove("show");
    }
});

loadStudents();

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