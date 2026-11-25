
"use strict";

// ========================================
// 1. ALL COURSE DATA
// ========================================

const courses = {

    web: {
        name: "Web Development",
        description: "HTML, CSS and JavaScript",
        lessons: [
            "Introduction to Web Development",
            "Introduction to HTML",
            "HTML Tags and Attributes",
            "HTML Forms and Tables",
            "Semantic HTML",
            "Introduction to CSS",
            "CSS Selectors",
            "Colors, Fonts and Backgrounds",
            "CSS Box Model",
            "CSS Flexbox",
            "CSS Grid",
            "Responsive Web Design",
            "Media Queries",
            "Introduction to JavaScript",
            "JavaScript Variables",
            "JavaScript Data Types",
            "JavaScript Functions",
            "DOM Manipulation",
            "JavaScript Events",
            "Mini Website Project"
        ]
    },

    python: {
        name: "Python Programming",
        description: "Python basics and programming",
        lessons: [
            "Introduction to Python", "Variables and Data Types",
            "Operators in Python", "Conditional Statements", "Loops",
            "Functions", "Lists", "Tuples", "Sets", "Dictionaries",
            "Strings and String Methods", "File Handling",
            "Exception Handling", "Object-Oriented Programming",
            "Classes and Objects", "Inheritance",
            "Modules and Packages", "Lambda Functions",
            "Python Libraries", "Mini Python Project"
        ]
    },

    database: {
        name: "Database Management",
        description: "SQL and database concepts",
        lessons: [
            "Introduction to DBMS", "Database Concepts",
            "Database Tables", "Primary and Foreign Keys",
            "SQL Introduction", "DDL Commands", "DML Commands",
            "DQL Commands", "SQL Constraints", "WHERE Clause",
            "ORDER BY and GROUP BY", "Aggregate Functions",
            "Joins in SQL", "Subqueries", "Database Relationships",
            "Normalization", "Indexing", "Views", "Transactions",
            "Database Project"
        ]
    },

    computer: {
        name: "Computer Science",
        description: "Data Structures and Networks",
        lessons: [
            "Introduction to Computer Science", "Computer Fundamentals",
            "Computer Hardware", "Computer Software", "Number Systems",
            "Data Representation", "Computer Architecture",
            "CPU and Its Components", "Memory Organization",
            "Operating System Basics", "Types of Operating Systems",
            "Process Management", "Memory Management", "File Systems",
            "Networking Basics", "Network Topologies",
            "Internet Fundamentals", "Cyber Security Basics",
            "Cloud Computing", "Computer Science Project"
        ]
    },

    javascript: {
        name: "JavaScript Basics",
        description: "Variables and Functions",
        lessons: [
            "Introduction to JavaScript", "Variables and Data Types",
            "Operators", "Conditional Statements", "Loops", "Functions",
            "Arrow Functions", "Arrays", "Array Methods", "Objects",
            "Strings and String Methods", "Math Object", "Date Object",
            "DOM Introduction", "DOM Selectors", "DOM Manipulation",
            "JavaScript Events", "Event Handling", "Form Validation",
            "JavaScript Mini Project"
        ]
    },

    dsa: {
        name: "Data Structures",
        description: "Arrays and Linked Lists",
        lessons: [
            "Introduction to Data Structures", "Arrays",
            "Array Operations", "Strings", "Linked Lists",
            "Singly Linked List", "Doubly Linked List", "Stacks",
            "Stack Operations", "Queues", "Circular Queue",
            "Recursion", "Searching Algorithms", "Linear Search",
            "Binary Search", "Sorting Algorithms", "Bubble Sort",
            "Selection Sort", "Trees and Binary Trees",
            "Graphs Introduction"
        ]
    },

    network: {
        name: "Computer Networks",
        description: "Network Fundamentals",
        lessons: [
            "Introduction to Computer Networks", "Types of Networks",
            "Network Topologies", "Network Devices", "OSI Model",
            "TCP/IP Model", "Physical Layer", "Data Link Layer",
            "Network Layer", "Transport Layer", "Application Layer",
            "IP Addressing", "IPv4 and IPv6", "Subnetting Basics",
            "Routing and Switching", "TCP and UDP", "DNS and DHCP",
            "HTTP and HTTPS", "Network Security", "Wireless Networks"
        ]
    }
};


// ========================================
// 2. SELECT COURSE
// ========================================

const params = new URLSearchParams(window.location.search);
const courseKey = params.get("course") || "web";
const course = courses[courseKey] || courses.web;

const totalLessons = course.lessons.length;


// ========================================
// 3. INITIAL PROGRESS
// ========================================

const initialProgress = {
    web: 15,
    python: 12,
    database: 9,
    computer: 16,
    javascript: 10,
    dsa: 16,
    network: 0
};


// ========================================
// 4. GET HTML ELEMENTS
// ========================================

const courseName = document.getElementById("courseName");
const courseDescription = document.getElementById("courseDescription");
const courseStatus = document.getElementById("courseStatus");

