/* =========================================================
   Ahmed Samir Portfolio - Admin Dashboard
   Firebase Authentication Protected
   ========================================================= */

"use strict";


import {
    auth,
    onAuthStateChanged,
    signOut
} from "./firebase.js";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");

const navItems =
    document.querySelectorAll(".nav-item[data-section]");

const sections =
    document.querySelectorAll(".dashboard-section");

const quickActions =
    document.querySelectorAll(".quick-action[data-section]");

const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.querySelector(".sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const visitSiteButton =
    document.getElementById("visitSiteButton");

const logoutButton =
    document.getElementById("logoutButton");

const addProjectButton =
    document.getElementById("addProjectButton");

const emptyAddProjectButton =
    document.getElementById("emptyAddProjectButton");

const addCertificateButton =
    document.getElementById("addCertificateButton");

const emptyAddCertificateButton =
    document.getElementById("emptyAddCertificateButton");

const addSkillButton =
    document.getElementById("addSkillButton");

const emptyAddSkillButton =
    document.getElementById("emptyAddSkillButton");

const saveProfileButton =
    document.getElementById("saveProfileButton");


/* =========================================================
   SECTION DATA
   ========================================================= */

const sectionData = {

    dashboard: {

        title: "Dashboard",

        subtitle:
            "Overview of your portfolio website."

    },

    projects: {

        title: "Projects",

        subtitle:
            "Manage your portfolio projects."

    },

    certificates: {

        title: "Certificates",

        subtitle:
            "Manage your certificates and achievements."

    },

    skills: {

        title: "Skills",

        subtitle:
            "Manage your professional skills."

    },

    profile: {

        title: "Profile",

        subtitle:
            "Manage your personal portfolio information."

    }

};


/* =========================================================
   AUTHENTICATION
   ========================================================= */

let currentUser = null;


/*
    Firebase checks whether the user is already signed in.

    If there is no authenticated user:
    → redirect to login.html

    If the user is authenticated:
    → allow dashboard to continue
*/

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        currentUser = user;


        console.log(
            "Authenticated user:",
            currentUser.email
        );


        updateAdminInformation(
            currentUser
        );

    }
);


/* =========================================================
   UPDATE ADMIN INFORMATION
   ========================================================= */

function updateAdminInformation(user) {

    /*
        The current dashboard contains
        static admin information.

        We update the visible email
        when possible without changing
        the existing dashboard structure.
    */

    const adminEmailElements =
        document.querySelectorAll(
            "[data-admin-email]"
        );


    adminEmailElements.forEach(
        (element) => {

            element.textContent =
                user.email || "Administrator";

        }
    );

}


/* =========================================================
   SHOW SECTION
   ========================================================= */

function showSection(sectionName) {

    if (!sectionData[sectionName]) {

        sectionName = "dashboard";

    }


    sections.forEach(
        (section) => {

            section.classList.remove(
                "active"
            );

        }
    );


    const targetSection =
        document.getElementById(
            `${sectionName}Section`
        );


    if (targetSection) {

        targetSection.classList.add(
            "active"
        );

    }


    navItems.forEach(
        (item) => {

            item.classList.toggle(
                "active",
                item.dataset.section ===
                sectionName
            );

        }
    );


    const data =
        sectionData[sectionName];


    if (pageTitle) {

        pageTitle.textContent =
            data.title;

    }


    if (pageSubtitle) {

        pageSubtitle.textContent =
            data.subtitle;

    }


    /*
        Update URL hash.
    */

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


    closeMobileSidebar();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

navItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            (event) => {

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
   QUICK ACTIONS
   ========================================================= */

quickActions.forEach(
    (action) => {

        action.addEventListener(
            "click",
            () => {

                const sectionName =
                    action.dataset.section;


                showSection(
                    sectionName
                );

            }
        );

    }
);


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function openMobileSidebar() {

    if (sidebar) {

        sidebar.classList.add(
            "mobile-open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );

    }

}


function closeMobileSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );

    }

}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            if (
                sidebar &&
                sidebar.classList.contains(
                    "mobile-open"
                )
            ) {

                closeMobileSidebar();

            }

            else {

                openMobileSidebar();

            }

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeMobileSidebar();

        }

    }
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 850) {

            closeMobileSidebar();

        }

    }
);


/* =========================================================
   VISIT WEBSITE
   ========================================================= */

if (visitSiteButton) {

    visitSiteButton.addEventListener(
        "click",
        () => {

            window.open(
                "https://elbaled.github.io/AHMED-SAMIR-/",
                "_blank",
                "noopener,noreferrer"
            );

        }
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
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await signOut(auth);


                window.location.replace(
                    "login.html"
                );

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to sign out. Please try again."
                );

            }

        }
    );

}


/* =========================================================
   PROJECT BUTTONS
   ========================================================= */

function handleProjectButton() {

    showSection("projects");

    alert(
        "Project management will be connected to Firestore in the next step."
    );

}


if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        handleProjectButton
    );

}


if (emptyAddProjectButton) {

    emptyAddProjectButton.addEventListener(
        "click",
        handleProjectButton
    );

}


/* =========================================================
   CERTIFICATE BUTTONS
   ========================================================= */

function handleCertificateButton() {

    showSection("certificates");

    alert(
        "Certificate management will be connected to Firestore in the next step."
    );

}


if (addCertificateButton) {

    addCertificateButton.addEventListener(
        "click",
        handleCertificateButton
    );

}


if (emptyAddCertificateButton) {

    emptyAddCertificateButton.addEventListener(
        "click",
        handleCertificateButton
    );

}


/* =========================================================
   SKILL BUTTONS
   ========================================================= */

function handleSkillButton() {

    showSection("skills");

    alert(
        "Skill management will be connected to Firestore in the next step."
    );

}


if (addSkillButton) {

    addSkillButton.addEventListener(
        "click",
        handleSkillButton
    );

}


if (emptyAddSkillButton) {

    emptyAddSkillButton.addEventListener(
        "click",
        handleSkillButton
    );

}


/* =========================================================
   PROFILE
   ========================================================= */

if (saveProfileButton) {

    saveProfileButton.addEventListener(
        "click",
        () => {

            alert(
                "Profile saving will be connected to Firestore in the next step."
            );

        }
    );

}


/* =========================================================
   INITIAL SECTION
   ========================================================= */

function initializeSection() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();


    if (
        hash &&
        sectionData[hash]
    ) {

        showSection(hash);

    }

    else {

        showSection("dashboard");

    }

}


/* =========================================================
   HASH CHANGE
   ========================================================= */

window.addEventListener(
    "hashchange",
    () => {

        const sectionName =
            window.location.hash
                .replace("#", "")
                .trim();


        if (
            sectionName &&
            sectionData[sectionName]
        ) {

            showSection(
                sectionName
            );

        }

    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

initializeSection();