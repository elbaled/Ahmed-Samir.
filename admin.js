/* =========================================================
   Ahmed Samir Portfolio
   Admin Dashboard
   ========================================================= */

"use strict";


/* =========================================================
   FIREBASE
   ========================================================= */

import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   ADMIN CONFIGURATION
   ========================================================= */

const ADMIN_UID =
    "Sszp0JmpjcQhpsg78kqh5VS8row1";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuButton =
    document.getElementById("menuButton");

const navItems =
    document.querySelectorAll(".nav-item[data-section]");

const contentSections =
    document.querySelectorAll(".content-section");

const pageTitle =
    document.getElementById("pageTitle");

const viewWebsiteButton =
    document.getElementById("viewWebsiteButton");

const headerWebsiteButton =
    document.getElementById("headerWebsiteButton");

const logoutButton =
    document.getElementById("logoutButton");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   MODAL ELEMENTS
   ========================================================= */

const modal =
    document.getElementById("modal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalKicker =
    document.getElementById("modalKicker");

const modalBody =
    document.getElementById("modalBody");


/* =========================================================
   STAT ELEMENTS
   ========================================================= */

const projectsCount =
    document.getElementById("projectsCount");

const certificatesCount =
    document.getElementById("certificatesCount");

const coursesCount =
    document.getElementById("coursesCount");

const skillsCount =
    document.getElementById("skillsCount");


/* =========================================================
   YEAR
   ========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   SECTION TITLES
   ========================================================= */

const sectionTitles = {

    dashboard: "Dashboard",

    projects: "Projects",

    certificates: "Certificates",

    courses: "Courses",

    skills: "Skills"

};


/* =========================================================
   OPEN SECTION
   ========================================================= */

function openSection(sectionName) {

    if (!sectionName) {
        return;
    }


    /* -----------------------------------------------------
       Hide all sections
       ----------------------------------------------------- */

    contentSections.forEach((section) => {

        section.classList.remove("active");

    });


    /* -----------------------------------------------------
       Show selected section
       ----------------------------------------------------- */

    const selectedSection =
        document.getElementById(
            `${sectionName}Section`
        );


    if (selectedSection) {

        selectedSection.classList.add("active");

    }


    /* -----------------------------------------------------
       Update navigation
       ----------------------------------------------------- */

    navItems.forEach((item) => {

        item.classList.remove("active");


        if (
            item.dataset.section ===
            sectionName
        ) {

            item.classList.add("active");

        }

    });


    /* -----------------------------------------------------
       Update title
       ----------------------------------------------------- */

    if (pageTitle) {

        pageTitle.textContent =
            sectionTitles[sectionName] ||
            "Dashboard";

    }


    /* -----------------------------------------------------
       Close mobile sidebar
       ----------------------------------------------------- */

    closeSidebar();


    /* -----------------------------------------------------
       Scroll to top
       ----------------------------------------------------- */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   NAVIGATION EVENTS
   ========================================================= */

navItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            const sectionName =
                item.dataset.section;

            openSection(sectionName);

        }
    );

});


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

document
    .querySelectorAll(
        ".quick-action[data-section]"
    )
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const sectionName =
                    button.dataset.section;

                openSection(sectionName);

            }
        );

    });


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function openSidebar() {

    if (sidebar) {

        sidebar.classList.add("open");

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.add("open");

    }

}


