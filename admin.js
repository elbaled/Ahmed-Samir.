/* =========================================================
   SAMIR PORTFOLIO - ADMIN DASHBOARD
   FULL FIRESTORE CRUD VERSION
   Projects + Certificates + Authentication

   IMPORTANT:
   Save / Edit buttons use EVENT DELEGATION.
   This is required because the forms are created dynamically.
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


/* =========================================================
   FIREBASE ERROR MESSAGE
   ========================================================= */

function getFirebaseErrorMessage(error) {

    if (!error) {

        return "خطأ غير معروف.";

    }


    const code =
        error.code || "";

    const message =
        error.message || "";


    console.error(
        "Firebase Error Code:",
        code
    );

    console.error(
        "Firebase Error Message:",
        message
    );


    if (
        code ===
        "permission-denied"
    ) {

        return (
            "Firebase رفض العملية بسبب الصلاحيات.\n\n" +

            "Admin UID المطلوب:\n" +

            ADMIN_UID +

            "\n\n" +

            "تأكد أن Firestore Rules منشورة Publish وأن UID الخاص بالحساب مطابق."
        );

    }


    if (
        code ===
        "unauthenticated"
    ) {

        return (
            "المستخدم غير مسجل الدخول في Firebase."
        );

    }


    if (
        code ===
        "not-found"
    ) {

        return (
            "المستند المطلوب غير موجود."
        );

    }


    if (
        code ===
        "invalid-argument"
    ) {

        return (
            "هناك بيانات غير صحيحة تم إرسالها إلى Firebase."
        );

    }


    if (
        code ===
        "failed-precondition"
    ) {

        return (
            "Firebase يحتاج إلى إعداد إضافي قبل تنفيذ العملية."
        );

    }


    if (
        code ===
        "unavailable"
    ) {

        return (
            "Firebase غير متاح حاليًا. تحقق من الإنترنت وحاول مرة أخرى."
        );

    }


    return (
        message ||
        "حدث خطأ غير معروف في Firebase."
    );

}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

function checkAdmin() {

    const user =
        auth.currentUser;


    console.log(
        "========================================"
    );

    console.log(
        "ADMIN CHECK"
    );

    console.log(
        "Current user:",
        user
    );


    if (!user) {

        console.error(
            "NO FIREBASE USER"
        );


        alert(
            "أنت غير مسجل الدخول في Firebase.\n\nسيتم إعادتك لصفحة تسجيل الدخول."
        );


        window.location.href =
            "login.html";


        return false;

    }


    console.log(
        "Current UID:",
        user.uid
    );

    console.log(
        "Required UID:",
        ADMIN_UID
    );


    if (
        user.uid !==
        ADMIN_UID
    ) {

        console.error(
            "UID DOES NOT MATCH"
        );


        alert(
            "هذا الحساب ليس حساب الأدمن.\n\nUID الحالي:\n" +
            user.uid
        );


        return false;

    }


    currentAdminUser =
        user;


    console.log(
        "ADMIN CHECK PASSED"
    );

    console.log(
        "========================================"
    );


    return true;

}


/* =========================================================
   FIREBASE CONNECTION TEST
   ========================================================= */

async function testFirebaseConnection() {

    console.log(
        "========================================"
    );

    console.log(
        "FIREBASE CONNECTION TEST"
    );


    try {

        const user =
            auth.currentUser;


        if (!user) {

            console.error(
                "Firebase Auth: NO USER"
            );

            return false;

        }


        console.log(
            "Firebase Auth: OK"
        );


        console.log(
            "UID:",
            user.uid
        );


        console.log(
            "Testing Firestore read..."
        );


        const projectsSnapshot =
            await getDocs(
                collection(
                    db,
                    PROJECTS_COLLECTION
                )
            );


        console.log(
            "Firestore read: OK"
        );


        console.log(
            "Projects documents:",
            projectsSnapshot.size
        );


        const certificatesSnapshot =
            await getDocs(
                collection(
                    db,
                    CERTIFICATES_COLLECTION
                )
            );


        console.log(
            "Certificates read: OK"
        );


        console.log(
            "Certificates documents:",
            certificatesSnapshot.size
        );


        console.log(
            "FIREBASE CONNECTION TEST PASSED"
        );


        console.log(
            "========================================"
        );


        return true;

    } catch (error) {

        console.error(
            "FIREBASE CONNECTION TEST FAILED",
            error
        );


        console.error(
            getFirebaseErrorMessage(
                error
            )
        );


        return false;

    }

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
   QUICK ACTIONS
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
   DATA ACTION EVENTS
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

            return;

        }


        if (
            action ===
            "add-certificate"
        ) {

            openAddCertificateModal();

            return;

        }


        if (
            action ===
            "add-course"
        ) {

            openCourseComingSoon();

            return;

        }


        if (
            action ===
            "add-skill"
        ) {

            openSkillComingSoon();

            return;

        }

    }
);


