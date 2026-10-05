/* =========================================================
   Ahmed Samir Portfolio
   Admin Dashboard - Full Firestore CRUD
   ========================================================= */

"use strict";


/* =========================================================
   FIREBASE
   ========================================================= */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   CONFIG
   ========================================================= */

const ADMIN_UID = "Sszp0JmpjcQhpsg78kqh5VS8row1";

const PROJECTS_COLLECTION = "projects";

const CERTIFICATES_COLLECTION = "certificates";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuButton =
    document.getElementById("menuButton");

const pageTitle =
    document.getElementById("pageTitle");

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

const projectsContainer =
    document.getElementById("projectsContainer");

const certificatesContainer =
    document.getElementById("certificatesContainer");

const coursesContainer =
    document.getElementById("coursesContainer");

const skillsContainer =
    document.getElementById("skillsContainer");

const projectsCount =
    document.getElementById("projectsCount");

const certificatesCount =
    document.getElementById("certificatesCount");

const coursesCount =
    document.getElementById("coursesCount");

const skillsCount =
    document.getElementById("skillsCount");

const addProjectButton =
    document.getElementById("addProjectButton");

const addCertificateButton =
    document.getElementById("addCertificateButton");

const addCourseButton =
    document.getElementById("addCourseButton");

const addSkillButton =
    document.getElementById("addSkillButton");

const viewWebsiteButton =
    document.getElementById("viewWebsiteButton");

const headerWebsiteButton =
    document.getElementById("headerWebsiteButton");

const logoutButton =
    document.getElementById("logoutButton");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   STATE
   ========================================================= */

let currentAdminUser = null;

let isSavingProject = false;

let isSavingCertificate = false;


/* =========================================================
   SECTION TITLES
   ========================================================= */

const SECTION_TITLES = {

    dashboard:
        "Dashboard",

    projects:
        "Projects",

    certificates:
        "Certificates",

    courses:
        "Courses",

    skills:
        "Skills"

};


/* =========================================================
   UTILITY
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
   FIREBASE ERROR MESSAGE
   ========================================================= */

function getFirebaseErrorMessage(error) {

    if (!error) {
        return "حدث خطأ غير معروف.";
    }

    console.error(
        "Firebase Error:",
        error
    );

    const code =
        error.code || "";

    switch (code) {

        case "permission-denied":

            return "ليس لديك صلاحية لتنفيذ هذه العملية على Firestore.";

        case "unauthenticated":

            return "يجب تسجيل الدخول أولًا.";

        case "failed-precondition":

            return "Firebase يحتاج إلى إعداد إضافي قبل تنفيذ العملية.";

        case "unavailable":

            return "Firebase غير متاح حاليًا. تحقق من الإنترنت وحاول مرة أخرى.";

        case "not-found":

            return "البيانات المطلوبة غير موجودة.";

        case "already-exists":

            return "البيانات موجودة بالفعل.";

        default:

            return (
                error.message ||
                "حدث خطأ أثناء الاتصال بـ Firebase."
            );
    }
}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

function checkAdmin() {

    const user =
        auth.currentUser;

    if (!user) {

        alert(
            "يجب تسجيل الدخول كمسؤول أولًا."
        );

        return false;
    }

    if (user.uid !== ADMIN_UID) {

        alert(
            "هذا الحساب غير مصرح له باستخدام لوحة الإدارة."
        );

        return false;
    }

    currentAdminUser = user;

    return true;
}


/* =========================================================
   SIDEBAR
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
   SHOW SECTION
   ========================================================= */

async function showSection(sectionName) {

    const sections =
        document.querySelectorAll(
            ".content-section"
        );

    const navItems =
        document.querySelectorAll(
            ".nav-item[data-section]"
        );

    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );

    navItems.forEach(
        item => {

            item.classList.remove(
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

    const activeNav =
        document.querySelector(
            `.nav-item[data-section="${sectionName}"]`
        );

    if (activeNav) {

        activeNav.classList.add(
            "active"
        );

    }

    if (pageTitle) {

        pageTitle.textContent =
            SECTION_TITLES[sectionName] ||
            sectionName;

    }

    closeSidebar();

    if (
        sectionName === "projects"
    ) {

        await loadProjects();

    }

    if (
        sectionName === "certificates"
    ) {

        await loadCertificates();

    }

    if (
        sectionName === "dashboard"
    ) {

        await updateDashboardStats();

    }
}


/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

document.addEventListener(
    "click",
    async event => {

        const navItem =
            event.target.closest(
                ".nav-item[data-section]"
            );

        if (!navItem) {
            return;
        }

        const section =
            navItem.dataset.section;

        if (!section) {
            return;
        }

        await showSection(
            section
        );
    }
);


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

document.addEventListener(
    "click",
    async event => {

        const actionButton =
            event.target.closest(
                "[data-action]"
            );

        if (!actionButton) {
            return;
        }

        const action =
            actionButton.dataset.action;

        if (
            action === "add-project"
        ) {

            await openAddProjectModal();

            return;
        }

        if (
            action === "add-certificate"
        ) {

            await openAddCertificateModal();

            return;
        }

        if (
            action === "add-course"
        ) {

            await openAddCourseModal();

            return;
        }

        if (
            action === "add-skill"
        ) {

            await openAddSkillModal();

            return;
        }
    }
);


/* =========================================================
   QUICK ACTION SECTION BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".quick-action"
            );

        if (!button) {
            return;
        }

        const section =
            button.dataset.section;

        if (
            section === "projects"
        ) {

            await showSection(
                "projects"
            );

            await openAddProjectModal();

            return;
        }

        if (
            section === "certificates"
        ) {

            await showSection(
                "certificates"
            );

            await openAddCertificateModal();

            return;
        }

        if (
            section === "courses"
        ) {

            await showSection(
                "courses"
            );

            await openAddCourseModal();

            return;
        }
    }
);


/* =========================================================
   ADD BUTTONS
   ========================================================= */

if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        async () => {

            await openAddProjectModal();

        }
    );
}


