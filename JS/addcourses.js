
// ==========================================
// LEARNHUB - ADD COURSE JAVASCRIPT
// ==========================================


// GET HTML ELEMENTS

const courseForm = document.getElementById("courseForm");

const courseTitle = document.getElementById("courseTitle");
const courseCategory = document.getElementById("courseCategory");
const courseLevel = document.getElementById("courseLevel");
const courseDuration = document.getElementById("courseDuration");
const courseStatus = document.getElementById("courseStatus");
const courseDescription = document.getElementById("courseDescription");

const courseImage = document.getElementById("courseImage");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");
const removeImage = document.getElementById("removeImage");

const lectureContainer = document.getElementById("lectureContainer");
const addLectureBtn = document.getElementById("addLectureBtn");

const saveCourseBtn = document.getElementById("saveCourseBtn");
const formMessage = document.getElementById("formMessage");


// VARIABLES

let uploadedImage = "";
let lectureCount = 0;


// ==========================================
// 1. LOAD EXISTING COURSES
// ==========================================

function getCourses() {

    const savedCourses = localStorage.getItem("learnhubCourses");

    if (savedCourses) {

        try {
            const parsedCourses = JSON.parse(savedCourses);

            return Array.isArray(parsedCourses) ? parsedCourses : [];

        } catch (error) {

            console.error("Error loading courses:", error);
            return [];
        }
    }

    return [];
}


// ==========================================
// 2. IMAGE UPLOAD AND PREVIEW
// ==========================================

courseImage.addEventListener("change", function () {

    const file = courseImage.files[0];

    if (!file) {
        return;
    }

    // Check image type

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        alert("Please upload PNG, JPG or WEBP image.");

        courseImage.value = "";
        return;
    }

    // Check image size (2 MB)

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

        alert("Image size must be less than 2 MB.");

        courseImage.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        uploadedImage = event.target.result;

        previewImage.src = uploadedImage;

        imagePreview.style.display = "block";
    };

    reader.onerror = function () {

        alert("Unable to read the selected image.");

        courseImage.value = "";
    };

    reader.readAsDataURL(file);

});


// ==========================================
// 3. REMOVE IMAGE
// ==========================================

removeImage.addEventListener("click", function () {

    uploadedImage = "";

    courseImage.value = "";

    previewImage.src = "";

    imagePreview.style.display = "none";

});


// ==========================================
// 4. ADD LECTURE
// ==========================================

function addLecture() {

    lectureCount++;

    const lectureCard = document.createElement("div");

    lectureCard.className = "lecture-item";

    lectureCard.dataset.lectureId = lectureCount;

    lectureCard.innerHTML = `

        <div class="lecture-top">

            <div class="lecture-number">
                <i class="fa-solid fa-play"></i>
                <span>Lecture ${lectureCount}</span>
            </div>

            <button type="button" class="remove-lecture-btn">
                <i class="fa-solid fa-trash"></i>
                Remove
            </button>

        </div>

        <div class="form-group">

            <label>Lecture Title *</label>

            <input
                type="text"
                class="lecture-title"
                placeholder="e.g. Introduction to HTML"
                required
            >

        </div>

        <div class="form-group">

            <label>Lecture Description</label>

            <textarea
                class="lecture-description"
                rows="3"
                placeholder="What will students learn in this lecture?"
            ></textarea>

        </div>

        <div class="form-row">

            <div class="form-group">

                <label>Video URL *</label>

                <input
                    type="url"
                    class="lecture-video"
                    placeholder="https://example.com/video"
                    required
                >

            </div>

            <div class="form-group">

                <label>Duration</label>

                <input
                    type="text"
                    class="lecture-duration"
                    placeholder="e.g. 20 minutes"
                >

            </div>

        </div>

    `;

    lectureContainer.appendChild(lectureCard);

    updateLectureNumbers();
}


// ==========================================
// 5. UPDATE LECTURE NUMBERS
// ==========================================