const lessonCount = document.getElementById("lessonCount");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const lessonTitle = document.getElementById("lessonTitle");
const lessonMaterial = document.getElementById("lessonMaterial");
const lessonNotes = document.getElementById("lessonNotes");
const lessonList = document.getElementById("lessonList");

const completeBtn = document.getElementById("completeBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");


// ========================================
// 5. CHECK REQUIRED HTML ELEMENTS
// ========================================

if (
    !courseName || !courseDescription || !courseStatus ||
    !lessonCount || !progressPercent || !progressBar ||
    !lessonTitle || !lessonMaterial || !lessonNotes ||
    !lessonList || !completeBtn || !previousBtn || !nextBtn
) {
    throw new Error("Some required HTML elements are missing. Check lesson-view.html IDs.");
}


// ========================================
// 6. LOCAL STORAGE
// ========================================

const storageKey = "learnhub_final_progress_v5_" + courseKey;

let savedData = null;

try {
    savedData = JSON.parse(localStorage.getItem(storageKey));
} catch (error) {
    savedData = null;
}

let completedLessons = [];

if (savedData && Array.isArray(savedData.completedLessons)) {

    completedLessons = [
        ...new Set(
            savedData.completedLessons.filter(number =>
                Number.isInteger(number) &&
                number >= 1 &&
                number <= totalLessons
            )
        )
    ];

} else {

    const count = initialProgress[courseKey] || 0;

    for (let i = 1; i <= count; i++) {
        completedLessons.push(i);
    }

}

let currentLesson = savedData &&
    Number.isInteger(savedData.lastLesson) &&
    savedData.lastLesson >= 1 &&
    savedData.lastLesson <= totalLessons
        ? savedData.lastLesson
        : 1;


// ========================================
// 7. SAVE PROGRESS
// ========================================

function saveProgress() {

    const data = {
        completedLessons: completedLessons,
        lastLesson: currentLesson
    };

    localStorage.setItem(storageKey, JSON.stringify(data));

}


// ========================================
// 8. COURSE HEADING
// ========================================

courseName.textContent = course.name;
courseDescription.textContent = course.description;


// ========================================
// 9. GENERATE CHAPTER NOTES
// ========================================

function generateNotes(topic, number) {

    const examples = {

        "Introduction to HTML": `
            <p>HTML stands for HyperText Markup Language. It is used to create the structure of web pages.</p>
            <pre>&lt;h1&gt;Hello World&lt;/h1&gt;
&lt;p&gt;My first webpage&lt;/p&gt;</pre>
        `,

        "CSS Box Model": `
            <p>The CSS Box Model consists of content, padding, border and margin.</p>
            <pre>
Margin
  Border
    Padding
      Content
            </pre>
            <p>Example: <code>margin: 10px; padding: 20px;</code></p>
        `,

        "JavaScript Variables": `
            <p>Variables store data. JavaScript provides let, const and var.</p>
            <pre>
let name = "Ayushi";
const age = 20;
            </pre>
        `,

        "Loops": `
            <p>Loops repeat a block of code multiple times.</p>
            <pre>
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
            </pre>
        `,

        "Functions": `
            <p>A function is a reusable block of code.</p>
            <pre>
function greet() {
    console.log("Hello");
}
greet();
            </pre>
        `,

        "Primary and Foreign Keys": `
            <p>A primary key uniquely identifies each record. A foreign key connects two tables.</p>
            <pre>
STUDENT
ID | Name
1  | Aman

MARKS
ID | Student_ID
1  | 1
            </pre>
        `,

        "OSI Model": `
            <p>The OSI model has seven layers.</p>
            <pre>
7. Application
6. Presentation
5. Session
4. Transport
3. Network
2. Data Link
1. Physical
            </pre>
        `,

        "Arrays": `
            <p>An array stores multiple values in a single variable.</p>
            <pre>
int[] numbers = {10, 20, 30};
System.out.println(numbers[0]);
            </pre>
        `,

        "DOM Manipulation": `
            <p>DOM allows JavaScript to access and change HTML elements.</p>
            <pre>
document.getElementById("demo")
        .textContent = "Hello";
            </pre>
        `,

        "Binary Search": `
            <p>Binary Search works on sorted arrays. It repeatedly divides the search range into half.</p>
            <pre>
Sorted: [10, 20, 30, 40, 50]
Target: 40
Middle: 30
Search right half.
            </pre>
        `

    };

    const specificExample = examples[topic] || `
        <p><b>${topic}</b> is an important concept in ${course.name}.</p>
        <p>Study its definition, working, important features and real-world applications.</p>
        <p>Try creating a small practical example to understand this topic better.</p>
    `;

    return `
        <h2>Chapter ${number}: ${topic}</h2>

        <h3>1. Introduction</h3>
        <p>
            This chapter explains <b>${topic}</b>.
            It is an important part of ${course.name}.
            Understanding this concept will help you build
            a strong foundation in the subject.
        </p>

        <h3>2. Important Concepts</h3>
        <ul>
            <li>Understand the meaning and definition of ${topic}.</li>
            <li>Learn its main features and components.</li>
            <li>Understand its working process.</li>
            <li>Study its practical applications.</li>
        </ul>

        <h3>3. Concept Diagram</h3>

        <div style="
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:8px;
            margin:20px 0;
        ">

            <div style="padding:12px 22px;background:#e8f1fa;border:1px solid #4688bd;border-radius:7px;">
                ${topic}
            </div>

            <i class="fa-solid fa-arrow-down"></i>

            <div style="padding:12px 22px;background:#e8f1fa;border:1px solid #4688bd;border-radius:7px;">
                Important Concepts
            </div>

            <i class="fa-solid fa-arrow-down"></i>

            <div style="padding:12px 22px;background:#e8f1fa;border:1px solid #4688bd;border-radius:7px;">
                Practical Applications
            </div>

        </div>

        <h3>4. Example</h3>
        ${specificExample}

        <h3>5. Chapter Summary</h3>
        <p>
            In this chapter, we studied ${topic}.
            Revise the important points and practice the examples
            before moving to the next chapter.
        </p>
    `;

}