if (addCertificateButton) {

    addCertificateButton.addEventListener(
        "click",
        async () => {

            await openAddCertificateModal();

        }
    );
}


if (addCourseButton) {

    addCourseButton.addEventListener(
        "click",
        async () => {

            await openAddCourseModal();

        }
    );
}


if (addSkillButton) {

    addSkillButton.addEventListener(
        "click",
        async () => {

            await openAddSkillModal();

        }
    );
}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(
    title,
    content,
    kicker = "CONTENT"
) {

    if (!modal) {

        alert(
            "عنصر الـ Modal غير موجود في admin.html."
        );

        return;
    }

    if (modalTitle) {

        modalTitle.textContent =
            title;

    }

    if (modalKicker) {

        modalKicker.textContent =
            kicker;

    }

    if (modalBody) {

        modalBody.innerHTML =
            content;

    }

    modal.classList.add(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    isSavingProject =
        false;

    isSavingCertificate =
        false;
}


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


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains(
                "open"
            )
        ) {

            closeModal();

        }
    }
);


/* =========================================================
   PROJECT FORM HTML
   ========================================================= */

function getProjectFormHTML(
    project = null
) {

    const isEdit =
        Boolean(project);

    const projectId =
        project?.id || "";

    const title =
        project?.title || "";

    const category =
        project?.category || "gis";

    const status =
        project?.status || "Completed";

    const description =
        project?.description || "";

    const tools =
        project?.tools || "";

    const imageUrl =
        project?.imageUrl || "";

    const projectLink =
        project?.projectLink || "";

    return `

        <form
            id="projectForm"
            class="admin-form"
            novalidate
        >

            <input
                type="hidden"
                id="projectId"
                value="${escapeHTML(projectId)}"
            >


            <div class="form-group">

                <label for="projectTitle">
                    Project Title
                </label>

                <input
                    type="text"
                    id="projectTitle"
                    placeholder="مثال: GIS Urban Analysis"
                    value="${escapeHTML(title)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="projectCategory">
                    Category
                </label>

                <select id="projectCategory">

                    <option
                        value="gis"
                        ${category === "gis" ? "selected" : ""}
                    >
                        GIS
                    </option>

                    <option
                        value="surveying"
                        ${category === "surveying" ? "selected" : ""}
                    >
                        Surveying
                    </option>

                    <option
                        value="remote-sensing"
                        ${category === "remote-sensing" ? "selected" : ""}
                    >
                        Remote Sensing
                    </option>

                    <option
                        value="civil3d"
                        ${category === "civil3d" ? "selected" : ""}
                    >
                        Civil 3D
                    </option>

                    <option
                        value="programming"
                        ${category === "programming" ? "selected" : ""}
                    >
                        Programming
                    </option>

                    <option
                        value="other"
                        ${category === "other" ? "selected" : ""}
                    >
                        Other
                    </option>

                </select>

            </div>


            <div class="form-group">

                <label for="projectStatus">
                    Status
                </label>

                <select id="projectStatus">

                    <option
                        value="Completed"
                        ${status === "Completed" ? "selected" : ""}
                    >
                        Completed
                    </option>

                    <option
                        value="In Progress"
                        ${status === "In Progress" ? "selected" : ""}
                    >
                        In Progress
                    </option>

                    <option
                        value="Planned"
                        ${status === "Planned" ? "selected" : ""}
                    >
                        Planned
                    </option>

                </select>

            </div>


            <div class="form-group">

                <label for="projectDescription">
                    Description
                </label>

                <textarea
                    id="projectDescription"
                    placeholder="اكتب وصف المشروع..."
                >${escapeHTML(description)}</textarea>

            </div>


            <div class="form-group">

                <label for="projectTools">
                    Tools
                </label>

                <input
                    type="text"
                    id="projectTools"
                    placeholder="ArcGIS Pro, AutoCAD, Python..."
                    value="${escapeHTML(tools)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="projectImageUrl">
                    Image URL
                </label>

                <input
                    type="text"
                    id="projectImageUrl"
                    placeholder="https://..."
                    value="${escapeHTML(imageUrl)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="projectLink">
                    Project Link
                </label>

                <input
                    type="text"
                    id="projectLink"
                    placeholder="https://..."
                    value="${escapeHTML(projectLink)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="btn-secondary"
                    id="cancelProjectBtn"
                >
                    إلغاء
                </button>


                <button
                    type="submit"
                    class="btn-primary"
                    id="saveProjectBtn"
                >
                    ${
                        isEdit
                            ? "حفظ التعديلات"
                            : "إضافة المشروع"
                    }
                </button>

            </div>

        </form>

    `;
}


