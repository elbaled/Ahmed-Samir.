/* =========================================================
   SAMIR PORTFOLIO - ADMIN DASHBOARD
   Projects + Certificates + Authentication
   Fixed to match current admin.html
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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   CONFIG
   ========================================================= */

const ADMIN_UID =
    "Sszp0JmpjcQhpsg78kqh5VS8row1";

const PROJECTS_COLLECTION =
    "projects";

const CERTIFICATES_COLLECTION =
    "certificates";


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
    document.querySelectorAll(".nav-item");

const sections =
    document.querySelectorAll(".content-section");

const pageTitle =
    document.getElementById("pageTitle");

const viewWebsiteButton =
    document.getElementById("viewWebsiteButton");

const headerWebsiteButton =
    document.getElementById("headerWebsiteButton");

const logoutButton =
    document.getElementById("logoutButton");

const addProjectButton =
    document.getElementById("addProjectButton");

const addCertificateButton =
    document.getElementById("addCertificateButton");

const addCourseButton =
    document.getElementById("addCourseButton");

const addSkillButton =
    document.getElementById("addSkillButton");

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

const currentYear =
    document.getElementById("currentYear");

const modal =
    document.getElementById("modal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");


/* =========================================================
   PAGE TITLES
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
   YEAR
   ========================================================= */

if (currentYear) {

    currentYear.textContent =
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
   MOBILE SIDEBAR
   ========================================================= */

function openSidebar() {

    if (sidebar) {

        sidebar.classList.add(
            "active"
        );

    }

    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );

    }

}


function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "active"
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
        openSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function showSection(sectionName) {

    if (!sectionName) {
        return;
    }


    sections.forEach(
        (section) => {

            section.classList.remove(
                "active"
            );

        }
    );


    navItems.forEach(
        (item) => {

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
            SECTION_TITLES[
                sectionName
            ] ||
            "Dashboard";

    }


    closeSidebar();


    /* -----------------------------------------
       Load section data
       ----------------------------------------- */

    if (
        sectionName ===
        "projects"
    ) {

        loadProjects();

    }


    if (
        sectionName ===
        "certificates"
    ) {

        loadCertificates();

    }


    if (
        sectionName ===
        "courses"
    ) {

        showCoursesPlaceholder();

    }


    if (
        sectionName ===
        "skills"
    ) {

        showSkillsPlaceholder();

    }

}


/* =========================================================
   NAVIGATION EVENTS
   ========================================================= */

navItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                const sectionName =
                    item.dataset.section;

                if (sectionName) {

                    showSection(
                        sectionName
                    );

                }

            }
        );

    }
);


/* =========================================================
   QUICK ACTION EVENTS
   ========================================================= */