function updateLectureNumbers() {

    const lectures = document.querySelectorAll(".lecture-item");

    lectures.forEach(function (lecture, index) {

        const number = lecture.querySelector(".lecture-number span");

        number.textContent = `Lecture ${index + 1}`;

    });

}


// ==========================================
// 6. REMOVE LECTURE
// ==========================================

lectureContainer.addEventListener("click", function (event) {

    const removeButton = event.target.closest(".remove-lecture-btn");

    if (!removeButton) {
        return;
    }

    const lectureCard = removeButton.closest(".lecture-item");

    lectureCard.remove();

    updateLectureNumbers();

});


// ==========================================
// 7. ADD LECTURE BUTTON
// ==========================================

addLectureBtn.addEventListener("click", function () {

    addLecture();

});


// ADD ONE LECTURE BY DEFAULT

addLecture();


// ==========================================
// 8. GET LECTURE DETAILS
// ==========================================

function getLectures() {

    const lectureCards = document.querySelectorAll(".lecture-item");

    const lectures = [];

    lectureCards.forEach(function (card, index) {

        const title = card.querySelector(".lecture-title").value.trim();

        const description = card.querySelector(".lecture-description").value.trim();

        const video = card.querySelector(".lecture-video").value.trim();

        const duration = card.querySelector(".lecture-duration").value.trim();

        lectures.push({

            lectureNumber: index + 1,

            title: title,

            description: description,

            video: video,

            duration: duration

        });

    });

    return lectures;

}


// ==========================================
// 9. SHOW FORM MESSAGE
// ==========================================

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


// ==========================================
// 10. SAVE COURSE
// ==========================================

courseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // GET COURSE DETAILS

    const title = courseTitle.value.trim();

    const category = courseCategory.value;

    const level = courseLevel.value;

    const duration = courseDuration.value.trim();

    const status = courseStatus.value;

    const description = courseDescription.value.trim();


    // GET LECTURES

    const lectures = getLectures();


    // VALIDATE LECTURES

    if (lectures.length === 0) {

        alert("Please add at least one lecture.");

        return;
    }

    const invalidLecture = lectures.some(function (lecture) {

        return !lecture.title || !lecture.video;

    });

    if (invalidLecture) {

        alert("Please enter the title and video URL for every lecture.");

        return;
    }


    // CHECK DUPLICATE COURSE

    const courses = getCourses();

    const duplicateCourse = courses.some(function (course) {

        return course.title.toLowerCase() === title.toLowerCase();

    });

    if (duplicateCourse) {

        alert("A course with this title already exists.");

        return;
    }


    // CREATE COURSE OBJECT

    const newCourse = {

        id: Date.now().toString(),

        title: title,

        category: category,

        level: level,

        duration: duration,

        status: status,

        description: description,

        image: uploadedImage,

        lectures: lectures,

        createdAt: new Date().toISOString()

    };


    // SAVE COURSE

    courses.push(newCourse);

    try {

        localStorage.setItem(
            "learnhubCourses",
            JSON.stringify(courses)
        );

        showMessage("Course saved successfully!", "success");

        alert("Course created successfully!");

        courseForm.reset();

        uploadedImage = "";

        courseImage.value = "";

        previewImage.src = "";

        imagePreview.style.display = "none";

        lectureContainer.innerHTML = "";

        lectureCount = 0;

        addLecture();

    } catch (error) {

        console.error("Course saving error:", error);

        showMessage(
            "Unable to save course. Image may be too large for browser storage.",
            "error"
        );

        alert("Unable to save course. Try using a smaller image.");

    }

});


// ==========================================
// 11. RESET FORM
// ==========================================

courseForm.addEventListener("reset", function () {

    setTimeout(function () {

        uploadedImage = "";

        courseImage.value = "";

        previewImage.src = "";

        imagePreview.style.display = "none";

        lectureContainer.innerHTML = "";

        lectureCount = 0;

        addLecture();

        formMessage.textContent = "";

        formMessage.className = "form-message";

    }, 0);

});


// ==========================================
// 12. INITIAL SETUP
// ==========================================

imagePreview.style.display = "none";
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