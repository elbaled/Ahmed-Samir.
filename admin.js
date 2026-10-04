/* =========================================================
   SAMIR PORTFOLIO - ADMIN DASHBOARD
   Projects + Certificates + Authentication
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
   DOM
   ========================================================= */

const sidebar =
    document.getElementById("sidebar");

const menuToggle =
    document.getElementById("menuToggle");

const sidebarClose =
    document.getElementById("sidebarClose");

const navItems =
    document.querySelectorAll(".nav-item");

const sections =
    document.querySelectorAll(".admin-section");

const viewWebsiteBtn =
    document.getElementById("viewWebsiteBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const addProjectBtn =
    document.getElementById("addProjectBtn");

const addCertificateBtn =
    document.getElementById("addCertificateBtn");

const addCourseBtn =
    document.getElementById("addCourseBtn");

const addSkillBtn =
    document.getElementById("addSkillBtn");

const modal =
    document.getElementById("adminModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");

const projectsContainer =
    document.getElementById("projectsContainer");

const certificatesContainer =
    document.getElementById("certificatesContainer");

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

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            sidebar?.classList.add(
                "active"
            );

        }
    );

}


if (sidebarClose) {

    sidebarClose.addEventListener(
        "click",
        () => {

            sidebar?.classList.remove(
                "active"
            );

        }
    );

}


navItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                sidebar?.classList.remove(
                    "active"
                );

            }
        );

    }
);


/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function showSection(sectionId) {

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


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    const activeNav =
        document.querySelector(
            `.nav-item[data-section="${sectionId}"]`
        );


    if (activeNav) {

        activeNav.classList.add(
            "active"
        );

    }


    if (
        sectionId ===
        "projectsSection"
    ) {

        loadProjects();

    }


    if (
        sectionId ===
        "certificatesSection"
    ) {

        loadCertificates();

    }

}


navItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                const sectionId =
                    item.dataset.section;

                if (sectionId) {

                    showSection(
                        sectionId
                    );

                }

            }
        );

    }
);


/* =========================================================
   VIEW WEBSITE
   ========================================================= */

if (viewWebsiteBtn) {

    viewWebsiteBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

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


if (modalOverlay) {

    modalOverlay.addEventListener(
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


if (addProjectBtn) {

    addProjectBtn.addEventListener(
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

                    id: item.id,

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

        gis: "GIS",

        surveying: "Surveying",

        "remote-sensing":
            "Remote Sensing",

        programming:
            "Programming"

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
                    >
                        ✏️ تعديل
                    </button>


                    <button
                        class="btn-delete delete-project-btn"
                        data-id="${escapeHTML(
                            project.id
                        )}"
                    >
                        🗑️ حذف
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   PROJECT EVENTS
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


        let project = null;


        snapshot.forEach(
            (item) => {

                if (
                    item.id ===
                    projectId
                ) {

                    project = {

                        id: item.id,

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
                    placeholder="مثال: ArcGIS Pro Training"
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
                    placeholder="مثال: GeoSteps"
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

if (addCertificateBtn) {

    addCertificateBtn.addEventListener(
        "click",
        () => {

            openModal(
                "إضافة شهادة جديدة",
                getCertificateFormHTML()
            );


            attachCertificateFormEvents();

        }
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

                    id: item.id,

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
                    >
                        ✏️ تعديل
                    </button>


                    <button
                        class="btn-delete delete-certificate-btn"
                        data-id="${escapeHTML(
                            certificate.id
                        )}"
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
   CERTIFICATE EVENTS
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


        let certificate = null;


        snapshot.forEach(
            (item) => {

                if (
                    item.id ===
                    certificateId
                ) {

                    certificate = {

                        id: item.id,

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
            error
        );

        alert(
            "حدث خطأ أثناء حذف الشهادة:\n\n" +
            error.message
        );

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
   COURSES - TEMPORARY
   ========================================================= */

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
                            قسم الكورسات
                        </h3>

                        <p>
                            سنقوم بربط الكورسات بـ Firestore بعد الانتهاء من الشهادات.
                        </p>

                    </div>
                `
            );

        }
    );

}


/* =========================================================
   SKILLS - TEMPORARY
   ========================================================= */

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
                            قسم المهارات
                        </h3>

                        <p>
                            سنقوم بربط المهارات بـ Firestore لاحقًا.
                        </p>

                    </div>
                `
            );

        }
    );

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


        await loadProjects();

        await loadCertificates();

        await updateDashboardStats();

    }
);


/* =========================================================
   INITIAL SECTION
   ========================================================= */

showSection(
    "dashboardSection"
);


/* =========================================================
   READY
   ========================================================= */

console.log(
    "Samir Portfolio Admin loaded successfully."
);