document
    .querySelectorAll(
        ".quick-action"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const sectionName =
                        button.dataset.section;

                    if (!sectionName) {
                        return;
                    }


                    showSection(
                        sectionName
                    );


                    if (
                        sectionName ===
                        "projects"
                    ) {

                        setTimeout(
                            () => {

                                openAddProjectModal();

                            },
                            100
                        );

                    }


                    if (
                        sectionName ===
                        "certificates"
                    ) {

                        setTimeout(
                            () => {

                                openAddCertificateModal();

                            },
                            100
                        );

                    }


                    if (
                        sectionName ===
                        "courses"
                    ) {

                        setTimeout(
                            () => {

                                openCourseComingSoon();

                            },
                            100
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   EMPTY STATE ACTION BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        if (
            action ===
            "add-project"
        ) {

            openAddProjectModal();

        }


        if (
            action ===
            "add-certificate"
        ) {

            openAddCertificateModal();

        }


        if (
            action ===
            "add-course"
        ) {

            openCourseComingSoon();

        }


        if (
            action ===
            "add-skill"
        ) {

            openSkillComingSoon();

        }

    }
);


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

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "حدث خطأ أثناء تسجيل الخروج."
                );

            }

        }
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(
    title,
    content
) {

    if (!modal) {
        return;
    }


    if (modalTitle) {

        modalTitle.textContent =
            title;

    }


    if (modalBody) {

        modalBody.innerHTML =
            content;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function closeModal() {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );

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
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   PROJECT FORM
   ========================================================= */

function getProjectFormHTML(
    project = null
) {

    const isEdit =
        project !== null;


    const title =
        project?.title || "";

    const category =
        project?.category || "gis";

    const description =
        project?.description || "";

    const tools =
        project?.tools || "";

    const status =
        project?.status || "Planned";

    const projectLink =
        project?.projectLink || "";

    const imageUrl =
        project?.imageUrl || "";


    return `

        <form
            id="projectForm"
            class="admin-form"
        >

            <input
                type="hidden"
                id="projectId"
                value="${escapeHTML(
                    project?.id || ""
                )}"
            >


            <div class="form-group">

                <label>
                    Project Title
                </label>

                <input
                    type="text"
                    id="projectTitle"
                    placeholder="GIS Mapping Project"
                    value="${escapeHTML(
                        title
                    )}"
                    required
                >

            </div>


            <div class="form-row">

                <div class="form-group">

                    <label>
                        Category
                    </label>

                    <select
                        id="projectCategory"
                    >

                        <option
                            value="gis"
                            ${
                                category === "gis"
                                    ? "selected"
                                    : ""
                            }
                        >
                            GIS
                        </option>

                        <option
                            value="surveying"
                            ${
                                category === "surveying"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Surveying
                        </option>

                        <option
                            value="remote-sensing"
                            ${
                                category === "remote-sensing"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Remote Sensing
                        </option>

                        <option
                            value="programming"
                            ${
                                category === "programming"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Programming
                        </option>

                        <option
                            value="civil3d"
                            ${
                                category === "civil3d"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Civil 3D
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Status
                    </label>

                    <select
                        id="projectStatus"
                    >

                        <option
                            value="Planned"
                            ${
                                status === "Planned"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Planned
                        </option>

                        <option
                            value="In Progress"
                            ${
                                status === "In Progress"
                                    ? "selected"
                                    : ""
                            }
                        >
                            In Progress
                        </option>

                        <option
                            value="Completed"
                            ${
                                status === "Completed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completed
                        </option>

                    </select>

                </div>

            </div>


            <div class="form-group">

                <label>
                    Description
                </label>

                <textarea
                    id="projectDescription"
                    rows="5"
                    required
                >${escapeHTML(
                    description
                )}</textarea>

            </div>


            <div class="form-group">

                <label>
                    Tools / Technologies
                </label>

                <input
                    type="text"
                    id="projectTools"
                    placeholder="ArcGIS Pro, AutoCAD, Python"
                    value="${escapeHTML(
                        tools
                    )}"
                >

            </div>


            <div class="form-group">

                <label>
                    Image URL
                </label>

                <input
                    type="url"
                    id="projectImageUrl"
                    placeholder="https://..."
                    value="${escapeHTML(
                        imageUrl
                    )}"
                >

                <small>
                    استخدم رابط صورة من GitHub أو استضافة مجانية.
                </small>

            </div>


            <div class="form-group">

                <label>
                    Project Link
                </label>

                <input
                    type="url"
                    id="projectLink"
                    placeholder="https://github.com/..."
                    value="${escapeHTML(
                        projectLink
                    )}"
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
   ADD PROJECT
   ========================================================= */

function openAddProjectModal() {

    openModal(
        "إضافة مشروع جديد",
        getProjectFormHTML()
    );


    attachProjectFormEvents();

}


if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        openAddProjectModal
    );

}


/* =========================================================
   PROJECT FORM EVENTS
   ========================================================= */

function attachProjectFormEvents() {

    const form =
        document.getElementById(
            "projectForm"
        );


    const cancel =
        document.getElementById(
            "cancelProjectBtn"
        );


    if (cancel) {

        cancel.addEventListener(
            "click",
            closeModal
        );

    }


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await saveProject();

        }
    );

}


/* =========================================================
   SAVE PROJECT
   ========================================================= */

async function saveProject() {

    const id =
        document.getElementById(
            "projectId"
        )?.value.trim() || "";


    const title =
        document.getElementById(
            "projectTitle"
        )?.value.trim() || "";


    const category =
        document.getElementById(
            "projectCategory"
        )?.value || "gis";


    const description =
        document.getElementById(
            "projectDescription"
        )?.value.trim() || "";


    const tools =
        document.getElementById(
            "projectTools"
        )?.value.trim() || "";


    const status =
        document.getElementById(
            "projectStatus"
        )?.value || "Planned";


    const imageUrl =
        document.getElementById(
            "projectImageUrl"
        )?.value.trim() || "";


    const projectLink =
        document.getElementById(
            "projectLink"
        )?.value.trim() || "";


    if (!title) {

        alert(
            "من فضلك اكتب اسم المشروع."
        );

        return;

    }


    if (!description) {

        alert(
            "من فضلك اكتب وصف المشروع."
        );

        return;

    }


    const data = {

        title,

        category,

        description,

        tools,

        status,

        imageUrl,

        projectLink,

        updatedAt:
            serverTimestamp()

    };


    try {

        if (id) {

            await updateDoc(
                doc(
                    db,
                    PROJECTS_COLLECTION,
                    id
                ),
                data
            );


            alert(
                "تم تعديل المشروع بنجاح."
            );

        } else {

            data.createdAt =
                serverTimestamp();


            await addDoc(
                collection(
                    db,
                    PROJECTS_COLLECTION
                ),
                data
            );


            alert(
                "تم إضافة المشروع بنجاح."
            );

        }


        closeModal();

        await loadProjects();

        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Save project error:",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ المشروع:\n\n" +
            error.message
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


    projectsContainer.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            <p>
                جاري تحميل المشاريع...
            </p>

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            );


        const projects = [];


        snapshot.forEach(
            (item) => {

                projects.push({

                    id:
                        item.id,

                    ...item.data()

                });

            }
        );


        projects.sort(
            (a, b) => {

                return (
                    (b.createdAt?.seconds || 0) -
                    (a.createdAt?.seconds || 0)
                );

            }
        );


        if (
            projects.length ===
            0
        ) {

            projectsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📁
                    </div>

                    <h3>
                        لا توجد مشاريع
                    </h3>

                    <p>
                        ابدأ بإضافة أول مشروع.
                    </p>

                    <button
                        class="primary-button"
                        data-action="add-project"
                        type="button"
                    >
                        + إضافة أول مشروع
                    </button>

                </div>

            `;

        } else {

            projectsContainer.innerHTML =
                projects
                    .map(
                        createProjectCard
                    )
                    .join("");


            attachProjectCardEvents();

        }


        if (projectsCount) {

            projectsCount.textContent =
                projects.length;

        }


    } catch (error) {

        console.error(
            "Load projects error:",
            error
        );


        projectsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    حدث خطأ
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   PROJECT CARD
   ========================================================= */

function createProjectCard(
    project
) {

    const categories = {

        gis:
            "GIS",

        surveying:
            "Surveying",

        "remote-sensing":
            "Remote Sensing",

        programming:
            "Programming",

        civil3d:
            "Civil 3D"

    };


    const category =
        categories[
            project.category
        ] ||
        project.category ||
        "Other";


    const image =
        project.imageUrl
            ? `
                <img
                    src="${escapeHTML(
                        project.imageUrl
                    )}"
                    alt="${escapeHTML(
                        project.title
                    )}"
                    class="project-admin-image"
                >
            `
            : `
                <div
                    class="project-admin-placeholder"
                >
                    📁
                </div>
            `;


    return `

        <article
            class="admin-project-card"
        >

            <div
                class="admin-project-image"
            >

                ${image}

            </div>


            <div
                class="admin-project-content"
            >

                <div
                    class="project-top"
                >

                    <span
                        class="project-category"
                    >
                        ${escapeHTML(
                            category
                        )}
                    </span>


                    <span
                        class="project-status"
                    >
                        ${escapeHTML(
                            project.status ||
                            "Planned"
                        )}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(
                        project.title ||
                        "Untitled Project"
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        project.description ||
                        ""
                    )}
                </p>


                ${
                    project.tools
                        ? `
                            <div
                                class="project-tools"
                            >

                                <strong>
                                    Tools:
                                </strong>

                                ${escapeHTML(
                                    project.tools
                                )}

                            </div>
                        `
                        : ""
                }


                <div
                    class="project-card-actions"
                >

                    <button
                        class="btn-edit edit-project-btn"
                        data-id="${escapeHTML(
                            project.id
                        )}"
                        type="button"
                    >
                        ✏️ تعديل
                    </button>


                    <button
                        class="btn-delete delete-project-btn"
                        data-id="${escapeHTML(
                            project.id
                        )}"
                        type="button"
                    >
                        🗑️ حذف
                    </button>


                    ${
                        project.projectLink
                            ? `
                                <a
                                    href="${escapeHTML(
                                        project.projectLink
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn-view"
                                >
                                    🔗 فتح
                                </a>
                            `
                            : ""
                    }

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   PROJECT CARD EVENTS
   ========================================================= */

function attachProjectCardEvents() {

    document
        .querySelectorAll(
            ".edit-project-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        editProject(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".delete-project-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteProject(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   EDIT PROJECT
   ========================================================= */

async function editProject(
    projectId
) {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            );


        let project =
            null;


        snapshot.forEach(
            (item) => {

                if (
                    item.id ===
                    projectId
                ) {

                    project = {

                        id:
                            item.id,

                        ...item.data()

                    };

                }

            }
        );


        if (!project) {

            alert(
                "لم يتم العثور على المشروع."
            );

            return;

        }


        openModal(
            "تعديل المشروع",
            getProjectFormHTML(
                project
            )
        );


        attachProjectFormEvents();


    } catch (error) {

        console.error(
            "Edit project error:",
            error
        );


        alert(
            "حدث خطأ أثناء تحميل المشروع."
        );

    }

}


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(
    projectId
) {

    const confirmed =
        confirm(
            "هل أنت متأكد من حذف المشروع؟"
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
            "تم حذف المشروع."
        );


        await loadProjects();

        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        alert(
            "حدث خطأ أثناء الحذف:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   CERTIFICATE FORM
   ========================================================= */

function getCertificateFormHTML(
    certificate = null
) {

    const isEdit =
        certificate !== null;


    return `

        <form
            id="certificateForm"
            class="admin-form"
        >

            <input
                type="hidden"
                id="certificateId"
                value="${escapeHTML(
                    certificate?.id || ""
                )}"
            >


            <div class="form-group">

                <label>
                    Certificate Name
                </label>

                <input
                    type="text"
                    id="certificateTitle"
                    placeholder="ArcGIS Pro Training"
                    value="${escapeHTML(
                        certificate?.title || ""
                    )}"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Issuing Organization
                </label>

                <input
                    type="text"
                    id="certificateIssuer"
                    placeholder="GeoSteps"
                    value="${escapeHTML(
                        certificate?.issuer || ""
                    )}"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Date
                </label>

                <input
                    type="text"
                    id="certificateDate"
                    placeholder="2026"
                    value="${escapeHTML(
                        certificate?.date || ""
                    )}"
                >

            </div>


            <div class="form-group">

                <label>
                    Description
                </label>

                <textarea
                    id="certificateDescription"
                    rows="4"
                    placeholder="وصف مختصر للشهادة..."
                >${escapeHTML(
                    certificate?.description || ""
                )}</textarea>

            </div>


            <div class="form-group">

                <label>
                    Certificate Image URL
                </label>

                <input
                    type="url"
                    id="certificateImageUrl"
                    placeholder="https://..."
                    value="${escapeHTML(
                        certificate?.imageUrl || ""
                    )}"
                >

                <small>
                    رابط صورة الشهادة.
                </small>

            </div>


            <div class="form-group">

                <label>
                    Certificate Link
                </label>

                <input
                    type="url"
                    id="certificateUrl"
                    placeholder="https://..."
                    value="${escapeHTML(
                        certificate?.certificateUrl || ""
                    )}"
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
   ADD CERTIFICATE
   ========================================================= */

