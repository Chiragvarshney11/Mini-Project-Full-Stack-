
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
const notesHeading = document.getElementById("notesHeading");
const notesArrow = document.getElementById("notesArrow");


// ========================================
// 5. CHECK REQUIRED HTML ELEMENTS
// ========================================

if (
    !courseName || !courseDescription || !courseStatus ||
    !lessonCount || !progressPercent || !progressBar ||
    !lessonTitle || !lessonMaterial || !lessonNotes ||
    !lessonList || !completeBtn || !previousBtn || !nextBtn ||
    !notesHeading || !notesArrow
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

    // ── Comprehensive notes for every course topic ──

    const examples = {

        // =============================================
        // WEB DEVELOPMENT NOTES
        // =============================================

        "Introduction to Web Development": `
            <p>Web development is the process of building websites and web applications for the internet. It involves three core technologies:</p>
            <ul>
                <li><b>HTML</b> – Defines the structure and content of web pages</li>
                <li><b>CSS</b> – Controls the visual presentation and layout</li>
                <li><b>JavaScript</b> – Adds interactivity and dynamic behavior</li>
            </ul>
            <p><b>How the Web Works:</b></p>
            <pre>
Browser (Client)  ──request──▶  Web Server
                  ◀──response──  (sends HTML, CSS, JS)
            </pre>
            <p><b>Key Concepts:</b> HTTP protocol, URL structure, client-server model, frontend vs backend development.</p>
        `,

        "Introduction to HTML": `
            <p>HTML (HyperText Markup Language) is the standard language for creating web pages. Every webpage you visit is built with HTML.</p>
            <pre>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;My First Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello World!&lt;/h1&gt;
    &lt;p&gt;This is my first webpage.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
            </pre>
            <p><b>Key Points:</b> HTML uses tags (opening <code>&lt;tag&gt;</code> and closing <code>&lt;/tag&gt;</code>), elements are nested inside each other, and <code>&lt;!DOCTYPE html&gt;</code> declares the document type.</p>
        `,

        "HTML Tags and Attributes": `
            <p>HTML tags define different types of content. Attributes provide additional information about elements.</p>
            <pre>
&lt;!-- Headings --&gt;
&lt;h1&gt;Main Heading&lt;/h1&gt;
&lt;h2&gt;Sub Heading&lt;/h2&gt;

&lt;!-- Paragraph with styling --&gt;
&lt;p style="color: blue;"&gt;Styled text&lt;/p&gt;

&lt;!-- Link with attributes --&gt;
&lt;a href="https://example.com" target="_blank"&gt;Visit Site&lt;/a&gt;

&lt;!-- Image --&gt;
&lt;img src="photo.jpg" alt="Description" width="300"&gt;
            </pre>
            <p><b>Common Attributes:</b> <code>id</code>, <code>class</code>, <code>style</code>, <code>src</code>, <code>href</code>, <code>alt</code>, <code>title</code>.</p>
        `,

        "HTML Forms and Tables": `
            <p>Forms collect user input, tables display data in rows and columns.</p>
            <pre>
&lt;!-- Form Example --&gt;
&lt;form action="/submit" method="POST"&gt;
  &lt;label for="name"&gt;Name:&lt;/label&gt;
  &lt;input type="text" id="name" required&gt;

  &lt;label for="email"&gt;Email:&lt;/label&gt;
  &lt;input type="email" id="email"&gt;

  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;

&lt;!-- Table Example --&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Age&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Aman&lt;/td&gt;&lt;td&gt;20&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Priya&lt;/td&gt;&lt;td&gt;22&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;
            </pre>
        `,

        "Semantic HTML": `
            <p>Semantic HTML uses meaningful tags that describe the purpose of content, improving accessibility and SEO.</p>
            <pre>
&lt;header&gt;Website Header / Navigation&lt;/header&gt;
&lt;nav&gt;Navigation Links&lt;/nav&gt;
&lt;main&gt;
  &lt;article&gt;Blog Post Content&lt;/article&gt;
  &lt;section&gt;Related Section&lt;/section&gt;
  &lt;aside&gt;Sidebar Content&lt;/aside&gt;
&lt;/main&gt;
&lt;footer&gt;Copyright Info&lt;/footer&gt;
            </pre>
            <p><b>Benefits:</b> Better SEO, screen reader support, cleaner code structure, easier maintenance.</p>
        `,

        "Introduction to CSS": `
            <p>CSS (Cascading Style Sheets) controls the look and layout of HTML elements.</p>
            <pre>
/* Three ways to add CSS */

/* 1. Inline */
&lt;p style="color: red;"&gt;Red text&lt;/p&gt;

/* 2. Internal (in &lt;head&gt;) */
&lt;style&gt;
  p { color: blue; font-size: 16px; }
&lt;/style&gt;

/* 3. External (recommended) */
&lt;link rel="stylesheet" href="style.css"&gt;
            </pre>
            <p><b>CSS Syntax:</b> <code>selector { property: value; }</code></p>
        `,

        "CSS Selectors": `
            <p>Selectors target HTML elements to apply styles.</p>
            <pre>
/* Element selector */
h1 { color: blue; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#header { font-size: 24px; }

/* Descendant selector */
div p { margin: 10px; }

/* Pseudo-class */
a:hover { color: red; }
button:active { transform: scale(0.95); }
            </pre>
            <p><b>Specificity order:</b> Inline &gt; ID &gt; Class &gt; Element</p>
        `,

        "Colors, Fonts and Backgrounds": `
            <p>CSS provides multiple ways to define colors, fonts, and backgrounds.</p>
            <pre>
/* Colors */
color: red;                  /* Named */
color: #3498db;              /* Hex */
color: rgb(52, 152, 219);    /* RGB */
color: rgba(0, 0, 0, 0.5);  /* RGBA with opacity */

/* Fonts */
font-family: 'Arial', sans-serif;
font-size: 18px;
font-weight: bold;
line-height: 1.6;

/* Backgrounds */
background-color: #f0f0f0;
background-image: url('bg.jpg');
background-size: cover;
            </pre>
        `,

        "CSS Box Model": `
            <p>Every HTML element is a rectangular box consisting of four layers:</p>
            <pre>
┌──────────── Margin ────────────┐
│  ┌──────── Border ──────────┐  │
│  │  ┌──── Padding ────┐     │  │
│  │  │   ┌─Content─┐   │     │  │
│  │  │   │  Hello   │   │     │  │
│  │  │   └──────────┘   │     │  │
│  │  └──────────────────┘     │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
            </pre>
            <pre>
div {
  width: 300px;
  padding: 20px;
  border: 2px solid #333;
  margin: 15px;
}
/* Total width = 300 + 40 + 4 + 30 = 374px */

/* Use box-sizing to include padding/border in width */
* { box-sizing: border-box; }
            </pre>
        `,

        "CSS Flexbox": `
            <p>Flexbox is a one-dimensional layout system for arranging items in rows or columns.</p>
            <pre>
.container {
  display: flex;
  justify-content: center;    /* horizontal alignment */
  align-items: center;         /* vertical alignment */
  gap: 20px;                   /* spacing between items */
  flex-wrap: wrap;             /* allow wrapping */
}

.item {
  flex: 1;         /* grow equally */
  min-width: 200px;
}
            </pre>
            <p><b>Key Properties:</b> <code>flex-direction</code>, <code>justify-content</code>, <code>align-items</code>, <code>flex-wrap</code>, <code>gap</code>, <code>flex-grow</code>, <code>flex-shrink</code>.</p>
        `,

        "CSS Grid": `
            <p>CSS Grid is a two-dimensional layout system for creating complex page layouts.</p>
            <pre>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto;
  gap: 15px;
}

/* Spanning multiple cells */
.header { grid-column: 1 / -1; }  /* full width */
.sidebar { grid-row: 2 / 4; }     /* 2 rows tall */
            </pre>
            <p><b>Grid vs Flexbox:</b> Grid handles 2D layouts (rows AND columns), Flexbox handles 1D (row OR column).</p>
        `,

        "Responsive Web Design": `
            <p>Responsive design makes websites work on all screen sizes — phones, tablets, and desktops.</p>
            <pre>
/* Mobile-first approach */
.container { width: 100%; padding: 10px; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { width: 750px; margin: 0 auto; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { width: 960px; }
}

/* Flexible images */
img { max-width: 100%; height: auto; }
            </pre>
            <p><b>Key Principles:</b> Fluid grids, flexible images, media queries, viewport meta tag.</p>
        `,

        "Media Queries": `
            <p>Media queries apply CSS rules based on device characteristics like screen width.</p>
            <pre>
/* Essential viewport meta tag */
&lt;meta name="viewport"
  content="width=device-width, initial-scale=1.0"&gt;

/* Target specific screen sizes */
@media (max-width: 600px) {
  .nav { flex-direction: column; }
  .sidebar { display: none; }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .content { grid-template-columns: 1fr 1fr; }
}

/* Target print */
@media print {
  .no-print { display: none; }
}
            </pre>
        `,

        "Introduction to JavaScript": `
            <p>JavaScript is the programming language of the web. It makes web pages interactive and dynamic.</p>
            <pre>
// Output
console.log("Hello, World!");
alert("Welcome!");

// Variables
let name = "Aman";
const age = 20;

// Simple interaction
document.getElementById("btn")
  .addEventListener("click", function() {
    alert("Button clicked!");
  });
            </pre>
            <p><b>JavaScript can:</b> Change HTML content, react to events, validate forms, create animations, communicate with servers.</p>
        `,

        "JavaScript Variables": `
            <p>Variables store data values. JavaScript has three ways to declare variables.</p>
            <pre>
// let – can be reassigned
let score = 0;
score = 10;    // OK

// const – cannot be reassigned
const PI = 3.14159;
// PI = 3;    // ERROR!

// var – old way (avoid in modern JS)
var name = "old style";

// Naming rules
let myAge = 20;        // camelCase (recommended)
let _private = true;   // can start with _
let $price = 99;       // can start with $
// let 2name = "no";   // cannot start with number
            </pre>
        `,

        "JavaScript Data Types": `
            <p>JavaScript has 8 data types — 7 primitive and 1 non-primitive.</p>
            <pre>
// Primitive Types
let str = "Hello";       // String
let num = 42;            // Number
let big = 9007199254n;   // BigInt
let flag = true;         // Boolean
let empty = null;        // Null
let x;                   // Undefined
let id = Symbol("id");   // Symbol

// Non-primitive
let obj = { name: "Aman", age: 20 };  // Object
let arr = [1, 2, 3];                   // Array (object)

// Check type
typeof str;    // "string"
typeof num;    // "number"
typeof flag;   // "boolean"
typeof obj;    // "object"
            </pre>
        `,

        "JavaScript Functions": `
            <p>Functions are reusable blocks of code that perform a specific task.</p>
            <pre>
// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Aman"));  // "Hello, Aman!"

// Function expression
const add = function(a, b) {
  return a + b;
};

// Arrow function (ES6)
const multiply = (a, b) => a * b;

// Default parameters
function welcome(name = "Student") {
  console.log("Welcome, " + name);
}
welcome();        // "Welcome, Student"
welcome("Priya"); // "Welcome, Priya"
            </pre>
        `,

        "DOM Manipulation": `
            <p>The DOM (Document Object Model) lets JavaScript access and modify HTML elements dynamically.</p>
            <pre>
// Selecting elements
let el = document.getElementById("title");
let items = document.querySelectorAll(".item");

// Changing content
el.textContent = "New Title";
el.innerHTML = "&lt;b&gt;Bold Title&lt;/b&gt;";

// Changing styles
el.style.color = "blue";
el.style.fontSize = "24px";

// Adding/removing classes
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("dark-mode");

// Creating new elements
let p = document.createElement("p");
p.textContent = "New paragraph";
document.body.appendChild(p);
            </pre>
        `,

        "JavaScript Events": `
            <p>Events are actions that happen in the browser — clicks, key presses, form submissions, etc.</p>
            <pre>
// Click event
document.getElementById("btn")
  .addEventListener("click", function() {
    alert("Clicked!");
  });

// Keyboard event
document.addEventListener("keydown", function(e) {
  console.log("Key pressed: " + e.key);
});

// Form submit
document.getElementById("form")
  .addEventListener("submit", function(e) {
    e.preventDefault();  // stop page reload
    console.log("Form submitted!");
  });

// Mouse hover
el.addEventListener("mouseenter", () => {
  el.style.background = "#eee";
});
            </pre>
        `,

        "Mini Website Project": `
            <p>Build a complete mini website combining HTML, CSS, and JavaScript.</p>
            <pre>
Project: Personal Portfolio Website

Files needed:
├── index.html    (structure)
├── style.css     (styling)
└── script.js     (interactivity)

Features to include:
✔ Navigation bar with smooth scrolling
✔ Hero section with introduction
✔ Skills section with progress bars
✔ Project cards with hover effects
✔ Contact form with validation
✔ Responsive design for mobile
✔ Dark mode toggle using JavaScript
            </pre>
            <p><b>Tip:</b> Start with the HTML structure, then add CSS styling, and finally add JavaScript interactivity.</p>
        `,

        // =============================================
        // PYTHON PROGRAMMING NOTES
        // =============================================

        "Introduction to Python": `
            <p>Python is a high-level, interpreted programming language known for its simple and readable syntax. Created by Guido van Rossum in 1991.</p>
            <pre>
# Your first Python program
print("Hello, World!")

# Python is easy to read
name = "Aman"
age = 20
print(f"My name is {name} and I am {age} years old.")

# Simple calculation
result = 10 + 20
print("Sum:", result)  # Output: Sum: 30
            </pre>
            <p><b>Why Python?</b> Easy syntax, huge community, used in web development, data science, AI/ML, automation, and more.</p>
            <p><b>Key Features:</b> Interpreted (no compilation), dynamically typed, indentation-based blocks, cross-platform.</p>
        `,

        "Variables and Data Types": `
            <p>Variables store data values. Python determines the data type automatically — no need to declare types.</p>
            <pre>
# String
name = "Aman Kumar"
college = 'GLA University'

# Integer
age = 20
roll_no = 101

# Float
percentage = 85.5
pi = 3.14159

# Boolean
is_student = True
has_passed = False

# Type checking
print(type(name))        # &lt;class 'str'&gt;
print(type(age))          # &lt;class 'int'&gt;
print(type(percentage))   # &lt;class 'float'&gt;
print(type(is_student))   # &lt;class 'bool'&gt;

# Type conversion
num_str = "42"
num_int = int(num_str)    # String to Integer
num_float = float(num_str)  # String to Float
            </pre>
        `,

        "Operators in Python": `
            <p>Operators perform operations on variables and values.</p>
            <pre>
# Arithmetic Operators
print(10 + 3)   # 13  (Addition)
print(10 - 3)   # 7   (Subtraction)
print(10 * 3)   # 30  (Multiplication)
print(10 / 3)   # 3.33 (Division)
print(10 // 3)  # 3   (Floor Division)
print(10 % 3)   # 1   (Modulus / Remainder)
print(2 ** 5)   # 32  (Exponent / Power)

# Comparison Operators
print(5 == 5)   # True
print(5 != 3)   # True
print(5 > 3)    # True
print(5 <= 5)   # True

# Logical Operators
print(True and False)  # False
print(True or False)   # True
print(not True)        # False

# Assignment Operators
x = 10
x += 5    # x = 15
x -= 3    # x = 12
x *= 2    # x = 24
            </pre>
        `,

        "Conditional Statements": `
            <p>Conditional statements execute different code blocks based on conditions.</p>
            <pre>
# if-elif-else
marks = 85

if marks >= 90:
    grade = "A+"
elif marks >= 80:
    grade = "A"
elif marks >= 70:
    grade = "B"
elif marks >= 60:
    grade = "C"
else:
    grade = "F"

print(f"Grade: {grade}")  # Grade: A

# Nested if
age = 20
has_id = True

if age >= 18:
    if has_id:
        print("Entry allowed")
    else:
        print("Please bring ID")
else:
    print("Not eligible")

# Ternary operator
status = "Adult" if age >= 18 else "Minor"
            </pre>
        `,

        "Loops": `
            <p>Loops execute a block of code repeatedly — either a fixed number of times or until a condition is met.</p>
            <pre>
# for loop — iterate over a sequence
fruits = ["Apple", "Banana", "Mango"]
for fruit in fruits:
    print(fruit)

# for loop with range
for i in range(1, 6):
    print(f"Count: {i}")
# Output: Count: 1, Count: 2, ... Count: 5

# while loop
count = 1
while count <= 5:
    print(f"Number: {count}")
    count += 1

# break — exit loop early
for i in range(10):
    if i == 5:
        break
    print(i)   # Prints 0, 1, 2, 3, 4

# continue — skip current iteration
for i in range(6):
    if i == 3:
        continue
    print(i)   # Prints 0, 1, 2, 4, 5

# Nested loops — multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i*j}")
            </pre>
        `,

        "Functions": `
            <p>Functions are reusable blocks of code defined with the <code>def</code> keyword.</p>
            <pre>
# Basic function
def greet(name):
    return f"Hello, {name}!"

print(greet("Aman"))  # Hello, Aman!

# Default parameters
def power(base, exp=2):
    return base ** exp

print(power(5))     # 25
print(power(2, 10)) # 1024

# Multiple return values
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)/len(numbers)

low, high, avg = get_stats([10, 20, 30, 40])
print(f"Min: {low}, Max: {high}, Avg: {avg}")

# *args and **kwargs
def show_info(*args, **kwargs):
    print("Args:", args)
    print("Kwargs:", kwargs)

show_info(1, 2, name="Aman", age=20)
# Args: (1, 2)
# Kwargs: {'name': 'Aman', 'age': 20}
            </pre>
        `,

        "Lists": `
            <p>Lists are ordered, mutable collections that can hold any data type.</p>
            <pre>
# Creating lists
fruits = ["Apple", "Banana", "Mango"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# Accessing elements
print(fruits[0])     # Apple
print(fruits[-1])    # Mango (last element)
print(fruits[1:3])   # ['Banana', 'Mango'] (slicing)

# Modifying lists
fruits.append("Orange")     # Add to end
fruits.insert(1, "Grapes")  # Add at index 1
fruits.remove("Banana")     # Remove by value
popped = fruits.pop()       # Remove and return last

# List methods
numbers.sort()              # Sort ascending
numbers.reverse()           # Reverse order
print(len(numbers))         # Length: 5
print(3 in numbers)         # True (membership check)

# List comprehension
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

even = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
            </pre>
        `,

        "Tuples": `
            <p>Tuples are ordered, <b>immutable</b> collections. Once created, they cannot be changed.</p>
            <pre>
# Creating tuples
coordinates = (10, 20)
colors = ("red", "green", "blue")
single = (42,)  # Note the comma for single element

# Accessing elements
print(colors[0])    # red
print(colors[-1])   # blue
print(colors[1:])   # ('green', 'blue')

# Tuple unpacking
x, y = coordinates
print(f"X: {x}, Y: {y}")  # X: 10, Y: 20

# Tuple methods
print(colors.count("red"))  # 1
print(colors.index("blue")) # 2
print(len(colors))          # 3

# Tuples as dictionary keys (lists can't do this)
locations = {(28.6, 77.2): "Delhi", (19.0, 72.8): "Mumbai"}

# When to use tuples vs lists:
# Tuples: fixed data (coordinates, RGB), dict keys
# Lists: when you need to add/remove items
            </pre>
        `,

        "Sets": `
            <p>Sets are unordered collections of <b>unique</b> elements. Duplicates are automatically removed.</p>
            <pre>
# Creating sets
fruits = {"Apple", "Banana", "Mango", "Apple"}
print(fruits)  # {'Apple', 'Banana', 'Mango'} - no duplicate

# Adding and removing
fruits.add("Orange")
fruits.discard("Banana")   # No error if not found

# Set operations
A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

print(A | B)   # Union: {1,2,3,4,5,6,7,8}
print(A & B)   # Intersection: {4, 5}
print(A - B)   # Difference: {1, 2, 3}
print(A ^ B)   # Symmetric diff: {1,2,3,6,7,8}

# Membership check (very fast!)
print(3 in A)  # True

# Remove duplicates from a list
nums = [1, 2, 2, 3, 3, 3, 4]
unique = list(set(nums))  # [1, 2, 3, 4]
            </pre>
        `,

        "Dictionaries": `
            <p>Dictionaries store data as <b>key-value pairs</b>. Keys must be unique and immutable.</p>
            <pre>
# Creating a dictionary
student = {
    "name": "Aman Kumar",
    "age": 20,
    "branch": "B.Tech CSE",
    "college": "GLA University"
}

# Accessing values
print(student["name"])          # Aman Kumar
print(student.get("age"))       # 20
print(student.get("phone", "N/A"))  # N/A (default)

# Modifying
student["age"] = 21             # Update value
student["phone"] = "9876543210" # Add new key

# Dictionary methods
print(student.keys())    # All keys
print(student.values())  # All values
print(student.items())   # Key-value pairs

# Looping through dictionary
for key, value in student.items():
    print(f"{key}: {value}")

# Dictionary comprehension
squares = {x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
            </pre>
        `,

        "Strings and String Methods": `
            <p>Strings are sequences of characters. Python provides many built-in string methods.</p>
            <pre>
name = "Aman Kumar"

# String methods
print(name.upper())       # AMAN KUMAR
print(name.lower())       # aman kumar
print(name.title())       # Aman Kumar
print(name.replace("Kumar", "Singh"))  # Aman Singh
print(name.split())       # ['Aman', 'Kumar']
print(len(name))          # 10

# String slicing
text = "Python Programming"
print(text[0:6])    # Python
print(text[-11:])   # Programming
print(text[::-1])   # gnimmargorP nohtyP (reversed)

# String formatting
age = 20
# f-string (Python 3.6+)
print(f"Name: {name}, Age: {age}")
# .format() method
print("Name: {}, Age: {}".format(name, age))

# Useful checks
print("aman".isalpha())    # True
print("123".isdigit())     # True
print("  hello  ".strip()) # "hello"
            </pre>
        `,

        "File Handling": `
            <p>Python can read from and write to files using built-in functions.</p>
            <pre>
# Writing to a file
with open("notes.txt", "w") as file:
    file.write("Hello, World!\\n")
    file.write("Python File Handling\\n")

# Reading entire file
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)

# Reading line by line
with open("notes.txt", "r") as file:
    for line in file:
        print(line.strip())

# Appending to a file
with open("notes.txt", "a") as file:
    file.write("New line added!\\n")

# File modes:
# "r"  - Read (default)
# "w"  - Write (overwrites)
# "a"  - Append
# "r+" - Read and Write

# Check if file exists
import os
if os.path.exists("notes.txt"):
    print("File exists!")
            </pre>
            <p><b>Tip:</b> Always use <code>with</code> statement — it automatically closes the file.</p>
        `,

        "Exception Handling": `
            <p>Exception handling prevents your program from crashing when errors occur.</p>
            <pre>
# Basic try-except
try:
    num = int(input("Enter a number: "))
    result = 100 / num
    print(f"Result: {result}")
except ValueError:
    print("Invalid input! Please enter a number.")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("This always runs.")

# Common exceptions:
# ValueError     - wrong type conversion
# TypeError      - wrong operation on type
# IndexError     - list index out of range
# KeyError       - dictionary key not found
# FileNotFoundError - file doesn't exist
# ZeroDivisionError - division by zero

# Raising exceptions
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    return age
            </pre>
        `,

        "Object-Oriented Programming": `
            <p>OOP organizes code using objects and classes. It models real-world entities.</p>
            <pre>
# Four pillars of OOP:
# 1. Encapsulation - bundling data and methods
# 2. Abstraction   - hiding complexity
# 3. Inheritance   - reusing code from parent class
# 4. Polymorphism  - same method, different behavior

class Student:
    # Constructor
    def __init__(self, name, age, branch):
        self.name = name
        self.age = age
        self.branch = branch

    # Method
    def introduce(self):
        return f"I am {self.name}, {self.age} years old, {self.branch}"

    # String representation
    def __str__(self):
        return f"Student({self.name})"

# Creating objects
s1 = Student("Aman", 20, "B.Tech CSE")
s2 = Student("Priya", 21, "B.Tech IT")

print(s1.introduce())
# I am Aman, 20 years old, B.Tech CSE
            </pre>
        `,

        "Classes and Objects": `
            <p>A class is a blueprint for creating objects. Objects are instances of a class.</p>
            <pre>
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # Private attribute

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited ₹{amount}"
        return "Invalid amount"

    def withdraw(self, amount):
        if amount > self.__balance:
            return "Insufficient funds!"
        self.__balance -= amount
        return f"Withdrew ₹{amount}"

    def get_balance(self):
        return f"Balance: ₹{self.__balance}"

# Using the class
acc = BankAccount("Aman", 1000)
print(acc.deposit(500))      # Deposited ₹500
print(acc.withdraw(200))     # Withdrew ₹200
print(acc.get_balance())     # Balance: ₹1300
            </pre>
        `,

        "Inheritance": `
            <p>Inheritance lets a child class reuse and extend the properties of a parent class.</p>
            <pre>
# Parent class
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}!"

# Child classes
class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "Woof")

    def fetch(self):
        return f"{self.name} fetches the ball!"

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")

# Using inheritance
dog = Dog("Buddy")
cat = Cat("Whiskers")
print(dog.speak())   # Buddy says Woof!
print(dog.fetch())   # Buddy fetches the ball!
print(cat.speak())   # Whiskers says Meow!

# Multiple inheritance
class Hybrid(Dog, Cat):
    pass

# isinstance check
print(isinstance(dog, Animal))  # True
            </pre>
        `,

        "Modules and Packages": `
            <p>Modules are Python files containing functions and classes. Packages are folders of modules.</p>
            <pre>
# Importing modules
import math
print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.14159...

# Import specific items
from random import randint, choice
print(randint(1, 100))
print(choice(["A", "B", "C"]))

# Import with alias
import datetime as dt
today = dt.date.today()
print(today)

# Common built-in modules:
# math     - mathematical functions
# random   - random numbers
# os       - operating system interface
# json     - JSON handling
# datetime - dates and times
# sys      - system-specific parameters

# Creating your own module (myutils.py):
# def greet(name):
#     return f"Hello, {name}!"

# In another file:
# from myutils import greet
            </pre>
        `,

        "Lambda Functions": `
            <p>Lambda functions are small anonymous functions defined in a single line.</p>
            <pre>
# Syntax: lambda arguments: expression

# Simple lambda
square = lambda x: x ** 2
print(square(5))    # 25

add = lambda a, b: a + b
print(add(3, 7))    # 10

# Lambda with built-in functions

# sort by second element
pairs = [(1, 'b'), (3, 'a'), (2, 'c')]
pairs.sort(key=lambda x: x[1])
print(pairs)  # [(3, 'a'), (1, 'b'), (2, 'c')]

# filter — keep even numbers
nums = [1, 2, 3, 4, 5, 6, 7, 8]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)  # [2, 4, 6, 8]

# map — double each number
doubled = list(map(lambda x: x * 2, nums))
print(doubled)  # [2, 4, 6, 8, 10, 12, 14, 16]

# reduce — sum all numbers
from functools import reduce
total = reduce(lambda a, b: a + b, nums)
print(total)  # 36
            </pre>
        `,

        "Python Libraries": `
            <p>Python has thousands of libraries. Here are the most important ones for students.</p>
            <pre>
# NumPy — numerical computing
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean())    # 3.0
print(arr * 2)       # [2, 4, 6, 8, 10]

# Pandas — data analysis
import pandas as pd
data = {"Name": ["Aman", "Priya"], "Age": [20, 21]}
df = pd.DataFrame(data)
print(df)

# Matplotlib — plotting graphs
import matplotlib.pyplot as plt
plt.plot([1,2,3], [10,20,30])
plt.title("My Graph")
plt.show()

# Requests — HTTP requests
import requests
response = requests.get("https://api.example.com")
print(response.status_code)

# Other popular libraries:
# Flask / Django  - Web development
# Tkinter        - GUI applications
# OpenCV         - Image processing
# TensorFlow     - Machine Learning
# BeautifulSoup  - Web scraping
            </pre>
        `,

        "Mini Python Project": `
            <p>Build a complete Python project to apply everything you have learned.</p>
            <pre>
# Project: Student Management System

class Student:
    def __init__(self, name, roll, marks):
        self.name = name
        self.roll = roll
        self.marks = marks

    def grade(self):
        if self.marks >= 90: return "A+"
        elif self.marks >= 80: return "A"
        elif self.marks >= 70: return "B"
        elif self.marks >= 60: return "C"
        else: return "F"

    def __str__(self):
        return f"{self.roll} | {self.name} | {self.marks} | {self.grade()}"

# Features to implement:
# ✔ Add new students
# ✔ View all students
# ✔ Search by name or roll number
# ✔ Update marks
# ✔ Delete student
# ✔ Save/Load from file (JSON)
# ✔ Sort by name, marks, or roll number
# ✔ Calculate class average
            </pre>
            <p><b>Tip:</b> Use functions, classes, file handling, and exception handling to build a robust project.</p>
        `,

        // =============================================
        // DATABASE MANAGEMENT NOTES
        // =============================================

        "Introduction to DBMS": `
            <p>A Database Management System (DBMS) is software that stores, manages, and retrieves data efficiently.</p>
            <pre>
Types of DBMS:
┌─────────────────┬────────────────────┐
│ Type            │ Example            │
├─────────────────┼────────────────────┤
│ Relational      │ MySQL, PostgreSQL  │
│ NoSQL           │ MongoDB, Redis     │
│ Hierarchical    │ IBM IMS            │
│ Network         │ IDMS               │
│ Object-Oriented │ ObjectDB           │
└─────────────────┴────────────────────┘

Advantages of DBMS:
• Data integrity and consistency
• Reduced data redundancy
• Concurrent access
• Backup and recovery
• Data security
            </pre>
        `,

        "Database Concepts": `
            <p>Key database terminology and concepts every student must understand.</p>
            <pre>
Key Terms:
• Database  — Organized collection of related data
• Table     — Collection of related records (rows)
• Record    — Single row of data (also called tuple)
• Field     — Single column (attribute)
• Schema    — Structure/design of the database

Example Table: STUDENTS
┌────┬──────────┬─────┬───────────┐
│ ID │ Name     │ Age │ Branch    │
├────┼──────────┼─────┼───────────┤
│ 1  │ Aman     │ 20  │ CSE       │
│ 2  │ Priya    │ 21  │ IT        │
│ 3  │ Rahul    │ 20  │ ECE       │
└────┴──────────┴─────┴───────────┘

Data Independence:
• Logical — change schema without changing apps
• Physical — change storage without changing schema
            </pre>
        `,

        "Database Tables": `
            <p>Tables are the fundamental building blocks of relational databases.</p>
            <pre>
-- Creating a table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT CHECK (age >= 18),
    branch VARCHAR(50) DEFAULT 'CSE'
);

-- Data types in SQL
INT          — Integer numbers
VARCHAR(n)   — Variable-length string
CHAR(n)      — Fixed-length string
DATE         — Date (YYYY-MM-DD)
FLOAT/DOUBLE — Decimal numbers
BOOLEAN      — True/False
TEXT         — Long text
            </pre>
        `,

        "Primary and Foreign Keys": `
            <p>Keys establish relationships between tables and ensure data integrity.</p>
            <pre>
-- Primary Key: uniquely identifies each record
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Foreign Key: links two tables
CREATE TABLE marks (
    mark_id INT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(50),
    score INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Visual relationship:
STUDENTS                    MARKS
┌────────────┬──────┐      ┌─────┬────────────┬─────────┬───┐
│ student_id │ name │      │ id  │ student_id │ subject │ ✓ │
├────────────┼──────┤      ├─────┼────────────┼─────────┼───┤
│ 1          │ Aman │◄────►│ 1   │ 1          │ Math    │85 │
│ 2          │ Priya│◄────►│ 2   │ 2          │ Math    │92 │
└────────────┴──────┘      └─────┴────────────┴─────────┴───┘
            </pre>
        `,

        "SQL Introduction": `
            <p>SQL (Structured Query Language) is the standard language for managing relational databases.</p>
            <pre>
SQL Categories:
┌─────┬──────────────────────────────────────┐
│ DDL │ CREATE, ALTER, DROP, TRUNCATE        │
│ DML │ INSERT, UPDATE, DELETE               │
│ DQL │ SELECT                               │
│ DCL │ GRANT, REVOKE                        │
│ TCL │ COMMIT, ROLLBACK, SAVEPOINT          │
└─────┴──────────────────────────────────────┘

-- Basic query structure
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1
LIMIT 10;
            </pre>
        `,

        "DDL Commands": `
            <p>DDL (Data Definition Language) commands define and modify database structure.</p>
            <pre>
-- CREATE: Make a new table
CREATE TABLE courses (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    credits INT
);

-- ALTER: Modify table structure
ALTER TABLE courses ADD COLUMN instructor VARCHAR(100);
ALTER TABLE courses DROP COLUMN credits;
ALTER TABLE courses MODIFY COLUMN name VARCHAR(200);

-- DROP: Delete entire table
DROP TABLE courses;

-- TRUNCATE: Delete all rows but keep structure
TRUNCATE TABLE courses;

-- RENAME
ALTER TABLE courses RENAME TO subjects;
            </pre>
        `,

        "DML Commands": `
            <p>DML (Data Manipulation Language) commands insert, update, and delete data.</p>
            <pre>
-- INSERT: Add new records
INSERT INTO students (name, age, branch)
VALUES ('Aman', 20, 'CSE');

-- Insert multiple rows
INSERT INTO students (name, age, branch) VALUES
('Priya', 21, 'IT'),
('Rahul', 20, 'ECE'),
('Sneha', 22, 'CSE');

-- UPDATE: Modify existing records
UPDATE students SET age = 21 WHERE name = 'Aman';
UPDATE students SET branch = 'CSE' WHERE age > 20;

-- DELETE: Remove records
DELETE FROM students WHERE name = 'Rahul';
DELETE FROM students WHERE age < 18;
            </pre>
        `,

        "DQL Commands": `
            <p>DQL (Data Query Language) is used to retrieve data from the database.</p>
            <pre>
-- Select all columns
SELECT * FROM students;

-- Select specific columns
SELECT name, age FROM students;

-- With alias
SELECT name AS student_name, age AS student_age
FROM students;

-- Distinct values
SELECT DISTINCT branch FROM students;

-- Conditional selection
SELECT * FROM students WHERE age > 20;
SELECT * FROM students WHERE branch = 'CSE' AND age <= 21;

-- Pattern matching
SELECT * FROM students WHERE name LIKE 'A%';    -- starts with A
SELECT * FROM students WHERE name LIKE '%kumar'; -- ends with kumar
SELECT * FROM students WHERE name LIKE '_m%';    -- 2nd char is m
            </pre>
        `,

        "SQL Constraints": `
            <p>Constraints enforce rules on data columns to ensure accuracy and reliability.</p>
            <pre>
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,       -- unique + not null
    name VARCHAR(100) NOT NULL,              -- cannot be empty
    email VARCHAR(100) UNIQUE,               -- no duplicates
    age INT CHECK (age >= 18 AND age <= 65), -- value range
    dept VARCHAR(50) DEFAULT 'General',      -- default value
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Constraint summary:
-- PRIMARY KEY — unique identifier
-- NOT NULL    — mandatory field
-- UNIQUE      — no duplicate values
-- CHECK       — custom validation
-- DEFAULT     — fallback value
-- FOREIGN KEY — referential integrity
            </pre>
        `,

        "WHERE Clause": `
            <p>The WHERE clause filters records based on specified conditions.</p>
            <pre>
-- Comparison operators
SELECT * FROM students WHERE age = 20;
SELECT * FROM students WHERE age != 20;
SELECT * FROM students WHERE age > 18;

-- AND, OR, NOT
SELECT * FROM students
WHERE branch = 'CSE' AND age > 20;

SELECT * FROM students
WHERE branch = 'CSE' OR branch = 'IT';

SELECT * FROM students WHERE NOT branch = 'ECE';

-- IN: match against a list
SELECT * FROM students
WHERE branch IN ('CSE', 'IT', 'ECE');

-- BETWEEN: range check
SELECT * FROM students WHERE age BETWEEN 18 AND 25;

-- IS NULL
SELECT * FROM students WHERE phone IS NULL;

-- LIKE: pattern matching
SELECT * FROM students WHERE name LIKE '%kumar%';
            </pre>
        `,

        "ORDER BY and GROUP BY": `
            <p>ORDER BY sorts results, GROUP BY groups rows for aggregate calculations.</p>
            <pre>
-- ORDER BY: sorting
SELECT * FROM students ORDER BY name ASC;       -- A to Z
SELECT * FROM students ORDER BY age DESC;       -- highest first
SELECT * FROM students ORDER BY branch, name;   -- multi-column

-- GROUP BY: grouping
SELECT branch, COUNT(*) AS total
FROM students
GROUP BY branch;

-- Result:
-- CSE | 15
-- IT  | 12
-- ECE | 10

-- HAVING: filter groups (like WHERE but for groups)
SELECT branch, AVG(marks) AS avg_marks
FROM students
GROUP BY branch
HAVING AVG(marks) > 80;
            </pre>
        `,

        "Aggregate Functions": `
            <p>Aggregate functions perform calculations on a set of values and return a single result.</p>
            <pre>
-- COUNT: number of rows
SELECT COUNT(*) FROM students;
SELECT COUNT(DISTINCT branch) FROM students;

-- SUM: total
SELECT SUM(marks) FROM results WHERE subject = 'Math';

-- AVG: average
SELECT AVG(marks) AS average FROM results;

-- MIN and MAX
SELECT MIN(marks) AS lowest, MAX(marks) AS highest
FROM results;

-- Combined with GROUP BY
SELECT subject,
       COUNT(*) AS students,
       AVG(marks) AS average,
       MIN(marks) AS lowest,
       MAX(marks) AS highest
FROM results
GROUP BY subject;
            </pre>
        `,

        "Joins in SQL": `
            <p>Joins combine rows from two or more tables based on a related column.</p>
            <pre>
-- INNER JOIN: only matching rows
SELECT s.name, m.subject, m.score
FROM students s
INNER JOIN marks m ON s.id = m.student_id;

-- LEFT JOIN: all from left + matching from right
SELECT s.name, m.subject
FROM students s
LEFT JOIN marks m ON s.id = m.student_id;

-- RIGHT JOIN: all from right + matching from left
SELECT s.name, m.subject
FROM students s
RIGHT JOIN marks m ON s.id = m.student_id;

-- FULL OUTER JOIN: all rows from both
SELECT s.name, m.subject
FROM students s
FULL OUTER JOIN marks m ON s.id = m.student_id;

-- Visual:
--  INNER: Only intersection
--  LEFT:  All left + intersection
--  RIGHT: All right + intersection
--  FULL:  Everything
            </pre>
        `,

        "Subqueries": `
            <p>A subquery is a query nested inside another query.</p>
            <pre>
-- Subquery in WHERE
SELECT name FROM students
WHERE marks > (SELECT AVG(marks) FROM students);

-- Subquery in FROM
SELECT branch, avg_marks
FROM (
    SELECT branch, AVG(marks) AS avg_marks
    FROM students
    GROUP BY branch
) AS branch_stats
WHERE avg_marks > 80;

-- Subquery with IN
SELECT name FROM students
WHERE id IN (
    SELECT student_id FROM marks WHERE score > 90
);

-- Correlated subquery
SELECT s.name
FROM students s
WHERE s.marks > (
    SELECT AVG(marks) FROM students
    WHERE branch = s.branch
);
            </pre>
        `,

        "Database Relationships": `
            <p>Relationships define how tables are connected to each other.</p>
            <pre>
1. One-to-One (1:1)
   Student ──── Passport
   Each student has one passport

2. One-to-Many (1:N)
   Department ──── Employees
   One department has many employees

3. Many-to-Many (M:N)
   Students ──── Courses
   Uses a junction table:

   STUDENTS          ENROLLMENT          COURSES
   ┌────┬──────┐    ┌────┬────┬────┐    ┌────┬─────────┐
   │ id │ name │    │sid │cid │sem │    │ id │ name    │
   ├────┼──────┤    ├────┼────┼────┤    ├────┼─────────┤
   │ 1  │ Aman │    │ 1  │ 1  │ 3  │    │ 1  │ Python  │
   │ 2  │ Priya│    │ 1  │ 2  │ 3  │    │ 2  │ DBMS    │
   └────┴──────┘    │ 2  │ 1  │ 3  │    └────┴─────────┘
                    └────┴────┴────┘
            </pre>
        `,

        "Normalization": `
            <p>Normalization organizes data to reduce redundancy and improve data integrity.</p>
            <pre>
Normal Forms:

1NF — No repeating groups, atomic values
  ✗ Courses: "Math, Science"
  ✓ Course1: "Math", Course2: "Science"

2NF — 1NF + no partial dependencies
  All non-key columns depend on the FULL primary key

3NF — 2NF + no transitive dependencies
  Non-key columns depend ONLY on the primary key

BCNF — Every determinant is a candidate key

Example of normalization:
Before: Student(id, name, course, instructor, dept)
After:
  Student(id, name)
  Enrollment(student_id, course_id)
  Course(id, name, instructor_id)
  Instructor(id, name, dept_id)
  Department(id, name)
            </pre>
        `,

        "Indexing": `
            <p>Indexes speed up data retrieval by creating efficient lookup structures.</p>
            <pre>
-- Create an index
CREATE INDEX idx_name ON students(name);

-- Unique index
CREATE UNIQUE INDEX idx_email ON students(email);

-- Composite index (multiple columns)
CREATE INDEX idx_branch_age ON students(branch, age);

-- Drop an index
DROP INDEX idx_name ON students;

-- When to use indexes:
✔ Columns used in WHERE clauses
✔ Columns used in JOIN conditions
✔ Columns used in ORDER BY
✗ Small tables (not needed)
✗ Columns with many NULL values
✗ Frequently updated columns (slow writes)

-- How it works:
-- Without index: Full table scan O(n)
-- With index: B-Tree lookup O(log n)
            </pre>
        `,

        "Views": `
            <p>A view is a virtual table based on the result of a SQL query.</p>
            <pre>
-- Create a view
CREATE VIEW top_students AS
SELECT name, branch, marks
FROM students
WHERE marks > 85
ORDER BY marks DESC;

-- Use the view like a table
SELECT * FROM top_students;

-- Update a view
CREATE OR REPLACE VIEW top_students AS
SELECT name, branch, marks, grade
FROM students
WHERE marks > 80;

-- Drop a view
DROP VIEW top_students;

-- Benefits:
-- • Simplifies complex queries
-- • Provides data security (hide columns)
-- • Creates a consistent interface
-- • Does not store data physically
            </pre>
        `,

        "Transactions": `
            <p>A transaction is a sequence of operations that must all succeed or all fail.</p>
            <pre>
-- ACID Properties:
-- A - Atomicity    (all or nothing)
-- C - Consistency  (valid state to valid state)
-- I - Isolation    (concurrent transactions don't interfere)
-- D - Durability   (committed data survives crashes)

-- Transaction example: Bank Transfer
START TRANSACTION;

UPDATE accounts SET balance = balance - 500
WHERE account_id = 101;

UPDATE accounts SET balance = balance + 500
WHERE account_id = 102;

-- If both succeed:
COMMIT;

-- If any fails:
ROLLBACK;

-- Savepoint: partial rollback
SAVEPOINT before_update;
UPDATE students SET marks = 95 WHERE id = 1;
ROLLBACK TO before_update;
            </pre>
        `,

        "Database Project": `
            <p>Build a complete database project applying all SQL and DBMS concepts.</p>
            <pre>
Project: Library Management System

Tables:
• books (id, title, author, isbn, copies)
• members (id, name, email, phone, join_date)
• borrowings (id, book_id, member_id, borrow_date, return_date)
• categories (id, name)
• book_categories (book_id, category_id)

Features:
✔ CRUD operations for books and members
✔ Borrow and return books with date tracking
✔ Check book availability
✔ View borrowing history
✔ Search books by title, author, category
✔ Reports: most borrowed, overdue books
✔ Use JOINs, Subqueries, Views, Indexes
            </pre>
        `,

        // =============================================
        // COMPUTER SCIENCE NOTES
        // =============================================

        "Introduction to Computer Science": `
            <p>Computer Science is the study of computation, information, and automation.</p>
            <pre>
Core Areas of Computer Science:
├── Programming Languages
├── Data Structures & Algorithms
├── Operating Systems
├── Computer Networks
├── Database Management
├── Software Engineering
├── Artificial Intelligence
├── Cyber Security
└── Cloud Computing

Career Paths:
• Software Developer
• Data Scientist
• System Administrator
• Network Engineer
• AI/ML Engineer
• Cybersecurity Analyst
            </pre>
        `,

        "Computer Fundamentals": `
            <p>Understanding the basic components and working of a computer system.</p>
            <pre>
Input → Processing → Output → Storage

Input Devices:   Keyboard, Mouse, Scanner, Microphone
Output Devices:  Monitor, Printer, Speaker
Processing:      CPU (Central Processing Unit)
Storage:         RAM (temporary), HDD/SSD (permanent)

Computer Generations:
1st: Vacuum Tubes      (1940-1956)
2nd: Transistors        (1956-1963)
3rd: Integrated Circuits(1963-1971)
4th: Microprocessors    (1971-present)
5th: AI & Quantum       (present-future)
            </pre>
        `,

        "Number Systems": `
            <p>Number systems represent values using different bases.</p>
            <pre>
Binary (Base 2):     0, 1
Octal (Base 8):      0-7
Decimal (Base 10):   0-9
Hexadecimal (Base 16): 0-9, A-F

Conversions:
Decimal 25 → Binary:
  25 ÷ 2 = 12 R 1
  12 ÷ 2 = 6  R 0
   6 ÷ 2 = 3  R 0
   3 ÷ 2 = 1  R 1
   1 ÷ 2 = 0  R 1
  Answer: 11001 (read remainders bottom to top)

Binary 11001 → Decimal:
  1×16 + 1×8 + 0×4 + 0×2 + 1×1 = 25

Decimal 255 → Hex: FF
Binary 11111111 → Hex: FF
            </pre>
        `,

        "Operating System Basics": `
            <p>An Operating System manages hardware resources and provides services to user programs.</p>
            <pre>
Functions of OS:
• Process Management
• Memory Management
• File System Management
• Device Management
• Security & Access Control
• User Interface (GUI/CLI)

Popular Operating Systems:
┌─────────────────┬──────────────────┐
│ Desktop/Laptop  │ Mobile           │
├─────────────────┼──────────────────┤
│ Windows         │ Android          │
│ macOS           │ iOS              │
│ Linux (Ubuntu)  │ HarmonyOS        │
└─────────────────┴──────────────────┘

OS Architecture:
  User Applications
       ↕
  System Calls (API)
       ↕
  Kernel (core of OS)
       ↕
  Hardware
            </pre>
        `,

        "Networking Basics": `
            <p>Computer networking connects devices to share resources and communicate.</p>
            <pre>
Network Types by Size:
• PAN  — Personal Area Network (Bluetooth)
• LAN  — Local Area Network (office, home)
• MAN  — Metropolitan Area Network (city)
• WAN  — Wide Area Network (internet)

Key Concepts:
• IP Address: 192.168.1.1 (device identifier)
• MAC Address: AA:BB:CC:DD:EE:FF (hardware ID)
• Port: 80 (HTTP), 443 (HTTPS), 22 (SSH)
• Protocol: Rules for communication (HTTP, TCP, UDP)
• DNS: Converts domain names to IP addresses

Network Devices:
• Router — connects different networks
• Switch — connects devices in same network
• Hub — basic connector (broadcasts to all)
• Firewall — security filter
            </pre>
        `,

        "Network Topologies": `
            <p>Network topology describes how devices are arranged and connected.</p>
            <pre>
1. Star Topology:
      ┌──Device──┐
      │          │
   Device──Hub──Device
      │          │
      └──Device──┘
   ✔ Easy to manage, one failure = one device

2. Bus Topology:
   Device──Device──Device──Device
   ════════════════════════════════
   ✔ Simple, ✗ single point of failure

3. Ring Topology:
   Device → Device → Device
     ↑                  ↓
   Device ← Device ← Device
   ✔ Equal access, ✗ one break stops all

4. Mesh Topology:
   Every device connected to every other
   ✔ Most reliable, ✗ expensive

5. Hybrid: Combination of above
            </pre>
        `,

        "Cyber Security Basics": `
            <p>Cybersecurity protects systems, networks, and data from digital attacks.</p>
            <pre>
Common Threats:
• Malware   — viruses, worms, ransomware
• Phishing  — fake emails/websites
• SQL Injection — database attacks
• DDoS      — overwhelming servers
• MitM      — intercepting communication

Protection Measures:
✔ Strong passwords + 2FA
✔ Regular software updates
✔ Firewalls and antivirus
✔ Data encryption (HTTPS, SSL)
✔ Regular backups
✔ Security awareness training

Encryption Types:
• Symmetric: Same key to encrypt/decrypt (AES)
• Asymmetric: Public + Private key pair (RSA)
• Hashing: One-way conversion (SHA-256, bcrypt)
            </pre>
        `,

        "Cloud Computing": `
            <p>Cloud computing delivers computing services over the internet.</p>
            <pre>
Service Models:
┌──────┬────────────────────────────────┐
│ IaaS │ Virtual machines, storage      │
│      │ (AWS EC2, Azure VMs)           │
├──────┼────────────────────────────────┤
│ PaaS │ Platform to build apps         │
│      │ (Heroku, Google App Engine)    │
├──────┼────────────────────────────────┤
│ SaaS │ Ready-to-use software          │
│      │ (Gmail, Dropbox, Office 365)   │
└──────┴────────────────────────────────┘

Deployment Models:
• Public Cloud (AWS, Azure, GCP)
• Private Cloud (company-owned)
• Hybrid Cloud (mix of both)

Benefits:
✔ No hardware costs
✔ Scale up/down on demand
✔ Pay only for what you use
✔ Access from anywhere
✔ Automatic backups
            </pre>
        `,

        // =============================================
        // JAVASCRIPT BASICS NOTES
        // =============================================

        "Variables and Data Types": `
            <p>Variables store data values. Python determines the data type automatically.</p>
            <pre>
# Python Variables
name = "Aman"           # String
age = 20                # Integer
height = 5.9            # Float
is_student = True       # Boolean

# Multiple assignment
a, b, c = 1, 2, 3

# Type checking
print(type(name))   # &lt;class 'str'&gt;
print(type(age))    # &lt;class 'int'&gt;
            </pre>
        `,

        "Operators": `
            <p>JavaScript operators perform operations on values and variables.</p>
            <pre>
// Arithmetic
5 + 3    // 8
10 - 4   // 6
3 * 4    // 12
10 / 3   // 3.333
10 % 3   // 1 (remainder)
2 ** 3   // 8 (exponent)

// Comparison
5 == "5"    // true  (loose equality)
5 === "5"   // false (strict equality)
5 !== "5"   // true

// Logical
true && false   // false
true || false   // true
!true           // false

// Ternary
let status = age >= 18 ? "Adult" : "Minor";
            </pre>
        `,

        "Arrow Functions": `
            <p>Arrow functions are a concise way to write functions in ES6.</p>
            <pre>
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter (no parentheses needed)
const double = x => x * 2;

// Multi-line arrow function
const greet = (name) => {
    let message = "Hello, " + name;
    return message + "!";
};

// Arrow functions in array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((a, b) => a + b, 0);
            </pre>
        `,

        "Array Methods": `
            <p>JavaScript arrays have powerful built-in methods for data manipulation.</p>
            <pre>
const fruits = ["Apple", "Banana", "Mango"];

// Adding/Removing
fruits.push("Orange");      // add to end
fruits.pop();               // remove from end
fruits.unshift("Grapes");   // add to start
fruits.shift();             // remove from start

// Searching
fruits.indexOf("Banana");   // 1
fruits.includes("Mango");   // true
fruits.find(f => f.length > 5);  // "Banana"

// Transforming
const upper = fruits.map(f => f.toUpperCase());
const long = fruits.filter(f => f.length > 4);
const all = fruits.every(f => f.length > 2);  // true
const any = fruits.some(f => f === "Apple");   // true

// Joining
fruits.join(", ");  // "Apple, Banana, Mango"

// Sorting
const nums = [3, 1, 4, 1, 5];
nums.sort((a, b) => a - b);  // [1, 1, 3, 4, 5]
            </pre>
        `,

        "Objects": `
            <p>Objects store data as key-value pairs and are fundamental to JavaScript.</p>
            <pre>
// Creating an object
const student = {
    name: "Aman",
    age: 20,
    branch: "CSE",
    greet() {
        return "Hello, I am " + this.name;
    }
};

// Accessing properties
console.log(student.name);       // dot notation
console.log(student["branch"]);  // bracket notation

// Modifying
student.age = 21;
student.college = "GLA";
delete student.branch;

// Object methods
Object.keys(student);    // ["name", "age", ...]
Object.values(student);  // ["Aman", 21, ...]
Object.entries(student); // [["name","Aman"], ...]

// Destructuring
const { name, age } = student;

// Spread operator
const copy = { ...student, year: 2024 };
            </pre>
        `,

        "DOM Introduction": `
            <p>The DOM (Document Object Model) is a tree representation of the HTML page.</p>
            <pre>
DOM Tree:
  document
   └── html
        ├── head
        │    └── title
        └── body
             ├── h1
             ├── p
             └── div
                  ├── p
                  └── ul
                       ├── li
                       └── li

// The document object is the entry point
console.log(document.title);
console.log(document.URL);
console.log(document.body);

// DOM node types:
// Element nodes  — HTML tags
// Text nodes     — text content
// Attribute nodes — tag attributes
// Comment nodes  — HTML comments
            </pre>
        `,

        "DOM Selectors": `
            <p>DOM selectors let you find and target HTML elements from JavaScript.</p>
            <pre>
// By ID (returns single element)
let el = document.getElementById("header");

// By class name (returns HTMLCollection)
let items = document.getElementsByClassName("item");

// By tag name
let paras = document.getElementsByTagName("p");

// Query selector (returns first match)
let first = document.querySelector(".card");
let nav = document.querySelector("#nav > ul > li");

// Query selector all (returns NodeList)
let all = document.querySelectorAll(".card");
let links = document.querySelectorAll("a[href]");

// Traversing the DOM
el.parentElement;       // parent
el.children;            // child elements
el.firstElementChild;   // first child
el.nextElementSibling;  // next sibling
            </pre>
        `,

        "Event Handling": `
            <p>Event handling connects user actions to JavaScript functions.</p>
            <pre>
// addEventListener (recommended)
const btn = document.getElementById("btn");

btn.addEventListener("click", function(event) {
    console.log("Clicked!", event.target);
});

// Event object properties
function handleClick(e) {
    e.type;           // "click"
    e.target;         // element clicked
    e.clientX;        // mouse X position
    e.clientY;        // mouse Y position
    e.preventDefault(); // stop default behavior
    e.stopPropagation(); // stop event bubbling
}

// Event delegation (handle child events on parent)
document.getElementById("list")
    .addEventListener("click", function(e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("done");
        }
    });

// Remove event listener
btn.removeEventListener("click", handleClick);
            </pre>
        `,

        "Form Validation": `
            <p>Form validation ensures user input is correct before submission.</p>
            <pre>
const form = document.getElementById("signupForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("pass").value;
    let errors = [];

    // Name validation
    if (name.length < 2) {
        errors.push("Name must be at least 2 characters");
    }

    // Email validation
    let emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailPattern.test(email)) {
        errors.push("Invalid email format");
    }

    // Password validation
    if (password.length < 8) {
        errors.push("Password must be 8+ characters");
    }

    if (errors.length > 0) {
        alert(errors.join("\\n"));
    } else {
        alert("Form submitted successfully!");
        form.submit();
    }
});
            </pre>
        `,

        "JavaScript Mini Project": `
            <p>Build a complete interactive web application using JavaScript.</p>
            <pre>
Project: Todo List Application

Features:
✔ Add new tasks
✔ Mark tasks as complete/incomplete
✔ Delete tasks
✔ Filter (All / Active / Completed)
✔ Save to localStorage
✔ Task counter
✔ Clear completed tasks
✔ Edit task text
✔ Drag and drop reorder

Technologies:
• HTML for structure
• CSS for styling & animations
• JavaScript for logic
• localStorage for persistence
            </pre>
        `,

        // =============================================
        // DATA STRUCTURES NOTES
        // =============================================

        "Introduction to Data Structures": `
            <p>Data structures organize and store data efficiently for access and modification.</p>
            <pre>
Classification:
├── Linear
│   ├── Array
│   ├── Linked List
│   ├── Stack
│   └── Queue
└── Non-Linear
    ├── Tree
    ├── Graph
    └── Hash Table

Choosing the right structure:
┌─────────────┬──────────┬──────────┬────────┐
│ Operation   │ Array    │ LinkedList│ Hash   │
├─────────────┼──────────┼──────────┼────────┤
│ Access      │ O(1)     │ O(n)     │ O(1)   │
│ Search      │ O(n)     │ O(n)     │ O(1)   │
│ Insert      │ O(n)     │ O(1)     │ O(1)   │
│ Delete      │ O(n)     │ O(1)     │ O(1)   │
└─────────────┴──────────┴──────────┴────────┘
            </pre>
        `,

        "Arrays": `
            <p>Arrays store elements of the same type in contiguous memory locations.</p>
            <pre>
// Array declaration
int arr[] = {10, 20, 30, 40, 50};

// Access by index (0-based)
arr[0]  → 10
arr[4]  → 50

// Traversal
for (int i = 0; i &lt; 5; i++) {
    printf("%d ", arr[i]);
}

// 2D Array
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Time Complexity:
// Access: O(1) — direct index
// Search: O(n) — linear scan
// Insert: O(n) — shift elements
// Delete: O(n) — shift elements
            </pre>
        `,

        "Linked Lists": `
            <p>A linked list is a linear data structure where elements are stored in nodes connected by pointers.</p>
            <pre>
Node structure:
┌──────┬──────┐    ┌──────┬──────┐    ┌──────┬──────┐
│ Data │ Next │───►│ Data │ Next │───►│ Data │ NULL │
└──────┴──────┘    └──────┴──────┘    └──────┴──────┘
  10                  20                  30

Types:
• Singly Linked List (one-way)
• Doubly Linked List (two-way)
• Circular Linked List (last → first)

Operations:
• Insert at beginning: O(1)
• Insert at end: O(n)
• Delete: O(n) to find, O(1) to remove
• Search: O(n)

vs Array:
✔ Dynamic size
✔ Easy insert/delete
✗ No random access
✗ Extra memory for pointers
            </pre>
        `,

        "Stacks": `
            <p>A stack follows LIFO (Last In, First Out) principle — like a stack of plates.</p>
            <pre>
Operations:
  push(10) → [10]
  push(20) → [10, 20]
  push(30) → [10, 20, 30]
  pop()    → 30, stack = [10, 20]
  peek()   → 20 (top element, no removal)

All operations: O(1)

Applications:
• Undo/Redo functionality
• Browser back button
• Function call stack
• Expression evaluation
• Balanced parentheses checking

Example: Check balanced brackets
  Input: "{[()]}"
  Process: Push open brackets, pop for matching close
  Result: ✓ Balanced
            </pre>
        `,

        "Queues": `
            <p>A queue follows FIFO (First In, First Out) — like a line at a ticket counter.</p>
            <pre>
Operations:
  enqueue(10) → [10]
  enqueue(20) → [10, 20]
  enqueue(30) → [10, 20, 30]
  dequeue()   → 10, queue = [20, 30]
  front()     → 20

Types:
• Simple Queue (FIFO)
• Circular Queue (wraps around)
• Priority Queue (highest priority first)
• Deque (double-ended, insert/remove both ends)

Applications:
• Print job scheduling
• CPU task scheduling
• BFS graph traversal
• Message queues
• Customer service systems
            </pre>
        `,

        "Trees": `
            <p>A tree is a hierarchical data structure with nodes connected by edges.</p>
            <pre>
Binary Search Tree (BST):
           50
         /    \\
       30      70
      /  \\    /  \\
    20   40  60   80

Properties:
• Left child &lt; Parent
• Right child &gt; Parent
• Maximum 2 children per node

Operations:
• Search: O(log n) average, O(n) worst
• Insert: O(log n) average
• Delete: O(log n) average

Tree Traversals:
• Inorder (Left→Root→Right): 20,30,40,50,60,70,80
• Preorder (Root→Left→Right): 50,30,20,40,70,60,80
• Postorder (Left→Right→Root): 20,40,30,60,80,70,50
• Level Order: 50,30,70,20,40,60,80
            </pre>
        `,

        "Sorting Algorithms": `
            <p>Sorting arranges elements in a specific order (ascending or descending).</p>
            <pre>
Algorithm Comparison:
┌──────────────┬──────────┬──────────┬────────┐
│ Algorithm    │ Best     │ Average  │ Worst  │
├──────────────┼──────────┼──────────┼────────┤
│ Bubble Sort  │ O(n)     │ O(n²)   │ O(n²)  │
│ Selection    │ O(n²)    │ O(n²)   │ O(n²)  │
│ Insertion    │ O(n)     │ O(n²)   │ O(n²)  │
│ Merge Sort   │ O(nlogn) │ O(nlogn)│O(nlogn)│
│ Quick Sort   │ O(nlogn) │ O(nlogn)│ O(n²)  │
└──────────────┴──────────┴──────────┴────────┘

Bubble Sort example:
[5, 3, 8, 1, 2]
Pass 1: [3, 5, 1, 2, 8]
Pass 2: [3, 1, 2, 5, 8]
Pass 3: [1, 2, 3, 5, 8] ✓ Sorted
            </pre>
        `,

        "Searching Algorithms": `
            <p>Searching finds a specific element within a data structure.</p>
            <pre>
1. Linear Search — O(n)
   Check each element one by one
   Works on unsorted data

   [10, 25, 7, 42, 15]  Target: 42
    ✗   ✗   ✗   ✓  Found at index 3

2. Binary Search — O(log n)
   Requires sorted array
   Divide and conquer approach

   [10, 15, 25, 35, 42, 50, 65]  Target: 42
   Step 1: mid=35, 42>35 → search right
   Step 2: mid=50, 42<50 → search left
   Step 3: mid=42 ✓ Found!

Comparison:
n = 1,000,000 elements
Linear: up to 1,000,000 comparisons
Binary: maximum 20 comparisons!
            </pre>
        `,

        "Binary Search": `
            <p>Binary Search is an efficient algorithm that works on sorted arrays by repeatedly dividing the search interval in half.</p>
            <pre>
Algorithm:
1. Find the middle element
2. If target == middle → found!
3. If target &lt; middle → search left half
4. If target &gt; middle → search right half
5. Repeat until found or range is empty

Example: Find 42 in [10, 15, 25, 35, 42, 50, 65]

Step 1: low=0, high=6, mid=3 → arr[3]=35
        42 > 35 → search right, low=4

Step 2: low=4, high=6, mid=5 → arr[5]=50
        42 &lt; 50 → search left, high=4

Step 3: low=4, high=4, mid=4 → arr[4]=42 ✓ FOUND!

Time: O(log n) | Space: O(1) iterative, O(log n) recursive
            </pre>
        `,

        "Graphs": `
            <p>A graph consists of vertices (nodes) connected by edges. Used to model relationships.</p>
            <pre>
Types:
• Directed (one-way edges)
• Undirected (two-way edges)
• Weighted (edges have values)

Example:
    A ──── B
    │      │
    │      │
    C ──── D

Representations:
Adjacency Matrix:    Adjacency List:
  A B C D            A → [B, C]
A 0 1 1 0            B → [A, D]
B 1 0 0 1            C → [A, D]
C 1 0 0 1            D → [B, C]
D 0 1 1 0

Traversals:
• BFS (Breadth-First): uses Queue, level by level
• DFS (Depth-First): uses Stack, go deep first

Applications: Google Maps, social networks, web crawling
            </pre>
        `,

        "Hashing": `
            <p>Hashing maps data to fixed-size values for fast O(1) average lookup.</p>
            <pre>
Hash Function: key → index
  "Aman"  → hash("Aman")  → 3
  "Priya" → hash("Priya") → 7

Hash Table:
Index:  0   1   2   3     4   5   6   7
Data: [ ] [ ] [ ] [Aman] [ ] [ ] [ ] [Priya]

Collision Resolution:
1. Chaining: each slot has a linked list
   [3] → Aman → Rahul → NULL

2. Open Addressing: find next empty slot
   Linear Probing: check next index
   Quadratic Probing: check i² positions

Time Complexity:
• Average: O(1) for insert, search, delete
• Worst: O(n) with many collisions

Applications: Dictionaries, caches, sets, databases
            </pre>
        `,

        // =============================================
        // NETWORK NOTES
        // =============================================

        "Introduction to Networking": `
            <p>Computer networking is the practice of connecting computers to share resources and communicate.</p>
            <pre>
Network Types:
• PAN (Personal) — Bluetooth, within a few meters
• LAN (Local)    — Home, office, campus
• MAN (Metro)    — City-wide network
• WAN (Wide)     — Internet, country/worldwide

Key Components:
• Router   — Routes traffic between networks
• Switch   — Connects devices in a LAN
• Modem    — Converts signals for ISP connection
• Firewall — Filters network traffic
• Server   — Provides services to clients

Data Transmission Modes:
• Simplex:      One-way (TV broadcast)
• Half-Duplex:  Both ways, one at a time (walkie-talkie)
• Full-Duplex:  Both ways simultaneously (phone call)
            </pre>
        `,

        "OSI Model": `
            <p>The OSI (Open Systems Interconnection) model divides networking into 7 layers.</p>
            <pre>
Layer 7: Application    — HTTP, FTP, SMTP, DNS
Layer 6: Presentation   — Encryption, Compression
Layer 5: Session        — Session management
Layer 4: Transport      — TCP (reliable), UDP (fast)
Layer 3: Network        — IP addressing, routing
Layer 2: Data Link      — MAC addressing, frames
Layer 1: Physical       — Cables, signals, bits

Mnemonic: "All People Seem To Need Data Processing"
          (Application → Physical)

Data encapsulation:
Application → Data
Transport   → Segment
Network     → Packet
Data Link   → Frame
Physical    → Bits
            </pre>
        `,

        "TCP/IP Model": `
            <p>The TCP/IP model is the practical networking model used by the internet.</p>
            <pre>
TCP/IP Layers (4 layers):
┌───────────────────┬─────────────────────┐
│ Application       │ HTTP, FTP, DNS, SMTP│
├───────────────────┼─────────────────────┤
│ Transport         │ TCP, UDP            │
├───────────────────┼─────────────────────┤
│ Internet          │ IP, ICMP, ARP       │
├───────────────────┼─────────────────────┤
│ Network Access    │ Ethernet, Wi-Fi     │
└───────────────────┴─────────────────────┘

TCP vs UDP:
┌──────────┬────────────────┬────────────────┐
│          │ TCP            │ UDP            │
├──────────┼────────────────┼────────────────┤
│ Type     │ Connection     │ Connectionless │
│ Reliable │ Yes            │ No             │
│ Order    │ Guaranteed     │ Not guaranteed │
│ Speed    │ Slower         │ Faster         │
│ Use      │ Web, Email     │ Video, Gaming  │
└──────────┴────────────────┴────────────────┘
            </pre>
        `,

        "IP Addressing": `
            <p>IP addresses uniquely identify devices on a network.</p>
            <pre>
IPv4 Format: 192.168.1.100 (32 bits, 4 octets)

IP Classes:
┌───────┬─────────────────┬──────────────┐
│ Class │ Range           │ Use          │
├───────┼─────────────────┼──────────────┤
│ A     │ 1.0.0.0 –       │ Large nets   │
│       │ 126.255.255.255 │              │
│ B     │ 128.0.0.0 –     │ Medium nets  │
│       │ 191.255.255.255 │              │
│ C     │ 192.0.0.0 –     │ Small nets   │
│       │ 223.255.255.255 │              │
└───────┴─────────────────┴──────────────┘

Private IP Ranges:
• 10.0.0.0 – 10.255.255.255
• 172.16.0.0 – 172.31.255.255
• 192.168.0.0 – 192.168.255.255

Subnet Mask: 255.255.255.0 (/24)
Determines network vs host portion

IPv6: 128-bit address (future-proof)
Example: 2001:0db8:85a3::8a2e:0370:7334
            </pre>
        `,

        "Network Protocols": `
            <p>Protocols are rules that govern how data is transmitted across networks.</p>
            <pre>
Common Protocols:
┌──────────┬──────┬──────────────────────────┐
│ Protocol │ Port │ Purpose                  │
├──────────┼──────┼──────────────────────────┤
│ HTTP     │ 80   │ Web pages (unencrypted)  │
│ HTTPS    │ 443  │ Web pages (encrypted)    │
│ FTP      │ 21   │ File transfer            │
│ SSH      │ 22   │ Secure remote access     │
│ SMTP     │ 25   │ Sending emails           │
│ POP3     │ 110  │ Receiving emails         │
│ IMAP     │ 143  │ Email access             │
│ DNS      │ 53   │ Domain name resolution   │
│ DHCP     │ 67/68│ IP address assignment    │
│ Telnet   │ 23   │ Remote access (insecure) │
└──────────┴──────┴──────────────────────────┘

DNS Resolution:
  you type: www.google.com
  DNS Server → resolves to → 142.250.182.46
  Browser connects to that IP address
            </pre>
        `,

        "Network Security": `
            <p>Network security protects data and resources from unauthorized access and attacks.</p>
            <pre>
Security Measures:
• Firewall — filters incoming/outgoing traffic
• VPN — encrypted tunnel for remote access
• IDS/IPS — Intrusion Detection/Prevention
• SSL/TLS — encrypts web traffic (HTTPS)
• ACL — Access Control Lists on routers

Common Attacks:
• DDoS — flood server with requests
• Man-in-the-Middle — intercept communication
• Phishing — fake websites/emails
• IP Spoofing — fake source IP address
• DNS Poisoning — redirect to wrong server

Authentication Methods:
• Passwords
• Two-Factor Authentication (2FA)
• Biometrics (fingerprint, face)
• Digital Certificates
• OAuth / Single Sign-On (SSO)
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

        <h3>4. Detailed Notes & Examples</h3>
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