function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove("open");

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove("open");

    }

}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            if (
                sidebar &&
                sidebar.classList.contains("open")
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


/* =========================================================
   VIEW WEBSITE
   ========================================================= */

function openWebsite() {

    window.location.href =
        "index.html";

}


if (viewWebsiteButton) {

    viewWebsiteButton.addEventListener(
        "click",
        openWebsite
    );

}


if (headerWebsiteButton) {

    headerWebsiteButton.addEventListener(
        "click",
        openWebsite
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await signOut(auth);


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to logout. Please try again."
                );

            }

        }
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(
    type = "content"
) {

    if (!modal) {
        return;
    }


    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    if (type === "project") {

        modalKicker.textContent =
            "PROJECTS";

        modalTitle.textContent =
            "Add Project";

        modalBody.innerHTML = `

            <div class="modal-message">

                Project form will be connected
                to Firestore in the next step.

            </div>

        `;

    }


    else if (type === "certificate") {

        modalKicker.textContent =
            "CERTIFICATES";

        modalTitle.textContent =
            "Add Certificate";

        modalBody.innerHTML = `

            <div class="modal-message">

                Certificate form will be connected
                to Firestore in the next step.

            </div>

        `;

    }


    else if (type === "course") {

        modalKicker.textContent =
            "COURSES";

        modalTitle.textContent =
            "Add Course";

        modalBody.innerHTML = `

            <div class="modal-message">

                Course form will be connected
                to Firestore in the next step.

            </div>

        `;

    }


    else if (type === "skill") {

        modalKicker.textContent =
            "SKILLS";

        modalTitle.textContent =
            "Add Skill";

        modalBody.innerHTML = `

            <div class="modal-message">

                Skill form will be connected
                to Firestore in the next step.

            </div>

        `;

    }


    else {

        modalKicker.textContent =
            "CONTENT";

        modalTitle.textContent =
            "Add Content";

        modalBody.innerHTML = `

            <div class="modal-message">

                Content form will be connected
                to Firestore in the next step.

            </div>

        `;

    }

}


function closeModal() {

    if (!modal) {
        return;
    }


    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   MODAL CLOSE EVENTS
   ========================================================= */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeModal
    );

}


if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeModal
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

            closeModal();

            closeSidebar();

        }

    }
);


/* =========================================================
   ADD BUTTONS
   ========================================================= */

const addProjectButton =
    document.getElementById(
        "addProjectButton"
    );


const addCertificateButton =
    document.getElementById(
        "addCertificateButton"
    );


const addCourseButton =
    document.getElementById(
        "addCourseButton"
    );


const addSkillButton =
    document.getElementById(
        "addSkillButton"
    );


if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        () => {

            openModal(
                "project"
            );

        }
    );

}


if (addCertificateButton) {

    addCertificateButton.addEventListener(
        "click",
        () => {

            openModal(
                "certificate"
            );

        }
    );

}


if (addCourseButton) {

    addCourseButton.addEventListener(
        "click",
        () => {

            openModal(
                "course"
            );

        }
    );

}


if (addSkillButton) {

    addSkillButton.addEventListener(
        "click",
        () => {

            openModal(
                "skill"
            );

        }
    );

}


/* =========================================================
   EMPTY STATE BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                if (
                    action ===
                    "add-project"
                ) {

                    openModal(
                        "project"
                    );

                }


                else if (
                    action ===
                    "add-certificate"
                ) {

                    openModal(
                        "certificate"
                    );

                }


                else if (
                    action ===
                    "add-course"
                ) {

                    openModal(
                        "course"
                    );

                }


                else if (
                    action ===
                    "add-skill"
                ) {

                    openModal(
                        "skill"
                    );

                }

            }
        );

    });


/* =========================================================
   FIREBASE AUTH CHECK
   ========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        /* -------------------------------------------------
           No user
           ------------------------------------------------- */

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        /* -------------------------------------------------
           User is not admin
           ------------------------------------------------- */

        if (
            user.uid !==
            ADMIN_UID
        ) {

            signOut(auth)
                .finally(() => {

                    window.location.href =
                        "login.html";

                });

            return;

        }


        /* -------------------------------------------------
           Authorized admin
           ------------------------------------------------- */

        console.log(
            "Admin authenticated successfully."
        );


        console.log(
            "Admin UID:",
            user.uid
        );

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

openSection(
    "dashboard"
);


/* =========================================================
   DEBUG MESSAGE
   ========================================================= */

console.log(
    "Ahmed Samir Portfolio Admin Dashboard loaded."
);