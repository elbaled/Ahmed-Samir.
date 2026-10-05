/* =========================================================
   Ahmed Samir Portfolio - Admin Dashboard
   Firebase + Firestore
   ========================================================= */

"use strict";

alert("dashboard.js اشتغل");
/* =========================================================
   FIREBASE
   ========================================================= */

import {
    auth,
    db,
    onAuthStateChanged,
    signOut
} from "./firebase.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


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


/* =========================================================
   PROJECT ELEMENTS
   ========================================================= */

const addProjectButton =
    document.getElementById("addProjectButton");

const emptyAddProjectButton =
    document.getElementById("emptyAddProjectButton");

const projectsContainer =
    document.getElementById("projectsContainer");


/* =========================================================
   CERTIFICATE ELEMENTS
   ========================================================= */

const addCertificateButton =
    document.getElementById("addCertificateButton");

const emptyAddCertificateButton =
    document.getElementById(
        "emptyAddCertificateButton"
    );

const certificatesContainer =
    document.getElementById(
        "certificatesContainer"
    );


/* =========================================================
   SKILL ELEMENTS
   ========================================================= */

const addSkillButton =
    document.getElementById("addSkillButton");

const emptyAddSkillButton =
    document.getElementById(
        "emptyAddSkillButton"
    );

const skillsContainer =
    document.getElementById(
        "skillsContainer"
    );


/* =========================================================
   PROFILE ELEMENTS
   ========================================================= */

const profileName =
    document.getElementById("profileName");

const profileTitle =
    document.getElementById("profileTitle");

const profileBio =
    document.getElementById("profileBio");

const saveProfileButton =
    document.getElementById(
        "saveProfileButton"
    );


/* =========================================================
   STATISTICS
   ========================================================= */

const projectsCount =
    document.getElementById(
        "projectsCount"
    );

const certificatesCount =
    document.getElementById(
        "certificatesCount"
    );

const skillsCount =
    document.getElementById(
        "skillsCount"
    );


/* =========================================================
   SECTION DATA
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
            "Manage your personal portfolio information."

    }

};


/* =========================================================
   AUTHENTICATION
   ========================================================= */

let currentUser = null;

let authReady = false;


onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        currentUser = user;

        authReady = true;


        console.log(
            "Authenticated user:",
            currentUser.email
        );


        await loadAllData();

    }
);


/* =========================================================
   ADMIN INFORMATION
   ========================================================= */

function updateAdminInformation(user) {

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
   SECTION NAVIGATION
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

            section.classList.remove(
                "active-section"
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
   NAVIGATION EVENTS
   ========================================================= */

navItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showSection(
                    item.dataset.section
                );

            }
        );

    }
);


quickActions.forEach(
    (action) => {

        action.addEventListener(
            "click",
            () => {

                showSection(
                    action.dataset.section
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


document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeMobileSidebar();

        }

    }
);


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
   PROJECTS
   ========================================================= */

async function addProject() {

    if (!authReady) {

        alert(
            "Please wait until the dashboard is fully loaded."
        );

        return;

    }


    const name =
        prompt(
            "Project name:"
        );


    if (!name || !name.trim()) {

        return;

    }


    const description =
        prompt(
            "Project description:"
        );


    const link =
        prompt(
            "Project link (optional):"
        );


    try {

        await addDoc(
            collection(
                db,
                "projects"
            ),
            {

                name:
                    name.trim(),

                description:
                    description
                        ? description.trim()
                        : "",

                link:
                    link
                        ? link.trim()
                        : "",

                createdBy:
                    currentUser.uid,

                createdAt:
                    serverTimestamp()

            }
        );


        alert(
            "Project added successfully."
        );


        await loadProjects();

    }

    catch (error) {

        console.error(
            "Add project error:",
            error
        );


        alert(
            "Failed to add project. Check your Firestore permissions."
        );

    }

}


if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        addProject
    );

}


