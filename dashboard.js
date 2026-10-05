/* =========================================================
   AHMED SAMIR PORTFOLIO
   ADMIN DASHBOARD
   Main Dashboard JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   01. DOM ELEMENTS
   ========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuButton =
    document.getElementById("menuButton");

const visitSiteButton =
    document.getElementById("visitSiteButton");

const logoutButton =
    document.getElementById("logoutButton");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");

const navItems =
    document.querySelectorAll(".nav-item");

const dashboardSections =
    document.querySelectorAll(".dashboard-section");

const quickActions =
    document.querySelectorAll(".quick-action");


/* =========================================================
   02. SECTION INFORMATION
   ========================================================= */

const sectionData = {

    dashboard: {

        title: "Dashboard",

        subtitle:
            "Welcome to your portfolio control panel."

    },

    projects: {

        title: "Projects",

        subtitle:
            "Add and manage your portfolio projects."

    },

    certificates: {

        title: "Certificates",

        subtitle:
            "Manage your certificates and training records."

    },

    skills: {

        title: "Skills",

        subtitle:
            "Manage your professional skills."

    },

    profile: {

        title: "Profile",

        subtitle:
            "Manage the information displayed on your portfolio."

    }

};


/* =========================================================
   03. CHANGE SECTION
   ========================================================= */

function showSection(sectionName) {

    if (!sectionName) {

        return;

    }


    const targetSection =
        document.getElementById(
            `${sectionName}Section`
        );


    if (!targetSection) {

        console.warn(
            `Section "${sectionName}" was not found.`
        );

        return;

    }


    /* -----------------------------------------
       Hide all sections
    ----------------------------------------- */

    dashboardSections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    /* -----------------------------------------
       Show selected section
    ----------------------------------------- */

    targetSection.classList.add(
        "active-section"
    );


    /* -----------------------------------------
       Update navigation
    ----------------------------------------- */

    navItems.forEach(
        item => {

            const itemSection =
                item.dataset.section;

            item.classList.toggle(
                "active",
                itemSection === sectionName
            );

        }
    );


    /* -----------------------------------------
       Update topbar
    ----------------------------------------- */

    if (sectionData[sectionName]) {

        pageTitle.textContent =
            sectionData[sectionName].title;

        pageSubtitle.textContent =
            sectionData[sectionName].subtitle;

    }


    /* -----------------------------------------
       Update URL hash
    ----------------------------------------- */

    if (
        window.location.hash !==
        `#${sectionName}`
    ) {

        history.replaceState(
            null,
            "",
            `#${sectionName}`
        );

    }


    /* -----------------------------------------
       Close mobile sidebar
    ----------------------------------------- */

    closeMobileSidebar();


    /* -----------------------------------------
       Scroll to top
    ----------------------------------------- */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   04. NAVIGATION CLICK EVENTS
   ========================================================= */

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const sectionName =
                    item.dataset.section;


                showSection(
                    sectionName
                );

            }
        );

    }
);


/* =========================================================
   05. QUICK ACTION BUTTONS
   ========================================================= */

quickActions.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const sectionName =
                    button.dataset.section;


                showSection(
                    sectionName
                );

            }
        );

    }
);


/* =========================================================
   06. MOBILE SIDEBAR
   ========================================================= */

function openMobileSidebar() {

    if (!sidebar) {

        return;

    }


    sidebar.classList.add(
        "mobile-open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );

    }


    document.body.style.overflow =
        "hidden";

}


function closeMobileSidebar() {

    if (!sidebar) {

        return;

    }


    sidebar.classList.remove(
        "mobile-open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   07. MENU BUTTON
   ========================================================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                sidebar.classList.contains(
                    "mobile-open"
                );


            if (isOpen) {

                closeMobileSidebar();

            } else {

                openMobileSidebar();

            }

        }
    );

}


/* =========================================================
   08. SIDEBAR OVERLAY
   ========================================================= */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        () => {

            closeMobileSidebar();

        }
    );

}


/* =========================================================
   09. ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMobileSidebar();

        }

    }
);


/* =========================================================
   10. VISIT WEBSITE
   ========================================================= */

