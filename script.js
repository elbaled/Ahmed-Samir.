/* =========================================================
   SAMIR PORTFOLIO - MAIN WEBSITE
   Firebase Projects + Certificates
   Theme + Navigation + Filters
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

const certificatesGrid =
    document.querySelector(".certificates-grid");

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
   PROJECTS
   ========================================================= */

let allProjects = [];


const categoryNames = {

    all: "All",

    gis: "GIS",

    surveying: "Surveying",

    "remote-sensing":
        "Remote Sensing",

    programming:
        "Programming"

};


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


        allProjects.sort(
            (a, b) => {

                return (
                    (b.createdAt?.seconds || 0) -
                    (a.createdAt?.seconds || 0)
                );

            }
        );


        renderProjects("all");


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


    const imageHTML =
        imageUrl
            ? `
                <img
                    src="${escapeHTML(
                        imageUrl
                    )}"
                    alt="${escapeHTML(
                        title
                    )}"
                    loading="lazy"
                >
            `
            : `
                <div
                    class="project-image-placeholder"
                >
                    📁
                </div>
            `;


    const linkHTML =
        projectLink
            ? `
                <a
                    href="${escapeHTML(
                        projectLink
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    View Project ↗
                </a>
            `
            : "";


    return `

        <article
            class="project-card"
            data-category="${escapeHTML(
                category
            )}"
        >

            <div class="project-image">

                ${imageHTML}

            </div>


            <div class="project-content">

                <div class="project-meta">

                    <span
                        class="project-category"
                    >
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
   CERTIFICATES
   ========================================================= */

async function loadCertificates() {

    if (!certificatesGrid) {
        return;
    }


    certificatesGrid.innerHTML = `

        <div class="certificates-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading certificates...
            </p>

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "certificates"
                )
            );


        const certificates = [];


        snapshot.forEach(
            (documentSnapshot) => {

                certificates.push({

                    id:
                        documentSnapshot.id,

                    ...documentSnapshot.data()

                });

            }
        );


        certificates.sort(
            (a, b) => {

                return (
                    (b.createdAt?.seconds || 0) -
                    (a.createdAt?.seconds || 0)
                );

            }
        );


        if (
            certificates.length ===
            0
        ) {

            certificatesGrid.innerHTML = `

                <div class="certificates-empty">

                    <div class="empty-icon">
                        🎓
                    </div>

                    <h3>
                        Certificates Coming Soon
                    </h3>

                    <p>
                        My certificates will appear here.
                    </p>

                </div>

            `;

            return;

        }


        certificatesGrid.innerHTML =
            certificates
                .map(
                    createCertificateCard
                )
                .join("");


    } catch (error) {

        console.error(
            "Certificates loading error:",
            error
        );


        certificatesGrid.innerHTML = `

            <div class="certificates-error">

                <div class="error-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load certificates
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


function createCertificateCard(
    certificate
) {

    const title =
        certificate.title ||
        "Certificate";


    const issuer =
        certificate.issuer ||
        "";


    const date =
        certificate.date ||
        "";


    const description =
        certificate.description ||
        "";


    const imageUrl =
        certificate.imageUrl ||
        "";


    const certificateUrl =
        certificate.certificateUrl ||
        "";


    const imageHTML =
        imageUrl
            ? `
                <img
                    src="${escapeHTML(
                        imageUrl
                    )}"
                    alt="${escapeHTML(
                        title
                    )}"
                    loading="lazy"
                >
            `
            : `
                <div
                    class="certificate-image-placeholder"
                >
                    🎓
                </div>
            `;


    const linkHTML =
        certificateUrl
            ? `
                <a
                    href="${escapeHTML(
                        certificateUrl
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="certificate-link"
                >
                    View Certificate ↗
                </a>
            `
            : "";


    return `

        <article
            class="certificate-card"
        >

            <div
                class="certificate-image"
            >

                ${imageHTML}

            </div>


            <div
                class="certificate-content"
            >

                <h3>
                    ${escapeHTML(
                        title
                    )}
                </h3>


                ${
                    issuer
                        ? `
                            <div
                                class="certificate-issuer"
                            >

                                ${escapeHTML(
                                    issuer
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    date
                        ? `
                            <div
                                class="certificate-date"
                            >

                                ${escapeHTML(
                                    date
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    description
                        ? `
                            <p>
                                ${escapeHTML(
                                    description
                                )}
                            </p>
                        `
                        : ""
                }


                ${
                    linkHTML
                        ? `
                            <div
                                class="certificate-actions"
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
   HEADER SCROLL
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

loadCertificates();


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "Samir Portfolio loaded successfully."
);