/* =========================================================
   OPEN ADD PROJECT
   ========================================================= */

async function openAddProjectModal() {

    if (!checkAdmin()) {
        return;
    }

    openModal(
        "Add Project",
        getProjectFormHTML(),
        "PROJECT"
    );

    const form =
        document.getElementById(
            "projectForm"
        );

    if (!form) {
        return;
    }

    const titleInput =
        document.getElementById(
            "projectTitle"
        );

    if (titleInput) {

        setTimeout(
            () => titleInput.focus(),
            50
        );
    }

    form.addEventListener(
        "submit",
        handleProjectSubmit
    );

    const cancelButton =
        document.getElementById(
            "cancelProjectBtn"
        );

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );
    }
}


/* =========================================================
   PROJECT SUBMIT
   ========================================================= */

async function handleProjectSubmit(
    event
) {

    event.preventDefault();

    event.stopPropagation();

    if (isSavingProject) {
        return;
    }

    isSavingProject = true;

    const button =
        document.getElementById(
            "saveProjectBtn"
        );

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "جاري الحفظ...";

    }

    try {

        await saveProject();

    } finally {

        isSavingProject =
            false;

        if (button) {

            button.disabled =
                false;

            const projectId =
                document.getElementById(
                    "projectId"
                )?.value;

            button.textContent =
                projectId
                    ? "حفظ التعديلات"
                    : "إضافة المشروع";
        }
    }
}


/* =========================================================
   SAVE PROJECT
   ========================================================= */

async function saveProject() {

    if (!checkAdmin()) {
        return;
    }

    const projectId =
        document.getElementById(
            "projectId"
        )?.value.trim();

    const title =
        document.getElementById(
            "projectTitle"
        )?.value.trim();

    const category =
        document.getElementById(
            "projectCategory"
        )?.value;

    const status =
        document.getElementById(
            "projectStatus"
        )?.value;

    const description =
        document.getElementById(
            "projectDescription"
        )?.value.trim();

    const tools =
        document.getElementById(
            "projectTools"
        )?.value.trim();

    const imageUrl =
        document.getElementById(
            "projectImageUrl"
        )?.value.trim();

    const projectLink =
        document.getElementById(
            "projectLink"
        )?.value.trim();


    /* =====================================================
       VALIDATION
       ===================================================== */

    if (!title) {

        alert(
            "من فضلك اكتب اسم المشروع."
        );

        document
            .getElementById("projectTitle")
            ?.focus();

        return;
    }


    if (!description) {

        alert(
            "من فضلك اكتب وصف المشروع."
        );

        document
            .getElementById("projectDescription")
            ?.focus();

        return;
    }


    if (!category) {

        alert(
            "من فضلك اختر تصنيف المشروع."
        );

        return;
    }


    /* =====================================================
       DATA
       ===================================================== */

    const projectData = {

        title:
            title,

        category:
            category || "gis",

        status:
            status || "Completed",

        description:
            description,

        tools:
            tools || "",

        imageUrl:
            imageUrl || "",

        imagePath:
            "",

        projectLink:
            projectLink || "",

        updatedAt:
            serverTimestamp()

    };


    try {

        if (projectId) {

            const projectRef =
                doc(
                    db,
                    PROJECTS_COLLECTION,
                    projectId
                );

            await updateDoc(
                projectRef,
                projectData
            );

            alert(
                "تم تعديل المشروع بنجاح ✅"
            );

        } else {

            projectData.createdAt =
                serverTimestamp();

            projectData.createdBy =
                currentAdminUser.uid;

            await addDoc(
                collection(
                    db,
                    PROJECTS_COLLECTION
                ),
                projectData
            );

            alert(
                "تم إضافة المشروع بنجاح ✅"
            );
        }


        closeModal();

        await loadProjects();

        await updateDashboardStats();


    } catch (error) {

        alert(
            getFirebaseErrorMessage(
                error
            )
        );

    }
}


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    if (!projectsContainer) {
        return;
    }

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            );

        const projects =
            snapshot.docs.map(
                item => ({
                    id: item.id,
                    ...item.data()
                })
            );


        projects.sort(
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


        if (projectsCount) {

            projectsCount.textContent =
                projects.length;
        }


        if (!projects.length) {

            projectsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🗂️
                    </div>

                    <h3>
                        No projects yet
                    </h3>

                    <p>
                        أضف أول مشروع إلى البورتفوليو.
                    </p>

                    <button
                        class="primary-button"
                        data-action="add-project"
                        type="button"
                    >
                        + Add Your First Project
                    </button>

                </div>

            `;

            return;
        }


        projectsContainer.className =
            "projects-grid";

        projectsContainer.innerHTML =
            projects
                .map(
                    createProjectCard
                )
                .join("");


    } catch (error) {

        console.error(
            "loadProjects error:",
            error
        );

        projectsContainer.className =
            "content-placeholder";

        projectsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Error Loading Projects
                </h3>

                <p>
                    ${escapeHTML(
                        getFirebaseErrorMessage(
                            error
                        )
                    )}
                </p>

                <button
                    class="primary-button"
                    id="retryProjectsButton"
                    type="button"
                >
                    إعادة المحاولة
                </button>

            </div>

        `;

        document
            .getElementById(
                "retryProjectsButton"
            )
            ?.addEventListener(
                "click",
                loadProjects
            );
    }
}