function openAddCertificateModal() {

    openModal(
        "إضافة شهادة جديدة",
        getCertificateFormHTML()
    );


    attachCertificateFormEvents();

}


if (addCertificateButton) {

    addCertificateButton.addEventListener(
        "click",
        openAddCertificateModal
    );

}


/* =========================================================
   CERTIFICATE FORM EVENTS
   ========================================================= */

function attachCertificateFormEvents() {

    const form =
        document.getElementById(
            "certificateForm"
        );


    const cancel =
        document.getElementById(
            "cancelCertificateBtn"
        );


    if (cancel) {

        cancel.addEventListener(
            "click",
            closeModal
        );

    }


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await saveCertificate();

        }
    );

}


/* =========================================================
   SAVE CERTIFICATE
   ========================================================= */

async function saveCertificate() {

    const id =
        document.getElementById(
            "certificateId"
        )?.value.trim() || "";


    const title =
        document.getElementById(
            "certificateTitle"
        )?.value.trim() || "";


    const issuer =
        document.getElementById(
            "certificateIssuer"
        )?.value.trim() || "";


    const date =
        document.getElementById(
            "certificateDate"
        )?.value.trim() || "";


    const description =
        document.getElementById(
            "certificateDescription"
        )?.value.trim() || "";


    const imageUrl =
        document.getElementById(
            "certificateImageUrl"
        )?.value.trim() || "";


    const certificateUrl =
        document.getElementById(
            "certificateUrl"
        )?.value.trim() || "";


    if (!title) {

        alert(
            "من فضلك اكتب اسم الشهادة."
        );

        return;

    }


    if (!issuer) {

        alert(
            "من فضلك اكتب الجهة المانحة."
        );

        return;

    }


    const data = {

        title,

        issuer,

        date,

        description,

        imageUrl,

        certificateUrl,

        updatedAt:
            serverTimestamp()

    };


    try {

        if (id) {

            await updateDoc(
                doc(
                    db,
                    CERTIFICATES_COLLECTION,
                    id
                ),
                data
            );


            alert(
                "تم تعديل الشهادة بنجاح."
            );

        } else {

            data.createdAt =
                serverTimestamp();


            await addDoc(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                ),
                data
            );


            alert(
                "تم إضافة الشهادة بنجاح."
            );

        }


        closeModal();

        await loadCertificates();

        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Save certificate error:",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ الشهادة:\n\n" +
            error.message
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


    certificatesContainer.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            <p>
                جاري تحميل الشهادات...
            </p>

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            );


        const certificates = [];


        snapshot.forEach(
            (item) => {

                certificates.push({

                    id:
                        item.id,

                    ...item.data()

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

            certificatesContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🎓
                    </div>

                    <h3>
                        لا توجد شهادات
                    </h3>

                    <p>
                        ابدأ بإضافة أول شهادة.
                    </p>

                    <button
                        class="primary-button"
                        data-action="add-certificate"
                        type="button"
                    >
                        + إضافة أول شهادة
                    </button>

                </div>

            `;

        } else {

            certificatesContainer.innerHTML =
                certificates
                    .map(
                        createCertificateCard
                    )
                    .join("");


            attachCertificateCardEvents();

        }


        if (certificatesCount) {

            certificatesCount.textContent =
                certificates.length;

        }


    } catch (error) {

        console.error(
            "Load certificates error:",
            error
        );


        certificatesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    حدث خطأ
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   CERTIFICATE CARD
   ========================================================= */

function createCertificateCard(
    certificate
) {

    const image =
        certificate.imageUrl
            ? `
                <img
                    src="${escapeHTML(
                        certificate.imageUrl
                    )}"
                    alt="${escapeHTML(
                        certificate.title
                    )}"
                    class="certificate-admin-image"
                >
            `
            : `
                <div
                    class="certificate-placeholder"
                >
                    🎓
                </div>
            `;


    return `

        <article
            class="admin-certificate-card"
        >

            <div
                class="certificate-admin-image-wrapper"
            >

                ${image}

            </div>


            <div
                class="certificate-admin-content"
            >

                <h3>
                    ${escapeHTML(
                        certificate.title ||
                        "Certificate"
                    )}
                </h3>


                <p>
                    <strong>
                        Issuer:
                    </strong>

                    ${escapeHTML(
                        certificate.issuer ||
                        ""
                    )}
                </p>


                ${
                    certificate.date
                        ? `
                            <p>
                                <strong>
                                    Date:
                                </strong>

                                ${escapeHTML(
                                    certificate.date
                                )}
                            </p>
                        `
                        : ""
                }


                ${
                    certificate.description
                        ? `
                            <p>
                                ${escapeHTML(
                                    certificate.description
                                )}
                            </p>
                        `
                        : ""
                }


                <div
                    class="certificate-card-actions"
                >

                    <button
                        class="btn-edit edit-certificate-btn"
                        data-id="${escapeHTML(
                            certificate.id
                        )}"
                        type="button"
                    >
                        ✏️ تعديل
                    </button>


                    <button
                        class="btn-delete delete-certificate-btn"
                        data-id="${escapeHTML(
                            certificate.id
                        )}"
                        type="button"
                    >
                        🗑️ حذف
                    </button>


                    ${
                        certificate.certificateUrl
                            ? `
                                <a
                                    href="${escapeHTML(
                                        certificate.certificateUrl
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn-view"
                                >
                                    🔗 الشهادة
                                </a>
                            `
                            : ""
                    }

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   CERTIFICATE CARD EVENTS
   ========================================================= */