// ========================================
// 10. DISPLAY ALL CHAPTERS
// ========================================

function displayChapterList() {

    lessonList.innerHTML = "";

    course.lessons.forEach(function(topic, index) {

        const chapterNumber = index + 1;

        const li = document.createElement("li");

        li.style.cssText = `
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:12px;
            padding:14px 16px;
            margin-bottom:9px;
            background:${chapterNumber === currentLesson ? "#e4f0fc" : "#f5f7fa"};
            border:${chapterNumber === currentLesson ? "2px solid #4688bd" : "1px solid #dce3eb"};
            border-radius:7px;
            cursor:pointer;
        `;

        const name = document.createElement("span");
        name.textContent = `Chapter ${chapterNumber}: ${topic}`;

        li.appendChild(name);

        if (completedLessons.includes(chapterNumber)) {

            const tick = document.createElement("i");

            tick.className = "fa-solid fa-circle-check";
            tick.style.color = "green";
            tick.style.fontSize = "19px";

            li.appendChild(tick);

        }

        li.addEventListener("click", function() {

        currentLesson = chapterNumber;

        showLesson();

        lessonNotes.style.display = "block";
        notesArrow.className = "fa-solid fa-chevron-up";

});

        lessonList.appendChild(li);

    });

}


// ========================================
// 11. DISPLAY CURRENT CHAPTER
// ========================================

function showLesson() {

    const topic = course.lessons[currentLesson - 1];

    const completedCount = completedLessons.length;

    const percentage = Math.round(
        (completedCount / totalLessons) * 100
    );

    lessonCount.textContent =
        `Chapter ${currentLesson} of ${totalLessons}`;

    progressPercent.textContent = percentage + "%";

    progressBar.style.width = percentage + "%";
    progressBar.style.backgroundColor = "#4688bd";

    lessonTitle.textContent =
        `Chapter ${currentLesson}: ${topic}`;

    lessonNotes.innerHTML = generateNotes(topic, currentLesson);

    // Display all chapter names and green ticks
    displayChapterList();

    // Course status
    if (completedCount === totalLessons) {
        courseStatus.textContent = "Completed";
    } else if (completedCount === 0) {
        courseStatus.textContent = "Not Started";
    } else {
        courseStatus.textContent = "In Progress";
    }

    // Complete button
    if (completedLessons.includes(currentLesson)) {

        completeBtn.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Chapter Completed';

        completeBtn.disabled = true;

    } else {

        completeBtn.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Mark as Complete';

        completeBtn.disabled = false;

    }

    // Previous button
    previousBtn.disabled = currentLesson === 1;

    // Next button
    if (currentLesson === totalLessons) {

        nextBtn.textContent = "Last Chapter";
        nextBtn.disabled = true;

    } else {

        nextBtn.innerHTML =
            'Next Lesson <i class="fa-solid fa-arrow-right"></i>';

        nextBtn.disabled = false;

    }

    saveProgress();

}


// ========================================
// 12. MARK AS COMPLETE
// ========================================

completeBtn.addEventListener("click", function() {

    if (!completedLessons.includes(currentLesson)) {

        completedLessons.push(currentLesson);

        completedLessons.sort((a, b) => a - b);

        showLesson();

    }

});


// ========================================
// 13. PREVIOUS LESSON
// ========================================

previousBtn.addEventListener("click", function() {

    if (currentLesson > 1) {

        currentLesson--;

        showLesson();

    }

});


// ========================================
// 14. NEXT LESSON
// ========================================

nextBtn.addEventListener("click", function() {

    if (currentLesson < totalLessons) {

        currentLesson++;

        showLesson();

    }

});

 // ==================================================
 // 15. CLICK CHAPTER NOTES TO OPEN / CLOSE
 // ==================================================

notesHeading.onclick = function () {

    const isOpen = lessonNotes.style.display === "block";

    if (isOpen) {
        lessonNotes.style.display = "none";
        notesArrow.className = "fa-solid fa-chevron-down";
    } else {
        lessonNotes.style.display = "block";
        notesArrow.className = "fa-solid fa-chevron-up";
    }

};



// ========================================
// 16. INITIAL PAGE DISPLAY
// ========================================

showLesson();