/* =========================================================
   PROJECT CARD
   ========================================================= */

function createProjectCard(
    project,
    index
) {

    const image =
        project.imageUrl ||
        "";

    const title =
        project.title ||
        "Untitled Project";

    const category =
        project.category ||
        "other";

    const status =
        project.status ||
        "Completed";

    const description =
        project.description ||
        "";

    const tools =
        project.tools ||
        "";

    const projectLink =
        project.projectLink ||
        "";


    const toolList =
        tools
            .split(",")
            .map(
                tool => tool.trim()
            )
            .filter(Boolean);


    const toolsHTML =
        toolList.length
            ? `
                <div class="project-tools">
                    ${toolList
                        .map(
                            tool => `
                                <span>
                                    ${escapeHTML(tool)}
                                </span>
                            `
                        )
                        .join("")}
                </div>
            `
            : "";


    const imageHTML =
        image
            ? `
                <div
                    style="
                        width:100%;
                        height:170px;
                        margin-bottom:15px;
                        overflow:hidden;
                        border-radius:11px;
                        background:#081525;
                    "
                >

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(title)}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                        onerror="this.style.display='none';"
                    >

                </div>
            `
            : "";


    const linkHTML =
        projectLink
            ? `
                <a
                    href="${escapeHTML(projectLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary"
                    style="
                        min-height:36px;
                        padding:8px 11px;
                        display:inline-flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:9px;
                        font-size:11px;
                        font-weight:700;
                    "
                >
                    🌐 View
                </a>
            `
            : "";


    return `

        <article
            class="project-card"
            data-project-id="${escapeHTML(project.id)}"
        >

            ${imageHTML}


            <div>

                <span
                    style="
                        display:block;
                        margin-bottom:7px;
                        color:var(--primary);
                        font-size:9px;
                        font-weight:800;
                        letter-spacing:1px;
                        text-transform:uppercase;
                    "
                >
                    PROJECT ${index + 1}
                </span>


                <h3
                    style="
                        margin-bottom:8px;
                        font-size:17px;
                    "
                >
                    ${escapeHTML(title)}
                </h3>


                <p
                    style="
                        color:var(--muted);
                        font-size:11px;
                        line-height:1.7;
                    "
                >
                    ${escapeHTML(description)}
                </p>


                <div
                    style="
                        margin-top:10px;
                        color:var(--muted);
                        font-size:10px;
                    "
                >
                    Category:
                    <strong
                        style="color:var(--muted-light);"
                    >
                        ${escapeHTML(category)}
                    </strong>
                </div>


                <div
                    style="
                        margin-top:5px;
                        color:var(--muted);
                        font-size:10px;
                    "
                >
                    Status:
                    <strong
                        style="color:var(--primary);"
                    >
                        ${escapeHTML(status)}
                    </strong>
                </div>


                ${toolsHTML}


                <div class="card-actions">

                    <button
                        type="button"
                        class="edit-project-btn"
                        data-id="${escapeHTML(project.id)}"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        type="button"
                        class="delete-project-btn"
                        data-id="${escapeHTML(project.id)}"
                    >
                        🗑️ Delete
                    </button>


                    ${linkHTML}

                </div>

            </div>

        </article>

    `;
}


/* =========================================================
   EDIT PROJECT
   ========================================================= */