function attachCertificateCardEvents() {

    document
        .querySelectorAll(
            ".edit-certificate-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        editCertificate(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".delete-certificate-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteCertificate(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   EDIT CERTIFICATE
   ========================================================= */

async function editCertificate(
    certificateId
) {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            );


        let certificate =
            null;


        snapshot.forEach(
            (item) => {

                if (
                    item.id ===
                    certificateId
                ) {

                    certificate = {

                        id:
                            item.id,

                        ...item.data()

                    };

                }

            }
        );


        if (!certificate) {

            alert(
                "لم يتم العثور على الشهادة."
            );

            return;

        }


        openModal(
            "تعديل الشهادة",
            getCertificateFormHTML(
                certificate
            )
        );


        attachCertificateFormEvents();


    } catch (error) {

        console.error(
            "Edit certificate error:",
            error
        );


        alert(
            "حدث خطأ أثناء تحميل الشهادة."
        );

    }

}


/* =========================================================
   DELETE CERTIFICATE
   ========================================================= */

async function deleteCertificate(
    certificateId
) {

    const confirmed =
        confirm(
            "هل أنت متأكد من حذف هذه الشهادة؟"
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
            "تم حذف الشهادة بنجاح."
        );


        await loadCertificates();

        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Delete certificate error:",
            error
        );


        alert(
            "حدث خطأ أثناء حذف الشهادة:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   COURSES - TEMPORARY
   ========================================================= */

function showCoursesPlaceholder() {

    if (!coursesContainer) {
        return;
    }


    coursesContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                📚
            </div>

            <h3>
                قسم الكورسات
            </h3>

            <p>
                قسم الكورسات جاهز في لوحة التحكم، وسيتم ربطه بـ Firestore في الخطوة التالية.
            </p>

            <button
                class="primary-button"
                data-action="add-course"
                type="button"
            >
                + إضافة كورس
            </button>

        </div>

    `;

}


function openCourseComingSoon() {

    openModal(
        "إضافة كورس",
        `
            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    إدارة الكورسات
                </h3>

                <p>
                    سنربط الكورسات بـ Firestore في الخطوة التالية.
                </p>

            </div>
        `
    );

}


if (addCourseButton) {

    addCourseButton.addEventListener(
        "click",
        openCourseComingSoon
    );

}


/* =========================================================
   SKILLS - TEMPORARY
   ========================================================= */

function showSkillsPlaceholder() {

    if (!skillsContainer) {
        return;
    }


    skillsContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                💡
            </div>

            <h3>
                Skills Management
            </h3>

            <p>
                إدارة المهارات سيتم ربطها بـ Firestore في الخطوة التالية.
            </p>

            <button
                class="primary-button"
                data-action="add-skill"
                type="button"
            >
                + إضافة مهارة
            </button>

        </div>

    `;

}


function openSkillComingSoon() {

    openModal(
        "إضافة مهارة",
        `
            <div class="empty-state">

                <div class="empty-icon">
                    💡
                </div>

                <h3>
                    إدارة المهارات
                </h3>

                <p>
                    سنربط المهارات بـ Firestore في الخطوة التالية.
                </p>

            </div>
        `
    );

}


if (addSkillButton) {

    addSkillButton.addEventListener(
        "click",
        openSkillComingSoon
    );

}


/* =========================================================
   DASHBOARD STATS
   ========================================================= */

async function updateDashboardStats() {

    try {

        const projectsSnapshot =
            await getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            );


        const certificatesSnapshot =
            await getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            );


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
   AUTH GUARD
   ========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        if (
            user.uid !==
            ADMIN_UID
        ) {

            await signOut(
                auth
            );


            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "Admin authenticated:",
            user.email
        );


        await updateDashboardStats();

        await loadProjects();

        await loadCertificates();

    }
);


/* =========================================================
   INITIAL SECTION
   ========================================================= */

showSection(
    "dashboard"
);


/* =========================================================
   READY
   ========================================================= */

console.log(
    "Samir Portfolio Admin loaded successfully."
);