if (visitSiteButton) {

    visitSiteButton.addEventListener(
        "click",
        () => {

            /*
             * Replace this URL later if the
             * portfolio URL changes.
             */

            const portfolioURL =
                "https://elbaled.github.io/AHMED-SAMIR-/";


            window.open(
                portfolioURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =========================================================
   11. LOGOUT
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            /*
             * Firebase logout will be added
             * in the Firebase integration step.
             */

            const shouldLogout =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!shouldLogout) {

                return;

            }


            /*
             * Temporary logout behavior.
             *
             * Firebase authentication will replace
             * this behavior later.
             */

            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   12. ADD PROJECT BUTTONS
   ========================================================= */

const addProjectButton =
    document.getElementById(
        "addProjectButton"
    );

const emptyAddProjectButton =
    document.getElementById(
        "emptyAddProjectButton"
    );


function openProjectManager() {

    showSection(
        "projects"
    );


    /*
     * The project modal/form will be added
     * during the Firebase + Cloudinary step.
     */

    console.log(
        "Project manager will be connected to Firebase and Cloudinary."
    );

}


if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        openProjectManager
    );

}


if (emptyAddProjectButton) {

    emptyAddProjectButton.addEventListener(
        "click",
        openProjectManager
    );

}


/* =========================================================
   13. ADD CERTIFICATE BUTTONS
   ========================================================= */

const addCertificateButton =
    document.getElementById(
        "addCertificateButton"
    );

const emptyAddCertificateButton =
    document.getElementById(
        "emptyAddCertificateButton"
    );


function openCertificateManager() {

    showSection(
        "certificates"
    );


    /*
     * Certificate form will be added
     * later with Firebase.
     */

    console.log(
        "Certificate manager will be connected to Firebase."
    );

}


if (addCertificateButton) {

    addCertificateButton.addEventListener(
        "click",
        openCertificateManager
    );

}


if (emptyAddCertificateButton) {

    emptyAddCertificateButton.addEventListener(
        "click",
        openCertificateManager
    );

}


/* =========================================================
   14. ADD SKILL BUTTONS
   ========================================================= */

const addSkillButton =
    document.getElementById(
        "addSkillButton"
    );

const emptyAddSkillButton =
    document.getElementById(
        "emptyAddSkillButton"
    );


function openSkillManager() {

    showSection(
        "skills"
    );


    /*
     * Skill form will be added later.
     */

    console.log(
        "Skill manager will be connected to Firebase."
    );

}


if (addSkillButton) {

    addSkillButton.addEventListener(
        "click",
        openSkillManager
    );

}


if (emptyAddSkillButton) {

    emptyAddSkillButton.addEventListener(
        "click",
        openSkillManager
    );

}


/* =========================================================
   15. PROFILE
   ========================================================= */

const saveProfileButton =
    document.getElementById(
        "saveProfileButton"
    );


if (saveProfileButton) {

    saveProfileButton.addEventListener(
        "click",
        () => {

            /*
             * Firebase profile saving will be
             * implemented later.
             */

            console.log(
                "Profile saving will be connected to Firebase."
            );


            alert(
                "Profile saving will be available after Firebase is connected."
            );

        }
    );

}


/* =========================================================
   16. LOAD SECTION FROM URL
   ========================================================= */

function loadInitialSection() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();


    if (
        hash &&
        sectionData[hash]
    ) {

        showSection(
            hash
        );

        return;

    }


    showSection(
        "dashboard"
    );

}


/* =========================================================
   17. HANDLE BROWSER HISTORY
   ========================================================= */

window.addEventListener(
    "popstate",
    () => {

        const hash =
            window.location.hash
                .replace("#", "")
                .trim();


        if (
            hash &&
            sectionData[hash]
        ) {

            showSection(
                hash
            );

        } else {

            showSection(
                "dashboard"
            );

        }

    }
);


/* =========================================================
   18. RESPONSIVE SIDEBAR
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 850
        ) {

            closeMobileSidebar();

        }

    }
);


/* =========================================================
   19. INITIALIZE DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadInitialSection();

        console.log(
            "Ahmed Samir Portfolio Dashboard initialized."
        );

    }
);