async function editProject(
    projectId
) {

    if (!checkAdmin()) {
        return;
    }

    if (!projectId) {
        return;
    }

    try {

        const projectRef =
            doc(
                db,
                PROJECTS_COLLECTION,
                projectId
            );

        const snapshot =
            await getDoc(
                projectRef
            );

        if (!snapshot.exists()) {

            alert(
                "المشروع غير موجود."
            );

            return;
        }

        const project = {

            id:
                snapshot.id,

            ...snapshot.data()

        };


        openModal(
            "Edit Project",
            getProjectFormHTML(
                project
            ),
            "PROJECT"
        );


        const form =
            document.getElementById(
                "projectForm"
            );

        if (form) {

            form.addEventListener(
                "submit",
                handleProjectSubmit
            );
        }


        const cancelButton =
            document.getElementById(
                "cancelProjectBtn"
            );

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeModal
            );
        }


    } catch (error) {

        alert(
            getFirebaseErrorMessage(
                error
            )
        );
    }
}


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(
    projectId
) {

    if (!checkAdmin()) {
        return;
    }

    if (!projectId) {
        return;
    }


    const confirmed =
        confirm(
            "هل أنت متأكد أنك تريد حذف هذا المشروع؟"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                PROJECTS_COLLECTION,
                projectId
            )
        );


        alert(
            "تم حذف المشروع بنجاح ✅"
        );


        await loadProjects();

        await updateDashboardStats();


    } catch (error) {

        alert(
            getFirebaseErrorMessage(
                error
            )
        );
    }
}


/* =========================================================
   PROJECT CARD ACTIONS
   ========================================================= */

document.addEventListener(
    "click",
    async event => {

        const editButton =
            event.target.closest(
                ".edit-project-btn"
            );

        if (editButton) {

            await editProject(
                editButton.dataset.id
            );

            return;
        }


        const deleteButton =
            event.target.closest(
                ".delete-project-btn"
            );

        if (deleteButton) {

            await deleteProject(
                deleteButton.dataset.id
            );

            return;
        }
    }
);


/* =========================================================
   CERTIFICATE FORM
   ========================================================= */

function getCertificateFormHTML(
    certificate = null
) {

    const isEdit =
        Boolean(certificate);

    const certificateId =
        certificate?.id || "";

    const title =
        certificate?.title || "";

    const issuer =
        certificate?.issuer || "";

    const date =
        certificate?.date || "";

    const description =
        certificate?.description || "";

    const imageUrl =
        certificate?.imageUrl || "";

    const certificateUrl =
        certificate?.certificateUrl || "";


    return `

        <form
            id="certificateForm"
            class="admin-form"
            novalidate
        >

            <input
                type="hidden"
                id="certificateId"
                value="${escapeHTML(certificateId)}"
            >


            <div class="form-group">

                <label for="certificateTitle">
                    Certificate Title
                </label>

                <input
                    type="text"
                    id="certificateTitle"
                    placeholder="مثال: ArcGIS Pro Training"
                    value="${escapeHTML(title)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="certificateIssuer">
                    Issuer
                </label>

                <input
                    type="text"
                    id="certificateIssuer"
                    placeholder="مثال: GeoSteps"
                    value="${escapeHTML(issuer)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="certificateDate">
                    Date
                </label>

                <input
                    type="text"
                    id="certificateDate"
                    placeholder="2026"
                    value="${escapeHTML(date)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="certificateDescription">
                    Description
                </label>

                <textarea
                    id="certificateDescription"
                    placeholder="اكتب وصف الشهادة..."
                >${escapeHTML(description)}</textarea>

            </div>


            <div class="form-group">

                <label for="certificateImageUrl">
                    Certificate Image URL
                </label>

                <input
                    type="text"
                    id="certificateImageUrl"
                    placeholder="https://..."
                    value="${escapeHTML(imageUrl)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-group">

                <label for="certificateUrl">
                    Certificate Link
                </label>

                <input
                    type="text"
                    id="certificateUrl"
                    placeholder="https://..."
                    value="${escapeHTML(certificateUrl)}"
                    autocomplete="off"
                >

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="btn-secondary"
                    id="cancelCertificateBtn"
                >
                    إلغاء
                </button>


                <button
                    type="submit"
                    class="btn-primary"
                    id="saveCertificateBtn"
                >
                    ${
                        isEdit
                            ? "حفظ التعديلات"
                            : "إضافة الشهادة"
                    }
                </button>

            </div>

        </form>

    `;
}


/* =========================================================
   OPEN ADD CERTIFICATE
   ========================================================= */

async function openAddCertificateModal() {

    if (!checkAdmin()) {
        return;
    }

    openModal(
        "Add Certificate",
        getCertificateFormHTML(),
        "CERTIFICATE"
    );


    const form =
        document.getElementById(
            "certificateForm"
        );

    if (!form) {
        return;
    }


    const titleInput =
        document.getElementById(
            "certificateTitle"
        );

    if (titleInput) {

        setTimeout(
            () => titleInput.focus(),
            50
        );
    }


    form.addEventListener(
        "submit",
        handleCertificateSubmit
    );


    const cancelButton =
        document.getElementById(
            "cancelCertificateBtn"
        );

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );
    }
}


