/* =========================================================
   SAMIR PORTFOLIO - ADMIN DASHBOARD
   Projects CRUD + Authentication
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
   ADMIN CONFIG
   ========================================================= */

const ADMIN_UID = "Sszp0JmpjcQhpsg78kqh5VS8row1";

const PROJECTS_COLLECTION = "projects";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const sidebarClose = document.getElementById("sidebarClose");

const navItems = document.querySelectorAll(".nav-item");

const sections = document.querySelectorAll(".admin-section");

const viewWebsiteBtn = document.getElementById("viewWebsiteBtn");
const logoutBtn = document.getElementById("logoutBtn");

const addProjectBtn = document.getElementById("addProjectBtn");
const addCertificateBtn = document.getElementById("addCertificateBtn");
const addCourseBtn = document.getElementById("addCourseBtn");
const addSkillBtn = document.getElementById("addSkillBtn");

const modal = document.getElementById("adminModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

const projectsContainer = document.getElementById("projectsContainer");

const projectsCount = document.getElementById("projectsCount");
const certificatesCount = document.getElementById("certificatesCount");
const coursesCount = document.getElementById("coursesCount");
const skillsCount = document.getElementById("skillsCount");

const currentYear = document.getElementById("currentYear");


/* =========================================================
   CURRENT YEAR
   ========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        sidebar?.classList.add("active");
    });
}

if (sidebarClose) {
    sidebarClose.addEventListener("click", () => {
        sidebar?.classList.remove("active");
    });
}


/* =========================================================
   CLOSE SIDEBAR WHEN CLICKING NAV
   ========================================================= */

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        sidebar?.classList.remove("active");
    });
});