if (emptyAddProjectButton) {

    emptyAddProjectButton.addEventListener(
        "click",
        addProject
    );

}


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "projects"
                )
            );


        if (projectsCount) {

            projectsCount.textContent =
                snapshot.size;

        }


        if (
            !projectsContainer
        ) {

            return;

        }


        if (snapshot.empty) {

            projectsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📁
                    </div>

                    <h3>
                        No Projects Yet
                    </h3>

                    <p>
                        Your projects will appear here.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        id="emptyAddProjectButton"
                    >
                        Add Your First Project
                    </button>

                </div>

            `;


            const button =
                document.getElementById(
                    "emptyAddProjectButton"
                );


            if (button) {

                button.addEventListener(
                    "click",
                    addProject
                );

            }


            return;

        }


        projectsContainer.innerHTML = "";


        snapshot.forEach(
            (item) => {

                const data =
                    item.data();


                const card =
                    createProjectCard(
                        item.id,
                        data
                    );


                projectsContainer.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Load projects error:",
            error
        );

    }

}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(
    id,
    data
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "dashboard-card";


    const safeName =
        data.name || "Untitled Project";


    const safeDescription =
        data.description ||
        "No description added.";


    card.innerHTML = `

        <div class="card-header">

            <div>

                <span class="section-label">
                    PROJECT
                </span>

                <h3>
                    ${escapeHTML(safeName)}
                </h3>

            </div>

        </div>


        <p
            style="
                color: #94a3b8;
                line-height: 1.7;
                margin-bottom: 18px;
            "
        >
            ${escapeHTML(safeDescription)}
        </p>


        <div
            style="
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            "
        >

            ${
                data.link
                    ? `
                        <a
                            href="${escapeAttribute(data.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="primary-button"
                        >
                            View Project
                        </a>
                    `
                    : ""
            }


            <button
                type="button"
                class="secondary-button"
                data-edit-project="${id}"
            >
                Edit
            </button>


            <button
                type="button"
                class="danger-button"
                data-delete-project="${id}"
            >
                Delete
            </button>

        </div>

    `;


    const editButton =
        card.querySelector(
            "[data-edit-project]"
        );


    const deleteButton =
        card.querySelector(
            "[data-delete-project]"
        );


    editButton.addEventListener(
        "click",
        () => editProject(
            id,
            data
        )
    );


    deleteButton.addEventListener(
        "click",
        () => deleteProject(
            id
        )
    );


    return card;

}


/* =========================================================
   EDIT PROJECT
   ========================================================= */

async function editProject(
    id,
    oldData
) {

    const name =
        prompt(
            "Project name:",
            oldData.name || ""
        );


    if (!name || !name.trim()) {

        return;

    }


    const description =
        prompt(
            "Project description:",
            oldData.description || ""
        );


    const link =
        prompt(
            "Project link:",
            oldData.link || ""
        );


    try {

        await updateDoc(
            doc(
                db,
                "projects",
                id
            ),
            {

                name:
                    name.trim(),

                description:
                    description
                        ? description.trim()
                        : "",

                link:
                    link
                        ? link.trim()
                        : "",

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "Project updated successfully."
        );


        await loadProjects();

    }

    catch (error) {

        console.error(
            "Edit project error:",
            error
        );


        alert(
            "Failed to update project."
        );

    }

}


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(id) {

    const confirmed =
        confirm(
            "Delete this project?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "projects",
                id
            )
        );


        await loadProjects();

    }

    catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        alert(
            "Failed to delete project."
        );

    }

}


/* =========================================================
   CERTIFICATES
   ========================================================= */

async function addCertificate() {

    const name =
        prompt(
            "Certificate name:"
        );


    if (!name || !name.trim()) {

        return;

    }


    const issuer =
        prompt(
            "Issuing organization:"
        );


    const year =
        prompt(
            "Year:"
        );


    const link =
        prompt(
            "Certificate link (optional):"
        );


    try {

        await addDoc(
            collection(
                db,
                "certificates"
            ),
            {

                name:
                    name.trim(),

                issuer:
                    issuer
                        ? issuer.trim()
                        : "",

                year:
                    year
                        ? year.trim()
                        : "",

                link:
                    link
                        ? link.trim()
                        : "",

                createdBy:
                    currentUser.uid,

                createdAt:
                    serverTimestamp()

            }
        );


        alert(
            "Certificate added successfully."
        );


        await loadCertificates();

    }

    catch (error) {

        console.error(
            "Add certificate error:",
            error
        );


        alert(
            "Failed to add certificate. Check Firestore permissions."
        );

    }

}


if (addCertificateButton) {

    addCertificateButton.addEventListener(
        "click",
        addCertificate
    );

}


if (emptyAddCertificateButton) {

    emptyAddCertificateButton.addEventListener(
        "click",
        addCertificate
    );

}


/* =========================================================
   LOAD CERTIFICATES
   ========================================================= */

async function loadCertificates() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "certificates"
                )
            );


        if (certificatesCount) {

            certificatesCount.textContent =
                snapshot.size;

        }


        if (!certificatesContainer) {

            return;

        }


        if (snapshot.empty) {

            certificatesContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🏆
                    </div>

                    <h3>
                        No Certificates Yet
                    </h3>

                    <p>
                        Your certificates will appear here.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        id="emptyAddCertificateButton"
                    >
                        Add Your First Certificate
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "emptyAddCertificateButton"
                )
                ?.addEventListener(
                    "click",
                    addCertificate
                );


            return;

        }


        certificatesContainer.innerHTML = "";


        snapshot.forEach(
            (item) => {

                const data =
                    item.data();


                const card =
                    createCertificateCard(
                        item.id,
                        data
                    );


                certificatesContainer.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Load certificates error:",
            error
        );

    }

}


/* =========================================================
   CREATE CERTIFICATE CARD
   ========================================================= */

function createCertificateCard(
    id,
    data
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "dashboard-card";


    card.innerHTML = `

        <div class="card-header">

            <div>

                <span class="section-label">
                    CERTIFICATE
                </span>

                <h3>
                    ${escapeHTML(
                        data.name ||
                        "Untitled Certificate"
                    )}
                </h3>

            </div>

        </div>


        <p
            style="
                color: #94a3b8;
                margin-bottom: 8px;
            "
        >
            ${
                escapeHTML(
                    data.issuer ||
                    "Issuing organization not specified"
                )
            }
        </p>


        <p
            style="
                color: #64748b;
                margin-bottom: 18px;
            "
        >
            ${
                escapeHTML(
                    data.year ||
                    ""
                )
            }
        </p>


        <div
            style="
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            "
        >

            ${
                data.link
                    ? `
                        <a
                            href="${escapeAttribute(data.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="primary-button"
                        >
                            View Certificate
                        </a>
                    `
                    : ""
            }


            <button
                type="button"
                class="secondary-button"
                data-edit-certificate="${id}"
            >
                Edit
            </button>


            <button
                type="button"
                class="danger-button"
                data-delete-certificate="${id}"
            >
                Delete
            </button>

        </div>

    `;


    card
        .querySelector(
            "[data-edit-certificate]"
        )
        .addEventListener(
            "click",
            () => editCertificate(
                id,
                data
            )
        );


    card
        .querySelector(
            "[data-delete-certificate]"
        )
        .addEventListener(
            "click",
            () => deleteCertificate(
                id
            )
        );


    return card;

}


/* =========================================================
   EDIT CERTIFICATE
   ========================================================= */

async function editCertificate(
    id,
    oldData
) {

    const name =
        prompt(
            "Certificate name:",
            oldData.name || ""
        );


    if (!name || !name.trim()) {

        return;

    }


    const issuer =
        prompt(
            "Issuing organization:",
            oldData.issuer || ""
        );


    const year =
        prompt(
            "Year:",
            oldData.year || ""
        );


    const link =
        prompt(
            "Certificate link:",
            oldData.link || ""
        );


    try {

        await updateDoc(
            doc(
                db,
                "certificates",
                id
            ),
            {

                name:
                    name.trim(),

                issuer:
                    issuer
                        ? issuer.trim()
                        : "",

                year:
                    year
                        ? year.trim()
                        : "",

                link:
                    link
                        ? link.trim()
                        : "",

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "Certificate updated successfully."
        );


        await loadCertificates();

    }

    catch (error) {

        console.error(
            "Edit certificate error:",
            error
        );


        alert(
            "Failed to update certificate."
        );

    }

}


/* =========================================================
   DELETE CERTIFICATE
   ========================================================= */

async function deleteCertificate(id) {

    const confirmed =
        confirm(
            "Delete this certificate?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "certificates",
                id
            )
        );


        await loadCertificates();

    }

    catch (error) {

        console.error(
            "Delete certificate error:",
            error
        );


        alert(
            "Failed to delete certificate."
        );

    }

}


/* =========================================================
   SKILLS
   ========================================================= */

async function addSkill() {

    const name =
        prompt(
            "Skill name:"
        );


    if (!name || !name.trim()) {

        return;

    }


    const level =
        prompt(
            "Skill level (e.g. Beginner, Intermediate, Advanced):"
        );


    try {

        await addDoc(
            collection(
                db,
                "skills"
            ),
            {

                name:
                    name.trim(),

                level:
                    level
                        ? level.trim()
                        : "",

                createdBy:
                    currentUser.uid,

                createdAt:
                    serverTimestamp()

            }
        );


        alert(
            "Skill added successfully."
        );


        await loadSkills();

    }

    catch (error) {

        console.error(
            "Add skill error:",
            error
        );


        alert(
            "Failed to add skill. Check Firestore permissions."
        );

    }

}


if (addSkillButton) {

    addSkillButton.addEventListener(
        "click",
        addSkill
    );

}


if (emptyAddSkillButton) {

    emptyAddSkillButton.addEventListener(
        "click",
        addSkill
    );

}


/* =========================================================
   LOAD SKILLS
   ========================================================= */

async function loadSkills() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "skills"
                )
            );


        if (skillsCount) {

            skillsCount.textContent =
                snapshot.size;

        }


        if (!skillsContainer) {

            return;

        }


        if (snapshot.empty) {

            skillsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ⚙
                    </div>

                    <h3>
                        No Skills Yet
                    </h3>

                    <p>
                        Your skills will appear here.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        id="emptyAddSkillButton"
                    >
                        Add Your First Skill
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "emptyAddSkillButton"
                )
                ?.addEventListener(
                    "click",
                    addSkill
                );


            return;

        }


        skillsContainer.innerHTML = "";


        snapshot.forEach(
            (item) => {

                const data =
                    item.data();


                const card =
                    createSkillCard(
                        item.id,
                        data
                    );


                skillsContainer.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Load skills error:",
            error
        );

    }

}


/* =========================================================
   CREATE SKILL CARD
   ========================================================= */

function createSkillCard(
    id,
    data
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "dashboard-card";


    card.innerHTML = `

        <div class="card-header">

            <div>

                <span class="section-label">
                    SKILL
                </span>

                <h3>
                    ${escapeHTML(
                        data.name ||
                        "Unnamed Skill"
                    )}
                </h3>

            </div>

        </div>


        <p
            style="
                color: #94a3b8;
                margin-bottom: 18px;
            "
        >
            Level:
            ${
                escapeHTML(
                    data.level ||
                    "Not specified"
                )
            }
        </p>


        <div
            style="
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            "
        >

            <button
                type="button"
                class="secondary-button"
                data-edit-skill="${id}"
            >
                Edit
            </button>


            <button
                type="button"
                class="danger-button"
                data-delete-skill="${id}"
            >
                Delete
            </button>

        </div>

    `;


    card
        .querySelector(
            "[data-edit-skill]"
        )
        .addEventListener(
            "click",
            () => editSkill(
                id,
                data
            )
        );


    card
        .querySelector(
            "[data-delete-skill]"
        )
        .addEventListener(
            "click",
            () => deleteSkill(
                id
            )
        );


    return card;

}


/* =========================================================
   EDIT SKILL
   ========================================================= */

async function editSkill(
    id,
    oldData
) {

    const name =
        prompt(
            "Skill name:",
            oldData.name || ""
        );


    if (!name || !name.trim()) {

        return;

    }


    const level =
        prompt(
            "Skill level:",
            oldData.level || ""
        );


    try {

        await updateDoc(
            doc(
                db,
                "skills",
                id
            ),
            {

                name:
                    name.trim(),

                level:
                    level
                        ? level.trim()
                        : "",

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "Skill updated successfully."
        );


        await loadSkills();

    }

    catch (error) {

        console.error(
            "Edit skill error:",
            error
        );


        alert(
            "Failed to update skill."
        );

    }

}


/* =========================================================
   DELETE SKILL
   ========================================================= */

async function deleteSkill(id) {

    const confirmed =
        confirm(
            "Delete this skill?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "skills",
                id
            )
        );


        await loadSkills();

    }

    catch (error) {

        console.error(
            "Delete skill error:",
            error
        );

    }

}


/* =========================================================
   PROFILE
   ========================================================= */

async function loadProfile() {

    try {

        const profileReference =
            doc(
                db,
                "profile",
                "main"
            );


        const profileSnapshot =
            await getDoc(
                profileReference
            );


        if (!profileSnapshot.exists()) {

            return;

        }


        const data =
            profileSnapshot.data();


        if (profileName) {

            profileName.value =
                data.name || "";

        }


        if (profileTitle) {

            profileTitle.value =
                data.title || "";

        }


        if (profileBio) {

            profileBio.value =
                data.bio || "";

        }

    }

    catch (error) {

        console.error(
            "Load profile error:",
            error
        );

    }

}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

if (saveProfileButton) {

    saveProfileButton.addEventListener(
        "click",
        saveProfile
    );

}


async function saveProfile() {

    if (!currentUser) {

        alert(
            "You are not authenticated."
        );

        return;

    }


    const name =
        profileName.value.trim();

    const title =
        profileTitle.value.trim();

    const bio =
        profileBio.value.trim();


    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    try {

        await setDoc(
            doc(
                db,
                "profile",
                "main"
            ),
            {

                name,

                title,

                bio,

                updatedBy:
                    currentUser.uid,

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "Profile saved successfully."
        );

    }

    catch (error) {

        console.error(
            "Save profile error:",
            error
        );


        alert(
            "Failed to save profile."
        );

    }

}


/* =========================================================
   LOAD ALL DATA
   ========================================================= */

async function loadAllData() {

    updateAdminInformation(
        currentUser
    );


    await Promise.all([
        loadProjects(),
        loadCertificates(),
        loadSkills(),
        loadProfile()
    ]);

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return String(value)
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIAL SECTION
   ========================================================= */

function initializeSection() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .trim();


    if (
        hash &&
        sectionData[hash]
    ) {

        showSection(hash);

    }

    else {

        showSection(
            "dashboard"
        );

    }

}


window.addEventListener(
    "hashchange",
    () => {

        const sectionName =
            window.location.hash
                .replace(
                    "#",
                    ""
                )
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
   START
   ========================================================= */

initializeSection();