/* =========================================================
   CERTIFICATE SUBMIT
   ========================================================= */

async function handleCertificateSubmit(
    event
) {

    event.preventDefault();

    event.stopPropagation();

    if (isSavingCertificate) {
        return;
    }

    isSavingCertificate = true;


    const button =
        document.getElementById(
            "saveCertificateBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "جاري الحفظ...";

    }


    try {

        await saveCertificate();

    } finally {

        isSavingCertificate =
            false;


        if (button) {

            button.disabled =
                false;


            const certificateId =
                document.getElementById(
                    "certificateId"
                )?.value;


            button.textContent =
                certificateId
                    ? "حفظ التعديلات"
                    : "إضافة الشهادة";
        }
    }
}


/* =========================================================
   SAVE CERTIFICATE
   ========================================================= */

async function saveCertificate() {

    if (!checkAdmin()) {
        return;
    }


    const certificateId =
        document.getElementById(
            "certificateId"
        )?.value.trim();


    const title =
        document.getElementById(
            "certificateTitle"
        )?.value.trim();


    const issuer =
        document.getElementById(
            "certificateIssuer"
        )?.value.trim();


    const date =
        document.getElementById(
            "certificateDate"
        )?.value.trim();


    const description =
        document.getElementById(
            "certificateDescription"
        )?.value.trim();


    const imageUrl =
        document.getElementById(
            "certificateImageUrl"
        )?.value.trim();


    const certificateUrl =
        document.getElementById(
            "certificateUrl"
        )?.value.trim();


    if (!title) {

        alert(
            "من فضلك اكتب اسم الشهادة."
        );

        document
            .getElementById(
                "certificateTitle"
            )
            ?.focus();

        return;
    }


    if (!issuer) {

        alert(
            "من فضلك اكتب الجهة المانحة."
        );

        document
            .getElementById(
                "certificateIssuer"
            )
            ?.focus();

        return;
    }


    if (!description) {

        alert(
            "من فضلك اكتب وصف الشهادة."
        );

        document
            .getElementById(
                "certificateDescription"
            )
            ?.focus();

        return;
    }


    const certificateData = {

        title:
            title,

        issuer:
            issuer,

        date:
            date || "",

        description:
            description,

        imageUrl:
            imageUrl || "",

        certificateUrl:
            certificateUrl || "",

        updatedAt:
            serverTimestamp()

    };


    try {

        if (certificateId) {

            const certificateRef =
                doc(
                    db,
                    CERTIFICATES_COLLECTION,
                    certificateId
                );


            await updateDoc(
                certificateRef,
                certificateData
            );


            alert(
                "تم تعديل الشهادة بنجاح ✅"
            );

        } else {

            certificateData.createdAt =
                serverTimestamp();

            certificateData.createdBy =
                currentAdminUser.uid;


            await addDoc(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                ),
                certificateData
            );


            alert(
                "تم إضافة الشهادة بنجاح ✅"
            );
        }


        closeModal();

        await loadCertificates();

        await updateDashboardStats();


    } catch (error) {

        alert(
            getFirebaseErrorMessage(
                error
            )
        );
    }
}


/* =========================================================
   LOAD CERTIFICATES
   ========================================================= */

async function loadCertificates() {

    if (!certificatesContainer) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            );


        const certificates =
            snapshot.docs.map(
                item => ({

                    id:
                        item.id,

                    ...item.data()

                })
            );


        certificates.sort(
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


        if (certificatesCount) {

            certificatesCount.textContent =
                certificates.length;
        }


        if (!certificates.length) {

            certificatesContainer.className =
                "content-placeholder";


            certificatesContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🏆
                    </div>

                    <h3>
                        No certificates yet
                    </h3>

                    <p>
                        أضف أول شهادة إلى البورتفوليو.
                    </p>

                    <button
                        class="primary-button"
                        data-action="add-certificate"
                        type="button"
                    >
                        + Add Your First Certificate
                    </button>

                </div>

            `;

            return;
        }


        certificatesContainer.className =
            "certificates-grid";


        certificatesContainer.innerHTML =
            certificates
                .map(
                    createCertificateCard
                )
                .join("");


    } catch (error) {

        console.error(
            "loadCertificates error:",
            error
        );


        certificatesContainer.className =
            "content-placeholder";


        certificatesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Error Loading Certificates
                </h3>

                <p>
                    ${escapeHTML(
                        getFirebaseErrorMessage(
                            error
                        )
                    )}
                </p>

                <button
                    class="primary-button"
                    id="retryCertificatesButton"
                    type="button"
                >
                    إعادة المحاولة
                </button>

            </div>

        `;


        document
            .getElementById(
                "retryCertificatesButton"
            )
            ?.addEventListener(
                "click",
                loadCertificates
            );
    }
}


/* =========================================================
   CERTIFICATE CARD
   ========================================================= */

