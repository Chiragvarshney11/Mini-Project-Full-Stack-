
"use strict";

// Select search input and all course rows
const searchInput = document.querySelector(".search-box input");
const courseRows = document.querySelectorAll(".course-row");
const coursesTable = document.querySelector(".courses-table");

// Create No Results message
const noResults = document.createElement("p");
noResults.textContent = "No courses found!";
noResults.style.textAlign = "center";
noResults.style.padding = "20px";
noResults.style.display = "none";

coursesTable.appendChild(noResults);


// LIVE COURSE SEARCH
searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase().trim();
    let visibleCourses = 0;

    courseRows.forEach(function (row) {

        const courseName = row.querySelector("h3").textContent.toLowerCase();
        const courseDescription = row.querySelector(".course-info p").textContent.toLowerCase();

        if (
            courseName.includes(searchValue) ||
            courseDescription.includes(searchValue)
        ) {
            row.style.display = "";
            visibleCourses++;
        } else {
            row.style.display = "none";
        }

    });

    // Show message if no course matches
    noResults.style.display = visibleCourses === 0 ? "block" : "none";

});


// AUTOMATIC DASHBOARD STATISTICS
function updateDashboardStats() {

    let totalCompletedLessons = 0;
    let totalProgress = 0;

    courseRows.forEach(function (row) {

        // Get completed lessons
        const lessonText = row.querySelector(".lessons").textContent;
        const lessonNumbers = lessonText.match(/(\d+)\s*\/\s*(\d+)/);

        if (lessonNumbers) {
            totalCompletedLessons += Number(lessonNumbers[1]);
        }

        // Get course progress
        const progressText = row.querySelector(".progress-text").textContent;
        totalProgress += Number.parseInt(progressText, 10) || 0;

    });

    const averageProgress = Math.round(totalProgress / courseRows.length);

    const statValues = document.querySelectorAll(".stat-card .value");

    // Update dashboard cards
    statValues[0].textContent = courseRows.length;
    statValues[1].textContent = totalCompletedLessons;
    statValues[3].textContent = averageProgress + "%";

}

// Run when page loads
updateDashboardStats();