/* =========================================================
   IMPORTANT:
   DYNAMIC SAVE BUTTONS
   EVENT DELEGATION
   ========================================================= */

document.addEventListener(
    "click",
    async (event) => {

        const projectSaveButton =
            event.target.closest(
                "#saveProjectBtn"
            );


        if (projectSaveButton) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "========================================"
            );

            console.log(
                "PROJECT SAVE BUTTON DETECTED"
            );

            console.log(
                "========================================"
            );


            if (
                isSavingProject
            ) {

                console.warn(
                    "Project save already running."
                );

                return;

            }


            isSavingProject =
                true;


            projectSaveButton.disabled =
                true;


            projectSaveButton.textContent =
                "جاري الحفظ...";


            try {

                await saveProject();

            } catch (error) {

                console.error(
                    "PROJECT SAVE EVENT ERROR:",
                    error
                );


                alert(
                    "حدث خطأ أثناء حفظ المشروع:\n\n" +
                    getFirebaseErrorMessage(
                        error
                    )
                );

            } finally {

                isSavingProject =
                    false;


                const currentButton =
                    document.getElementById(
                        "saveProjectBtn"
                    );


                if (currentButton) {

                    currentButton.disabled =
                        false;


                    const projectId =
                        document.getElementById(
                            "projectId"
                        )?.value.trim() || "";


                    currentButton.textContent =
                        projectId
                            ? "حفظ التعديلات"
                            : "إضافة المشروع";

                }

            }


            return;

        }


        const certificateSaveButton =
            event.target.closest(
                "#saveCertificateBtn"
            );


        if (certificateSaveButton) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "========================================"
            );

            console.log(
                "CERTIFICATE SAVE BUTTON DETECTED"
            );

            console.log(
                "========================================"
            );


            if (
                isSavingCertificate
            ) {

                console.warn(
                    "Certificate save already running."
                );

                return;

            }


            isSavingCertificate =
                true;


            certificateSaveButton.disabled =
                true;


            certificateSaveButton.textContent =
                "جاري الحفظ...";


            try {

                await saveCertificate();

            } catch (error) {

                console.error(
                    "CERTIFICATE SAVE EVENT ERROR:",
                    error
                );


                alert(
                    "حدث خطأ أثناء حفظ الشهادة:\n\n" +
                    getFirebaseErrorMessage(
                        error
                    )
                );

            } finally {

                isSavingCertificate =
                    false;


                const currentButton =
                    document.getElementById(
                        "saveCertificateBtn"
                    );


                if (currentButton) {

                    currentButton.disabled =
                        false;


                    const certificateId =
                        document.getElementById(
                            "certificateId"
                        )?.value.trim() || "";


                    currentButton.textContent =
                        certificateId
                            ? "حفظ التعديلات"
                            : "إضافة الشهادة";

                }

            }


            return;

        }

    }
);