function createCertificateCard(
    certificate,
    index
) {

    const title =
        certificate.title ||
        "Untitled Certificate";


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

                <div
                    style="
                        width:100%;
                        height:170px;
                        margin-bottom:15px;
                        overflow:hidden;
                        border-radius:11px;
                        background:#081525;
                    "
                >

                    <img
                        src="${escapeHTML(imageUrl)}"
                        alt="${escapeHTML(title)}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                        onerror="this.style.display='none';"
                    >

                </div>

            `
            : "";


    const linkHTML =
        certificateUrl
            ? `

                <a
                    href="${escapeHTML(certificateUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary"
                    style="
                        min-height:36px;
                        padding:8px 11px;
                        display:inline-flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:9px;
                        font-size:11px;
                        font-weight:700;
                    "
                >
                    📄 View
                </a>

            `
            : "";


    return `

        <article
            class="certificate-card"
            data-certificate-id="${escapeHTML(certificate.id)}"
        >

            ${imageHTML}


            <div>

                <span
                    style="
                        display:block;
                        margin-bottom:7px;
                        color:var(--primary);
                        font-size:9px;
                        font-weight:800;
                        letter-spacing:1px;
                        text-transform:uppercase;
                    "
                >
                    CERTIFICATE ${index + 1}
                </span>


                <h3
                    style="
                        margin-bottom:8px;
                        font-size:17px;
                    "
                >
                    ${escapeHTML(title)}
                </h3>


                <p
                    style="
                        color:var(--muted-light);
                        font-size:11px;
                        margin-bottom:5px;
                    "
                >
                    ${escapeHTML(issuer)}
                </p>


                <p
                    style="
                        color:var(--primary);
                        font-size:10px;
                        margin-bottom:8px;
                    "
                >
                    ${escapeHTML(date)}
                </p>


                <p
                    style="
                        color:var(--muted);
                        font-size:11px;
                        line-height:1.7;
                    "
                >
                    ${escapeHTML(description)}
                </p>


                <div class="card-actions">

                    <button
                        type="button"
                        class="edit-certificate-btn"
                        data-id="${escapeHTML(certificate.id)}"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        type="button"
                        class="delete-certificate-btn"
                        data-id="${escapeHTML(certificate.id)}"
                    >
                        🗑️ Delete
                    </button>


                    ${linkHTML}

                </div>

            </div>

        </article>

    `;
}


/* =========================================================
   EDIT CERTIFICATE
   ========================================================= */

async function editCertificate(
    certificateId
) {

    if (!checkAdmin()) {
        return;
    }


    if (!certificateId) {
        return;
    }


    try {

        const certificateRef =
            doc(
                db,
                CERTIFICATES_COLLECTION,
                certificateId
            );


        const snapshot =
            await getDoc(
                certificateRef
            );


        if (!snapshot.exists()) {

            alert(
                "الشهادة غير موجودة."
            );

            return;
        }


        const certificate = {

            id:
                snapshot.id,

            ...snapshot.data()

        };


        openModal(
            "Edit Certificate",
            getCertificateFormHTML(
                certificate
            ),
            "CERTIFICATE"
        );


        const form =
            document.getElementById(
                "certificateForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                handleCertificateSubmit
            );
        }


        const cancelButton =
            document.getElementById(
                "cancelCertificateBtn"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeModal
            );
        }


    } catch (error) {

        alert(
            getFirebaseErrorMessage(
                error
            )
        );
    }
}


/* =========================================================
   DELETE CERTIFICATE
   ========================================================= */

async function deleteCertificate(
    certificateId
) {

    if (!checkAdmin()) {
        return;
    }


    if (!certificateId) {
        return;
    }


    const confirmed =
        confirm(
            "هل أنت متأكد أنك تريد حذف هذه الشهادة؟"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                CERTIFICATES_COLLECTION,
                certificateId
            )
        );


        alert(
            "تم حذف الشهادة بنجاح ✅"
        );


        await loadCertificates();

        await updateDashboardStats();


    } catch (error) {

        alert(
            getFirebaseErrorMessage(
                error
            )
        );
    }
}


/* =========================================================
   CERTIFICATE CARD ACTIONS
   ========================================================= */

document.addEventListener(
    "click",
    async event => {

        const editButton =
            event.target.closest(
                ".edit-certificate-btn"
            );


        if (editButton) {

            await editCertificate(
                editButton.dataset.id
            );

            return;
        }


        const deleteButton =
            event.target.closest(
                ".delete-certificate-btn"
            );


        if (deleteButton) {

            await deleteCertificate(
                deleteButton.dataset.id
            );

            return;
        }
    }
);


/* =========================================================
   COURSES
   ========================================================= */

async function openAddCourseModal() {

    if (!checkAdmin()) {
        return;
    }


    openModal(
        "Add Course",
        `

            <form
                class="admin-form"
                id="courseForm"
                novalidate
            >

                <div class="form-group">

                    <label for="courseTitle">
                        Course Title
                    </label>

                    <input
                        type="text"
                        id="courseTitle"
                        placeholder="مثال: Advanced GIS"
                    >

                </div>


                <div class="form-group">

                    <label for="courseCategory">
                        Category
                    </label>

                    <select id="courseCategory">

                        <option value="gis">
                            GIS
                        </option>

                        <option value="surveying">
                            Surveying
                        </option>

                        <option value="remote-sensing">
                            Remote Sensing
                        </option>

                        <option value="programming">
                            Programming
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label for="courseDescription">
                        Description
                    </label>

                    <textarea
                        id="courseDescription"
                        placeholder="وصف الكورس..."
                    ></textarea>

                </div>


                <div class="form-group">

                    <label for="courseLink">
                        Course Link
                    </label>

                    <input
                        type="text"
                        id="courseLink"
                        placeholder="https://..."
                    >

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        id="cancelCourseBtn"
                    >
                        إلغاء
                    </button>


                    <button
                        type="submit"
                        class="btn-primary"
                    >
                        إضافة الكورس
                    </button>

                </div>

            </form>

        `,
        "COURSE"
    );


    const form =
        document.getElementById(
            "courseForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            alert(
                "قسم الكورسات يحتاج Collection مستقل في Firestore. تم تجهيز الواجهة."
            );

            closeModal();

        }
    );


    document
        .getElementById(
            "cancelCourseBtn"
        )
        ?.addEventListener(
            "click",
            closeModal
        );
}


/* =========================================================
   SKILLS
   ========================================================= */

async function openAddSkillModal() {

    if (!checkAdmin()) {
        return;
    }


    openModal(
        "Add Skill",
        `

            <form
                class="admin-form"
                id="skillForm"
                novalidate
            >

                <div class="form-group">

                    <label for="skillName">
                        Skill Name
                    </label>

                    <input
                        type="text"
                        id="skillName"
                        placeholder="مثال: ArcGIS Pro"
                    >

                </div>


                <div class="form-group">

                    <label for="skillDescription">
                        Description
                    </label>

                    <textarea
                        id="skillDescription"
                        placeholder="وصف المهارة..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        id="cancelSkillBtn"
                    >
                        إلغاء
                    </button>


                    <button
                        type="submit"
                        class="btn-primary"
                    >
                        إضافة المهارة
                    </button>

                </div>

            </form>

        `,
        "SKILL"
    );


    const form =
        document.getElementById(
            "skillForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            alert(
                "قسم المهارات يحتاج Collection مستقل في Firestore. تم تجهيز الواجهة."
            );

            closeModal();

        }
    );


    document
        .getElementById(
            "cancelSkillBtn"
        )
        ?.addEventListener(
            "click",
            closeModal
        );
}


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

async function updateDashboardStats() {

    try {

        const [
            projectsSnapshot,
            certificatesSnapshot
        ] = await Promise.all([

            getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            ),

            getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            )

        ]);


        if (projectsCount) {

            projectsCount.textContent =
                projectsSnapshot.size;
        }


        if (certificatesCount) {

            certificatesCount.textContent =
                certificatesSnapshot.size;
        }


        if (coursesCount) {

            coursesCount.textContent =
                "0";
        }


        if (skillsCount) {

            skillsCount.textContent =
                "0";
        }


    } catch (error) {

        console.error(
            "Dashboard stats error:",
            error
        );
    }
}


/* =========================================================
   FIREBASE CONNECTION TEST
   ========================================================= */

async function testFirebaseConnection() {

    try {

        await Promise.all([

            getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            ),

            getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            )

        ]);


        console.log(
            "Firebase connection: OK"
        );


    } catch (error) {

        console.error(
            "Firebase connection failed:",
            error
        );
    }
}


/* =========================================================
   WEBSITE BUTTONS
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
                confirm(
                    "هل تريد تسجيل الخروج؟"
                );


            if (!confirmed) {
                return;
            }


            try {

                await signOut(
                    auth
                );

                window.location.href =
                    "login.html";


            } catch (error) {

                alert(
                    getFirebaseErrorMessage(
                        error
                    )
                );
            }

        }
    );
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   AUTH GUARD
   ========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        if (
            user.uid !== ADMIN_UID
        ) {

            alert(
                "هذا الحساب غير مصرح له بدخول لوحة الإدارة."
            );


            try {

                await signOut(
                    auth
                );

            } catch (error) {

                console.error(
                    error
                );
            }


            window.location.href =
                "login.html";

            return;
        }


        currentAdminUser =
            user;


        console.log(
            "Admin authenticated:",
            user.uid
        );


        await updateDashboardStats();

        await loadProjects();

        await loadCertificates();

        await testFirebaseConnection();

        await showSection(
            "dashboard"
        );

    }
);


/* =========================================================
   INITIAL UI
   ========================================================= */

if (modal) {

    modal.classList.remove(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


console.log(
    "Ahmed Samir Portfolio Admin loaded successfully."
);