/* =========================================================
   SAMIR PORTFOLIO - MAIN WEBSITE
   Firebase Projects + Theme + Navigation
   ========================================================= */

"use strict";


/* =========================================================
   FIREBASE
   ========================================================= */

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const yearElement =
    document.getElementById("currentYear");

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");

const themeToggle =
    document.getElementById("themeToggle");

const projectsGrid =
    document.querySelector(".projects-grid");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const backToTop =
    document.getElementById("backToTop");


/* =========================================================
   CURRENT YEAR
   ========================================================= */

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );

            menuToggle.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   CLOSE MOBILE MENU
   ========================================================= */

document
    .querySelectorAll(".nav-links a")
    .forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                navLinks?.classList.remove(
                    "active"
                );

                menuToggle?.classList.remove(
                    "active"
                );

            }
        );

    });


/* =========================================================
   THEME
   ========================================================= */

const savedTheme =
    localStorage.getItem(
        "portfolio-theme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

}


function updateThemeIcon() {

    if (!themeToggle) {
        return;
    }

    const isLight =
        document.body.classList.contains(
            "light-theme"
        );


    themeToggle.textContent =
        isLight
            ? "☀️"
            : "🌙";

}


updateThemeIcon();


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-theme"
            );


            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );


            localStorage.setItem(
                "portfolio-theme",
                isLight
                    ? "light"
                    : "dark"
            );


            updateThemeIcon();

        }
    );

}


/* =========================================================
   PROJECT CATEGORY NAMES
   ========================================================= */

const categoryNames = {

    all: "All",

    gis: "GIS",

    surveying: "Surveying",

    "remote-sensing":
        "Remote Sensing",

    programming:
        "Programming"

};


/* =========================================================
   PROJECT DATA
   ========================================================= */

let allProjects = [];


/* =========================================================
   LOAD PROJECTS FROM FIRESTORE
   ========================================================= */

async function loadProjects() {

    if (!projectsGrid) {
        return;
    }


    projectsGrid.innerHTML = `

        <div class="projects-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading projects...
            </p>

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "projects"
                )
            );


        allProjects = [];


        snapshot.forEach(
            (documentSnapshot) => {

                allProjects.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        /* =================================================
           SORT
           ================================================= */

        allProjects.sort(
            (a, b) => {

                const aTime =
                    a.createdAt?.seconds ||
                    0;

                const bTime =
                    b.createdAt?.seconds ||
                    0;


                return bTime - aTime;

            }
        );


        renderProjects(
            "all"
        );


    } catch (error) {

        console.error(
            "Projects loading error:",
            error
        );


        projectsGrid.innerHTML = `

            <div class="projects-error">

                <div class="error-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load projects
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects(
    selectedCategory = "all"
) {

    if (!projectsGrid) {
        return;
    }


    let filteredProjects =
        allProjects;


    if (
        selectedCategory !==
        "all"
    ) {

        filteredProjects =
            allProjects.filter(
                (project) => {

                    return (
                        project.category ===
                        selectedCategory
                    );

                }
            );

    }


    if (
        filteredProjects.length ===
        0
    ) {

        projectsGrid.innerHTML = `

            <div class="projects-empty">

                <div class="empty-icon">
                    📂
                </div>

                <h3>
                    No projects yet
                </h3>

                <p>
                    Projects in this category
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    projectsGrid.innerHTML =
        filteredProjects
            .map(
                createProjectCard
            )
            .join("");

}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(
    project
) {

    const title =
        project.title ||
        "Untitled Project";


    const category =
        project.category ||
        "other";


    const categoryName =
        categoryNames[category] ||
        category;


    const description =
        project.description ||
        "";


    const tools =
        project.tools ||
        "";


    const status =
        project.status ||
        "Planned";


    const imageUrl =
        project.imageUrl ||
        "";


    const projectLink =
        project.projectLink ||
        "";


    let imageHTML;


    if (imageUrl) {

        imageHTML = `

            <img
                src="${escapeHTML(imageUrl)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
                onerror="this.parentElement.innerHTML='<div class=&quot;project-image-placeholder&quot;>📁</div>';"
            >

        `;

    } else {

        imageHTML = `

            <div
                class="project-image-placeholder"
            >
                📁
            </div>

        `;

    }


    let linkHTML = "";


    if (projectLink) {

        linkHTML = `

            <a
                href="${escapeHTML(projectLink)}"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
            >
                View Project
                ↗
            </a>

        `;

    }


    return `

        <article
            class="project-card"
            data-category="${escapeHTML(category)}"
        >

            <div class="project-image">

                ${imageHTML}

            </div>


            <div class="project-content">

                <div class="project-meta">

                    <span class="project-category">

                        ${escapeHTML(
                            categoryName
                        )}

                    </span>


                    <span
                        class="project-status"
                    >

                        ${escapeHTML(
                            status
                        )}

                    </span>

                </div>


                <h3>

                    ${escapeHTML(
                        title
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        description
                    )}

                </p>


                ${
                    tools
                        ? `

                            <div
                                class="project-tools"
                            >

                                <strong>
                                    Tools:
                                </strong>

                                ${escapeHTML(
                                    tools
                                )}

                            </div>

                        `
                        : ""
                }


                ${
                    linkHTML
                        ? `

                            <div
                                class="project-actions"
                            >

                                ${linkHTML}

                            </div>

                        `
                        : ""
                }

            </div>

        </article>

    `;

}


/* =========================================================
   PROJECT FILTER
   ========================================================= */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.filter ||
                    "all";


                renderProjects(
                    category
                );

            }
        );

    }
);


/* =========================================================
   SCROLL HEADER
   ========================================================= */

const header =
    document.querySelector(
        ".site-header"
    );


function handleHeaderScroll() {

    if (!header) {
        return;
    }


    if (
        window.scrollY >
        30
    ) {

        header.classList.add(
            "scrolled"
        );

    } else {

        header.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    handleHeaderScroll
);


handleHeaderScroll();


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sectionsForNav =
    document.querySelectorAll(
        "main section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );


function updateActiveNav() {

    let currentSection = "";


    sectionsForNav.forEach(
        (section) => {

            const sectionTop =
                section.offsetTop - 180;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navigationLinks.forEach(
        (link) => {

            link.classList.remove(
                "active"
            );


            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href ===
                `#${currentSection}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =========================================================
   BACK TO TOP
   ========================================================= */

function updateBackToTop() {

    if (!backToTop) {
        return;
    }


    if (
        window.scrollY >
        500
    ) {

        backToTop.classList.add(
            "show"
        );

    } else {

        backToTop.classList.remove(
            "show"
        );

    }

}


window.addEventListener(
    "scroll",
    updateBackToTop
);


if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            navLinks?.classList.remove(
                "active"
            );

            menuToggle?.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   START
   ========================================================= */

loadProjects();


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "Samir Portfolio loaded successfully."
);