/* =========================================================
   DYNAMIC CANCEL BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const projectCancelButton =
            event.target.closest(
                "#cancelProjectBtn"
            );


        if (projectCancelButton) {

            event.preventDefault();

            event.stopPropagation();

            closeModal();

            return;

        }


        const certificateCancelButton =
            event.target.closest(
                "#cancelCertificateBtn"
            );


        if (certificateCancelButton) {

            event.preventDefault();

            event.stopPropagation();

            closeModal();

            return;

        }

    }
);


/* =========================================================
   PROJECT EDIT / DELETE DELEGATION
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const editButton =
            event.target.closest(
                ".edit-project-btn"
            );


        if (editButton) {

            event.preventDefault();

            editProject(
                editButton.dataset.id
            );

            return;

        }


        const deleteButton =
            event.target.closest(
                ".delete-project-btn"
            );


        if (deleteButton) {

            event.preventDefault();

            deleteProject(
                deleteButton.dataset.id
            );

            return;

        }

    }
);


/* =========================================================
   CERTIFICATE EDIT / DELETE DELEGATION
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const editButton =
            event.target.closest(
                ".edit-certificate-btn"
            );


        if (editButton) {

            event.preventDefault();

            editCertificate(
                editButton.dataset.id
            );

            return;

        }


        const deleteButton =
            event.target.closest(
                ".delete-certificate-btn"
            );


        if (deleteButton) {

            event.preventDefault();

            deleteCertificate(
                deleteButton.dataset.id
            );

            return;

        }

    }
);


/* =========================================================
   WEBSITE
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
                    getFirebaseErrorMessage(
                        error
                    )
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

        console.error(
            "MODAL ELEMENT NOT FOUND"
        );

        alert(
            "خطأ: نافذة الإضافة غير موجودة في admin.html."
        );

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


    console.log(
        "MODAL OPENED:",
        title
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
   PROJECT FORM HTML
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
            novalidate
            onsubmit="return false;"
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
                    type="text"
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
                    type="text"
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
                    type="button"
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

function openAddProjectModal() {

    console.log(
        "OPEN ADD PROJECT"
    );


    if (!checkAdmin()) {

        return;

    }


    openModal(
        "إضافة مشروع جديد",
        getProjectFormHTML()
    );


    console.log(
        "PROJECT FORM CREATED"
    );


    console.log(
        "SAVE BUTTON EXISTS:",
        !!document.getElementById(
            "saveProjectBtn"
        )
    );

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

    /*
       IMPORTANT:

       We intentionally do NOT attach a click listener
       to the dynamic save button here.

       The global document click listener above
       handles #saveProjectBtn.

       This prevents duplicate listeners.
    */


    console.log(
        "Project form ready for delegated events."
    );

}


/* =========================================================
   SAVE PROJECT
   ========================================================= */