/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function showSection(sectionId) {

    sections.forEach((section) => {
        section.classList.remove("active");
    });

    navItems.forEach((item) => {
        item.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        targetSection.classList.add("active");
    }

    const activeNav = document.querySelector(
        `.nav-item[data-section="${sectionId}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    if (sectionId === "projectsSection") {
        loadProjects();
    }
}


navItems.forEach((item) => {

    item.addEventListener("click", () => {

        const sectionId = item.dataset.section;

        if (!sectionId) {
            return;
        }

        showSection(sectionId);

    });

});


/* =========================================================
   VIEW WEBSITE
   ========================================================= */

if (viewWebsiteBtn) {

    viewWebsiteBtn.addEventListener("click", () => {

        window.location.href = "index.html";

    });

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout error:", error);

            alert("حدث خطأ أثناء تسجيل الخروج.");

        }

    });

}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(title, content) {

    if (!modal) {
        return;
    }

    if (modalTitle) {
        modalTitle.textContent = title;
    }

    if (modalBody) {
        modalBody.innerHTML = content;
    }

    modal.classList.add("active");

    document.body.classList.add("modal-open");
}


function closeModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}


if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
}


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeModal();

    }

});


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
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
   PROJECT FORM
   ========================================================= */

function getProjectFormHTML(project = null) {

    const isEdit = project !== null;

    const title = project?.title || "";
    const category = project?.category || "gis";
    const description = project?.description || "";
    const tools = project?.tools || "";
    const status = project?.status || "Planned";
    const projectLink = project?.projectLink || "";
    const imageUrl = project?.imageUrl || "";

    return `

        <form id="projectForm" class="admin-form">

            <input
                type="hidden"
                id="projectId"
                value="${escapeHTML(project?.id || "")}"
            >

            <div class="form-group">

                <label for="projectTitle">
                    Project Title
                </label>

                <input
                    type="text"
                    id="projectTitle"
                    placeholder="مثال: GIS Mapping Project"
                    value="${escapeHTML(title)}"
                    required
                >

            </div>


            <div class="form-row">

                <div class="form-group">

                    <label for="projectCategory">
                        Category
                    </label>

                    <select id="projectCategory">

                        <option value="gis" ${category === "gis" ? "selected" : ""}>
                            GIS
                        </option>

                        <option value="surveying" ${category === "surveying" ? "selected" : ""}>
                            Surveying
                        </option>

                        <option value="remote-sensing" ${category === "remote-sensing" ? "selected" : ""}>
                            Remote Sensing
                        </option>

                        <option value="programming" ${category === "programming" ? "selected" : ""}>
                            Programming
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label for="projectStatus">
                        Status
                    </label>

                    <select id="projectStatus">

                        <option value="Planned" ${status === "Planned" ? "selected" : ""}>
                            Planned
                        </option>

                        <option value="In Progress" ${status === "In Progress" ? "selected" : ""}>
                            In Progress
                        </option>

                        <option value="Completed" ${status === "Completed" ? "selected" : ""}>
                            Completed
                        </option>

                    </select>

                </div>

            </div>


            <div class="form-group">

                <label for="projectDescription">
                    Description
                </label>

                <textarea
                    id="projectDescription"
                    rows="5"
                    placeholder="اكتب وصف المشروع..."
                    required
                >${escapeHTML(description)}</textarea>

            </div>


            <div class="form-group">

                <label for="projectTools">
                    Tools / Technologies
                </label>

                <input
                    type="text"
                    id="projectTools"
                    placeholder="مثال: ArcGIS Pro, AutoCAD, Python"
                    value="${escapeHTML(tools)}"
                >

            </div>


            <div class="form-group">

                <label for="projectImageUrl">
                    Image URL
                </label>

                <input
                    type="url"
                    id="projectImageUrl"
                    placeholder="https://..."
                    value="${escapeHTML(imageUrl)}"
                >

                <small>
                    استخدم رابط الصورة من GitHub أو أي استضافة مجانية.
                </small>

            </div>


            <div class="form-group">

                <label for="projectLink">
                    Project Link
                </label>

                <input
                    type="url"
                    id="projectLink"
                    placeholder="https://github.com/..."
                    value="${escapeHTML(projectLink)}"
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
                    ${isEdit ? "حفظ التعديلات" : "إضافة المشروع"}
                </button>

            </div>

        </form>

    `;
}


/* =========================================================
   OPEN ADD PROJECT MODAL
   ========================================================= */

function openAddProjectModal() {

    openModal(
        "إضافة مشروع جديد",
        getProjectFormHTML()
    );

    attachProjectFormEvents();

}


/* =========================================================
   OPEN EDIT PROJECT MODAL
   ========================================================= */

function openEditProjectModal(project) {

    openModal(
        "تعديل المشروع",
        getProjectFormHTML(project)
    );

    attachProjectFormEvents();

}


/* =========================================================
   PROJECT FORM EVENTS
   ========================================================= */

function attachProjectFormEvents() {

    const form = document.getElementById("projectForm");

    const cancelButton =
        document.getElementById("cancelProjectBtn");


    if (cancelButton) {

        cancelButton.addEventListener("click", () => {

            closeModal();

        });

    }


    if (!form) {
        return;
    }


    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        await saveProject();

    });

}


/* =========================================================
   SAVE PROJECT
   ========================================================= */

async function saveProject() {

    const projectId =
        document.getElementById("projectId")?.value.trim() || "";

    const title =
        document.getElementById("projectTitle")?.value.trim() || "";

    const category =
        document.getElementById("projectCategory")?.value || "gis";

    const description =
        document.getElementById("projectDescription")?.value.trim() || "";

    const tools =
        document.getElementById("projectTools")?.value.trim() || "";

    const status =
        document.getElementById("projectStatus")?.value || "Planned";

    const imageUrl =
        document.getElementById("projectImageUrl")?.value.trim() || "";

    const projectLink =
        document.getElementById("projectLink")?.value.trim() || "";


    if (!title) {

        alert("من فضلك اكتب اسم المشروع.");

        return;

    }


    if (!description) {

        alert("من فضلك اكتب وصف المشروع.");

        return;

    }


    const projectData = {

        title: title,

        category: category,

        description: description,

        tools: tools,

        status: status,

        imageUrl: imageUrl,

        projectLink: projectLink,

        updatedAt: serverTimestamp()

    };


    try {

        if (projectId) {

            /* =========================
               UPDATE
               ========================= */

            const projectRef =
                doc(db, PROJECTS_COLLECTION, projectId);

            await updateDoc(
                projectRef,
                projectData
            );

            alert("تم تعديل المشروع بنجاح.");

        } else {

            /* =========================
               CREATE
               ========================= */

            projectData.createdAt =
                serverTimestamp();

            await addDoc(
                collection(db, PROJECTS_COLLECTION),
                projectData
            );

            alert("تم إضافة المشروع بنجاح.");

        }


        closeModal();

        await loadProjects();

        await updateDashboardStats();


    } catch (error) {

        console.error("Save project error:", error);

        alert(
            "حدث خطأ أثناء حفظ المشروع.\n\n" +
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
                collection(db, PROJECTS_COLLECTION)
            );


        const projects = [];


        snapshot.forEach((documentSnapshot) => {

            projects.push({

                id: documentSnapshot.id,

                ...documentSnapshot.data()

            });

        });


        /* =====================================================
           SORT PROJECTS
           ===================================================== */

        projects.sort((a, b) => {

            const aTime =
                a.createdAt?.seconds || 0;

            const bTime =
                b.createdAt?.seconds || 0;

            return bTime - aTime;

        });


        if (projects.length === 0) {

            projectsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📁
                    </div>

                    <h3>
                        لا توجد مشاريع
                    </h3>

                    <p>
                        ابدأ بإضافة أول مشروع إلى البورتفوليو.
                    </p>

                    <button
                        class="btn-primary"
                        id="emptyAddProjectBtn"
                    >
                        + إضافة مشروع
                    </button>

                </div>

            `;


            const emptyAddButton =
                document.getElementById(
                    "emptyAddProjectBtn"
                );


            if (emptyAddButton) {

                emptyAddButton.addEventListener(
                    "click",
                    openAddProjectModal
                );

            }


            updateProjectCount(0);

            return;

        }


        projectsContainer.innerHTML =
            projects.map(
                createProjectCard
            ).join("");


        attachProjectCardEvents();

        updateProjectCount(
            projects.length
        );


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
                    تعذر تحميل المشاريع
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    class="btn-primary"
                    id="retryProjectsBtn"
                >
                    إعادة المحاولة
                </button>

            </div>

        `;


        const retryButton =
            document.getElementById(
                "retryProjectsBtn"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadProjects
            );

        }

    }

}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(project) {

    const image = project.imageUrl
        ? `
            <img
                src="${escapeHTML(project.imageUrl)}"
                alt="${escapeHTML(project.title)}"
                class="project-admin-image"
                loading="lazy"
                onerror="this.style.display='none';"
            >
        `
        : `
            <div class="project-admin-placeholder">
                <span>📁</span>
            </div>
        `;


    const categoryNames = {

        "gis": "GIS",

        "surveying": "Surveying",

        "remote-sensing": "Remote Sensing",

        "programming": "Programming"

    };


    const categoryName =
        categoryNames[project.category]
        || project.category
        || "Other";


    return `

        <article
            class="admin-project-card"
            data-project-id="${escapeHTML(project.id)}"
        >

            <div class="admin-project-image">

                ${image}

            </div>


            <div class="admin-project-content">

                <div class="project-top">

                    <span class="project-category">

                        ${escapeHTML(categoryName)}

                    </span>


                    <span
                        class="project-status status-${escapeHTML(
                            String(project.status || "")
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                        )}"
                    >

                        ${escapeHTML(
                            project.status || "Planned"
                        )}

                    </span>

                </div>


                <h3>

                    ${escapeHTML(
                        project.title || "Untitled Project"
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        project.description || ""
                    )}

                </p>


                ${
                    project.tools
                        ? `
                            <div class="project-tools">

                                <strong>
                                    Tools:
                                </strong>

                                ${escapeHTML(project.tools)}

                            </div>
                        `
                        : ""
                }


                <div class="project-card-actions">

                    <button
                        class="btn-edit edit-project-btn"
                        data-id="${escapeHTML(project.id)}"
                    >
                        ✏️ تعديل
                    </button>


                    <button
                        class="btn-delete delete-project-btn"
                        data-id="${escapeHTML(project.id)}"
                    >
                        🗑️ حذف
                    </button>


                    ${
                        project.projectLink
                            ? `
                                <a
                                    href="${escapeHTML(project.projectLink)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn-view"
                                >
                                    🔗 المشروع
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

    const editButtons =
        document.querySelectorAll(
            ".edit-project-btn"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-project-btn"
        );


    editButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const projectId =
                    button.dataset.id;

                await editProject(
                    projectId
                );

            }
        );

    });


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const projectId =
                    button.dataset.id;

                await deleteProject(
                    projectId
                );

            }
        );

    });

}


/* =========================================================
   EDIT PROJECT
   ========================================================= */

async function editProject(projectId) {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            );


        let selectedProject = null;


        snapshot.forEach((documentSnapshot) => {

            if (
                documentSnapshot.id ===
                projectId
            ) {

                selectedProject = {

                    id: documentSnapshot.id,

                    ...documentSnapshot.data()

                };

            }

        });


        if (!selectedProject) {

            alert(
                "لم يتم العثور على المشروع."
            );

            return;

        }


        openEditProjectModal(
            selectedProject
        );


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

async function deleteProject(projectId) {

    const confirmed =
        confirm(
            "هل أنت متأكد من حذف هذا المشروع؟\n\nلا يمكن التراجع عن هذه العملية."
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
            "تم حذف المشروع بنجاح."
        );


        await loadProjects();

        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Delete project error:",
            error
        );


        alert(
            "حدث خطأ أثناء حذف المشروع.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   PROJECT COUNT
   ========================================================= */

function updateProjectCount(count) {

    if (projectsCount) {

        projectsCount.textContent =
            count;

    }

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
                    "projects"
                )
            );


        if (projectsCount) {

            projectsCount.textContent =
                projectsSnapshot.size;

        }


        /*

        Certificates and Courses and Skills
        will be connected later.

        */

        if (certificatesCount) {

            certificatesCount.textContent =
                "0";

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
   ADD PROJECT BUTTON
   ========================================================= */

if (addProjectBtn) {

    addProjectBtn.addEventListener(
        "click",
        openAddProjectModal
    );

}


/* =========================================================
   OTHER ADD BUTTONS
   ========================================================= */

if (addCertificateBtn) {

    addCertificateBtn.addEventListener(
        "click",
        () => {

            openModal(
                "إضافة شهادة",
                `
                    <div class="empty-state">

                        <div class="empty-icon">
                            🎓
                        </div>

                        <h3>
                            قسم الشهادات قادم
                        </h3>

                        <p>
                            سنربط الشهادات بـ Firestore في الخطوة القادمة.
                        </p>

                    </div>
                `
            );

        }
    );

}


if (addCourseBtn) {

    addCourseBtn.addEventListener(
        "click",
        () => {

            openModal(
                "إضافة كورس",
                `
                    <div class="empty-state">

                        <div class="empty-icon">
                            📚
                        </div>

                        <h3>
                            قسم الكورسات قادم
                        </h3>

                        <p>
                            سنضيف إدارة الكورسات والروابط لاحقًا.
                        </p>

                    </div>
                `
            );

        }
    );

}


if (addSkillBtn) {

    addSkillBtn.addEventListener(
        "click",
        () => {

            openModal(
                "إضافة مهارة",
                `
                    <div class="empty-state">

                        <div class="empty-icon">
                            🛠️
                        </div>

                        <h3>
                            قسم المهارات قادم
                        </h3>

                        <p>
                            سنضيف إدارة المهارات لاحقًا.
                        </p>

                    </div>
                `
            );

        }
    );

}


/* =========================================================
   AUTHENTICATION GUARD
   ========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        if (user.uid !== ADMIN_UID) {

            console.warn(
                "Unauthorized user:",
                user.uid
            );


            try {

                await signOut(auth);

            } catch (error) {

                console.error(
                    "Sign out error:",
                    error
                );

            }


            window.location.href =
                "login.html";

            return;

        }


        /* =================================================
           AUTHORIZED ADMIN
           ================================================= */

        console.log(
            "Admin authenticated:",
            user.email
        );


        await loadProjects();

        await updateDashboardStats();

    }
);


/* =========================================================
   INITIAL SECTION
   ========================================================= */

showSection("dashboardSection");


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "Samir Portfolio Admin Dashboard loaded."
);