async function saveProject() {

    console.log(
        "========================================"
    );

    console.log(
        "SAVE PROJECT STARTED"
    );


    if (!checkAdmin()) {

        return;

    }


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


    console.log(
        "PROJECT DATA:",
        {
            id,
            title,
            category,
            description,
            tools,
            status,
            imageUrl,
            projectLink
        }
    );


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


    const user =
        auth.currentUser;


    if (!user) {

        alert(
            "Firebase Auth غير متصل بالحساب الحالي."
        );

        return;

    }


    console.log(
        "CURRENT USER UID:",
        user.uid
    );


    if (
        user.uid !==
        ADMIN_UID
    ) {

        alert(
            "حساب Firebase الحالي ليس حساب الأدمن."
        );

        return;

    }


    const data = {

        title:
            title,

        category:
            category,

        description:
            description,

        tools:
            tools,

        status:
            status,

        imageUrl:
            imageUrl,

        projectLink:
            projectLink,

        updatedAt:
            serverTimestamp()

    };


    try {

        console.log(
            "Firebase write operation starting..."
        );


        if (id) {

            console.log(
                "UPDATING PROJECT:",
                id
            );


            await updateDoc(
                doc(
                    db,
                    PROJECTS_COLLECTION,
                    id
                ),
                data
            );


            console.log(
                "PROJECT UPDATE SUCCESS"
            );


            alert(
                "تم تعديل المشروع بنجاح."
            );

        } else {

            console.log(
                "ADDING NEW PROJECT"
            );


            data.createdAt =
                serverTimestamp();


            const newDocument =
                await addDoc(
                    collection(
                        db,
                        PROJECTS_COLLECTION
                    ),
                    data
                );


            console.log(
                "NEW PROJECT ID:",
                newDocument.id
            );


            alert(
                "تم إضافة المشروع بنجاح."
            );

        }


        closeModal();


        await loadProjects();


        await updateDashboardStats();


        console.log(
            "SAVE PROJECT FINISHED SUCCESSFULLY"
        );


    } catch (error) {

        console.error(
            "SAVE PROJECT ERROR:",
            error
        );


        alert(
            "فشل حفظ المشروع.\n\n" +
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

        }


        if (projectsCount) {

            projectsCount.textContent =
                projects.length;

        }


    } catch (error) {

        console.error(
            "LOAD PROJECTS ERROR:",
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
                        getFirebaseErrorMessage(
                            error
                        )
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
   EDIT PROJECT
   ========================================================= */

async function editProject(
    projectId
) {

    if (!checkAdmin()) {

        return;

    }


    if (!projectId) {

        alert(
            "معرف المشروع غير موجود."
        );

        return;

    }


    try {

        const projectReference =
            doc(
                db,
                PROJECTS_COLLECTION,
                projectId
            );


        const projectSnapshot =
            await getDoc(
                projectReference
            );


        if (
            !projectSnapshot.exists()
        ) {

            alert(
                "لم يتم العثور على المشروع."
            );

            return;

        }


        const project = {

            id:
                projectSnapshot.id,

            ...projectSnapshot.data()

        };


        openModal(
            "تعديل المشروع",
            getProjectFormHTML(
                project
            )
        );


        console.log(
            "PROJECT EDIT FORM OPENED:",
            project
        );

    } catch (error) {

        console.error(
            "EDIT PROJECT ERROR:",
            error
        );


        alert(
            "حدث خطأ أثناء تحميل المشروع.\n\n" +
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

        alert(
            "معرف المشروع غير موجود."
        );

        return;

    }


    const confirmed =
        confirm(
            "هل أنت متأكد من حذف المشروع؟\n\nلا يمكن التراجع عن هذه العملية."
        );


    if (!confirmed) {

        return;

    }


    try {

        console.log(
            "DELETING PROJECT:",
            projectId
        );


        await deleteDoc(
            doc(
                db,
                PROJECTS_COLLECTION,
                projectId
            )
        );


        console.log(
            "PROJECT DELETE SUCCESS"
        );


        alert(
            "تم حذف المشروع بنجاح."
        );


        await loadProjects();


        await updateDashboardStats();


    } catch (error) {

        console.error(
            "DELETE PROJECT ERROR:",
            error
        );


        alert(
            "فشل حذف المشروع.\n\n" +
            getFirebaseErrorMessage(
                error
            )
        );

    }

}


/* =========================================================
   CERTIFICATE FORM HTML
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
            novalidate
            onsubmit="return false;"
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
                    type="text"
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
                    type="text"
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
                    type="button"
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

function openAddCertificateModal() {

    console.log(
        "OPEN ADD CERTIFICATE"
    );


    if (!checkAdmin()) {

        return;

    }


    openModal(
        "إضافة شهادة جديدة",
        getCertificateFormHTML()
    );


    console.log(
        "CERTIFICATE FORM CREATED"
    );


    console.log(
        "SAVE CERTIFICATE BUTTON EXISTS:",
        !!document.getElementById(
            "saveCertificateBtn"
        )
    );

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

    /*
       Dynamic buttons are handled by
       the global document click listener.
    */


    console.log(
        "Certificate form ready for delegated events."
    );

}


/* =========================================================
   SAVE CERTIFICATE
   ========================================================= */

async function saveCertificate() {

    console.log(
        "========================================"
    );

    console.log(
        "SAVE CERTIFICATE STARTED"
    );


    if (!checkAdmin()) {

        return;

    }


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


    console.log(
        "CERTIFICATE DATA:",
        {
            id,
            title,
            issuer,
            date,
            description,
            imageUrl,
            certificateUrl
        }
    );


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


    const user =
        auth.currentUser;


    if (!user) {

        alert(
            "Firebase Auth غير متصل بالحساب الحالي."
        );

        return;

    }


    if (
        user.uid !==
        ADMIN_UID
    ) {

        alert(
            "حساب Firebase الحالي ليس حساب الأدمن."
        );

        return;

    }


    const data = {

        title:
            title,

        issuer:
            issuer,

        date:
            date,

        description:
            description,

        imageUrl:
            imageUrl,

        certificateUrl:
            certificateUrl,

        updatedAt:
            serverTimestamp()

    };


    try {

        if (id) {

            console.log(
                "UPDATING CERTIFICATE:",
                id
            );


            await updateDoc(
                doc(
                    db,
                    CERTIFICATES_COLLECTION,
                    id
                ),
                data
            );


            console.log(
                "CERTIFICATE UPDATE SUCCESS"
            );


            alert(
                "تم تعديل الشهادة بنجاح."
            );

        } else {

            console.log(
                "ADDING NEW CERTIFICATE"
            );


            data.createdAt =
                serverTimestamp();


            const newDocument =
                await addDoc(
                    collection(
                        db,
                        CERTIFICATES_COLLECTION
                    ),
                    data
                );


            console.log(
                "NEW CERTIFICATE ID:",
                newDocument.id
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
            "SAVE CERTIFICATE ERROR:",
            error
        );


        alert(
            "فشل حفظ الشهادة.\n\n" +
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

        }


        if (certificatesCount) {

            certificatesCount.textContent =
                certificates.length;

        }


    } catch (error) {

        console.error(
            "LOAD CERTIFICATES ERROR:",
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
                        getFirebaseErrorMessage(
                            error
                        )
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
   EDIT CERTIFICATE
   ========================================================= */

async function editCertificate(
    certificateId
) {

    if (!checkAdmin()) {

        return;

    }


    if (!certificateId) {

        alert(
            "معرف الشهادة غير موجود."
        );

        return;

    }


    try {

        const certificateReference =
            doc(
                db,
                CERTIFICATES_COLLECTION,
                certificateId
            );


        const certificateSnapshot =
            await getDoc(
                certificateReference
            );


        if (
            !certificateSnapshot.exists()
        ) {

            alert(
                "لم يتم العثور على الشهادة."
            );

            return;

        }


        const certificate = {

            id:
                certificateSnapshot.id,

            ...certificateSnapshot.data()

        };


        openModal(
            "تعديل الشهادة",
            getCertificateFormHTML(
                certificate
            )
        );


        console.log(
            "CERTIFICATE EDIT FORM OPENED:",
            certificate
        );

    } catch (error) {

        console.error(
            "EDIT CERTIFICATE ERROR:",
            error
        );


        alert(
            "حدث خطأ أثناء تحميل الشهادة.\n\n" +
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

        alert(
            "معرف الشهادة غير موجود."
        );

        return;

    }


    const confirmed =
        confirm(
            "هل أنت متأكد من حذف هذه الشهادة؟\n\nلا يمكن التراجع عن هذه العملية."
        );


    if (!confirmed) {

        return;

    }


    try {

        console.log(
            "DELETING CERTIFICATE:",
            certificateId
        );


        await deleteDoc(
            doc(
                db,
                CERTIFICATES_COLLECTION,
                certificateId
            )
        );


        console.log(
            "CERTIFICATE DELETE SUCCESS"
        );


        alert(
            "تم حذف الشهادة بنجاح."
        );


        await loadCertificates();


        await updateDashboardStats();


    } catch (error) {

        console.error(
            "DELETE CERTIFICATE ERROR:",
            error
        );


        alert(
            "فشل حذف الشهادة.\n\n" +
            getFirebaseErrorMessage(
                error
            )
        );

    }

}


/* =========================================================
   COURSES
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
                قسم الكورسات جاهز في لوحة التحكم،
                وسيتم ربطه بـ Firestore لاحقًا.
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
                    إدارة الكورسات سيتم ربطها بـ Firestore في الخطوة التالية.
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
   SKILLS
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
                إدارة المهارات سيتم ربطها بـ Firestore لاحقًا.
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
                    إدارة المهارات سيتم ربطها بـ Firestore في الخطوة التالية.
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

    console.log(
        "UPDATING DASHBOARD STATS"
    );


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


        console.log(
            "Dashboard stats updated:",
            {
                projects:
                    projectsSnapshot.size,

                certificates:
                    certificatesSnapshot.size
            }
        );


    } catch (error) {

        console.error(
            "DASHBOARD STATS ERROR:",
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

        console.log(
            "========================================"
        );

        console.log(
            "AUTH STATE CHANGED"
        );

        console.log(
            "USER:",
            user
        );


        if (!user) {

            console.warn(
                "NO FIREBASE USER"
            );


            window.location.href =
                "login.html";


            return;

        }


        console.log(
            "Logged user UID:",
            user.uid
        );


        console.log(
            "Expected admin UID:",
            ADMIN_UID
        );


        if (
            user.uid !==
            ADMIN_UID
        ) {

            alert(
                "هذا الحساب غير مصرح له بالدخول إلى لوحة الأدمن.\n\nUID الحالي:\n" +
                user.uid
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
            "ADMIN AUTHENTICATED SUCCESSFULLY"
        );


        await updateDashboardStats();


        await loadProjects();


        await loadCertificates();


        await testFirebaseConnection();


        console.log(
            "ADMIN DASHBOARD READY"
        );

        console.log(
            "========================================"
        );

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
    "========================================"
);

console.log(
    "Samir Portfolio Admin loaded successfully."
);

console.log(
    "Admin UID:",
    ADMIN_UID
);

console.log(
    "Firestore Projects:",
    PROJECTS_COLLECTION
);

console.log(
    "Firestore Certificates:",
    CERTIFICATES_COLLECTION
);

console.log(
    "Delegated Save Events: ENABLED"
);

console.log(
    "========================================"
);