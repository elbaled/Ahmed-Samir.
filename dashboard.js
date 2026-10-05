/* =========================================================
   Samir Portfolio - Admin Dashboard
   Firebase + Firestore
   ========================================================= */

"use strict";


/* =========================================================
   Firebase
   ========================================================= */

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   DOM
   ========================================================= */

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const visitSiteButton = document.getElementById("visitSiteButton");
const logoutButton = document.getElementById("logoutButton");

const addProjectButton = document.getElementById("addProjectButton");
const emptyAddProjectButton = document.getElementById("emptyAddProjectButton");

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

const projectsContainer =
    document.getElementById("projectsContainer");

const certificatesContainer =
    document.getElementById("certificatesContainer");

const skillsContainer =
    document.getElementById("skillsContainer");

const projectsCount =
    document.getElementById("projectsCount");

const certificatesCount =
    document.getElementById("certificatesCount");

const skillsCount =
    document.getElementById("skillsCount");

const profileName =
    document.getElementById("profileName");

const profileTitle =
    document.getElementById("profileTitle");

const profileBio =
    document.getElementById("profileBio");


/* =========================================================
   Authentication
   ========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    console.log("Logged in:", user.email);
    console.log("User UID:", user.uid);

    await loadAllData();

});


/* =========================================================
   Navigation
   ========================================================= */

function showMessage(message) {

    console.log(message);

}


function activateSection(sectionName) {

    const sections =
        document.querySelectorAll(".dashboard-section");

    sections.forEach((section) => {

        section.classList.remove("active");

    });

    const target =
        document.getElementById(sectionName);

    if (target) {

        target.classList.add("active");

    }

}


/* =========================================================
   Sidebar Navigation
   ========================================================= */

document.querySelectorAll("[data-section]").forEach((button) => {

    button.addEventListener("click", () => {

        const sectionName =
            button.getAttribute("data-section");

        activateSection(sectionName);

        updatePageHeader(sectionName);

    });

});


/* =========================================================
   Page Header
   ========================================================= */

function updatePageHeader(sectionName) {

    const titles = {

        dashboard: {
            title: "Dashboard",
            subtitle: "Manage your portfolio"
        },

        projects: {
            title: "Projects",
            subtitle: "Manage portfolio projects"
        },

        certificates: {
            title: "Certificates",
            subtitle: "Manage your certificates"
        },

        skills: {
            title: "Skills",
            subtitle: "Manage your professional skills"
        },

        profile: {
            title: "Profile",
            subtitle: "Manage your personal information"
        }

    };


    const data =
        titles[sectionName] || titles.dashboard;


    if (pageTitle) {

        pageTitle.textContent = data.title;

    }


    if (pageSubtitle) {

        pageSubtitle.textContent = data.subtitle;

    }

}


/* =========================================================
   Visit Website
   ========================================================= */

if (visitSiteButton) {

    visitSiteButton.addEventListener("click", () => {

        window.open(
            "https://elbaled.github.io/AHMED-SAMIR-/",
            "_blank"
        );

    });

}


/* =========================================================
   Logout
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout error:", error);

            alert(
                "حدث خطأ أثناء تسجيل الخروج."
            );

        }

    });

}


/* =========================================================
   Load All Data
   ========================================================= */

async function loadAllData() {

    await Promise.all([

        loadProjects(),
        loadCertificates(),
        loadSkills(),
        loadProfile()

    ]);

}


/* =========================================================
   PROJECTS
   ========================================================= */

async function loadProjects() {

    if (!projectsContainer) {

        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(db, "projects")
            );


        projectsContainer.innerHTML = "";


        if (projectsCount) {

            projectsCount.textContent =
                snapshot.size;

        }


        if (snapshot.empty) {

            projectsContainer.innerHTML = `

                <div class="empty-state">

                    <h3>No Projects Yet</h3>

                    <p>
                        Add your first portfolio project.
                    </p>

                </div>

            `;

            return;

        }


        snapshot.forEach((item) => {

            const data = item.data();


            const card =
                document.createElement("div");

            card.className =
                "dashboard-card";


            card.innerHTML = `

                <div class="dashboard-card-content">

                    <h3>
                        ${escapeHTML(data.name || "Untitled Project")}
                    </h3>

                    <p>
                        ${escapeHTML(data.description || "")}
                    </p>

                    ${
                        data.link
                        ?
                        `
                        <a
                            href="${escapeAttribute(data.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            View Project
                        </a>
                        `
                        :
                        ""
                    }

                </div>

                <div class="dashboard-card-actions">

                    <button
                        class="secondary-button"
                        data-action="edit-project"
                        data-id="${item.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="danger-button"
                        data-action="delete-project"
                        data-id="${item.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            projectsContainer.appendChild(card);

        });


        attachProjectActions();


    } catch (error) {

        console.error(
            "Load projects error:",
            error
        );

        projectsContainer.innerHTML = `

            <div class="empty-state">

                <h3>Error Loading Projects</h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   Add Project
   ========================================================= */

async function addProject() {

    const name =
        prompt("اكتب اسم المشروع:");

    if (!name) {

        return;
    }


    const description =
        prompt("اكتب وصف المشروع:");

    if (description === null) {

        return;
    }


    const link =
        prompt("اكتب رابط المشروع:");

    if (link === null) {

        return;
    }


    try {

        await addDoc(

            collection(db, "projects"),

            {

                name: name.trim(),

                description:
                    description.trim(),

                link:
                    link.trim(),

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }

        );


        alert(
            "تمت إضافة المشروع بنجاح ✅"
        );


        await loadProjects();


    } catch (error) {

        console.error(
            "Add project error:",
            error
        );


        alert(
            "فشل إضافة المشروع:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   Project Actions
   ========================================================= */

function attachProjectActions() {

    document
        .querySelectorAll(
            '[data-action="delete-project"]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.getAttribute(
                            "data-id"
                        );


                    if (
                        !confirm(
                            "هل تريد حذف هذا المشروع؟"
                        )
                    ) {

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


                    } catch (error) {

                        console.error(
                            "Delete project error:",
                            error
                        );


                        alert(
                            "فشل حذف المشروع:\n\n" +
                            error.message
                        );

                    }

                }

            );

        });


    document
        .querySelectorAll(
            '[data-action="edit-project"]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.getAttribute(
                            "data-id"
                        );


                    await editProject(id);

                }

            );

        });

}


/* =========================================================
   Edit Project
   ========================================================= */

async function editProject(id) {

    try {

        const reference =
            doc(
                db,
                "projects",
                id
            );


        const snapshot =
            await getDoc(reference);


        if (!snapshot.exists()) {

            alert(
                "المشروع غير موجود."
            );

            return;

        }


        const data =
            snapshot.data();


        const name =
            prompt(
                "اسم المشروع:",
                data.name || ""
            );


        if (name === null) {

            return;

        }


        const description =
            prompt(
                "وصف المشروع:",
                data.description || ""
            );


        if (description === null) {

            return;

        }


        const link =
            prompt(
                "رابط المشروع:",
                data.link || ""
            );


        if (link === null) {

            return;

        }


        await updateDoc(

            reference,

            {

                name:
                    name.trim(),

                description:
                    description.trim(),

                link:
                    link.trim(),

                updatedAt:
                    serverTimestamp()

            }

        );


        alert(
            "تم تعديل المشروع بنجاح ✅"
        );


        await loadProjects();


    } catch (error) {

        console.error(
            "Edit project error:",
            error
        );


        alert(
            "فشل تعديل المشروع:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   CERTIFICATES
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
                    "certificates"
                )
            );


        certificatesContainer.innerHTML = "";


        if (certificatesCount) {

            certificatesCount.textContent =
                snapshot.size;

        }


        if (snapshot.empty) {

            certificatesContainer.innerHTML = `

                <div class="empty-state">

                    <h3>No Certificates Yet</h3>

                    <p>
                        Add your first certificate.
                    </p>

                </div>

            `;

            return;

        }


        snapshot.forEach((item) => {

            const data =
                item.data();


            const card =
                document.createElement("div");

            card.className =
                "dashboard-card";


            card.innerHTML = `

                <div class="dashboard-card-content">

                    <h3>
                        ${escapeHTML(
                            data.name ||
                            "Certificate"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            data.issuer ||
                            ""
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            data.year ||
                            ""
                        )}
                    </p>

                    ${
                        data.link
                        ?
                        `
                        <a
                            href="${escapeAttribute(data.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            View Certificate
                        </a>
                        `
                        :
                        ""
                    }

                </div>

                <div class="dashboard-card-actions">

                    <button
                        class="secondary-button"
                        data-action="edit-certificate"
                        data-id="${item.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="danger-button"
                        data-action="delete-certificate"
                        data-id="${item.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            certificatesContainer.appendChild(card);

        });


        attachCertificateActions();


    } catch (error) {

        console.error(
            "Load certificates error:",
            error
        );

    }

}


/* =========================================================
   Add Certificate
   ========================================================= */

async function addCertificate() {

    const name =
        prompt("اكتب اسم الشهادة:");

    if (!name) {

        return;

    }


    const issuer =
        prompt("اكتب الجهة المانحة:");

    if (issuer === null) {

        return;

    }


    const year =
        prompt("اكتب سنة الحصول على الشهادة:");

    if (year === null) {

        return;

    }


    const link =
        prompt("اكتب رابط الشهادة:");

    if (link === null) {

        return;

    }


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
                    issuer.trim(),

                year:
                    year.trim(),

                link:
                    link.trim(),

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }

        );


        alert(
            "تمت إضافة الشهادة بنجاح ✅"
        );


        await loadCertificates();


    } catch (error) {

        console.error(
            "Add certificate error:",
            error
        );


        alert(
            "فشل إضافة الشهادة:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   Certificate Actions
   ========================================================= */

function attachCertificateActions() {

    document
        .querySelectorAll(
            '[data-action="delete-certificate"]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.getAttribute(
                            "data-id"
                        );


                    if (
                        !confirm(
                            "هل تريد حذف هذه الشهادة؟"
                        )
                    ) {

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


                    } catch (error) {

                        console.error(
                            "Delete certificate error:",
                            error
                        );


                        alert(
                            "فشل حذف الشهادة:\n\n" +
                            error.message
                        );

                    }

                }

            );

        });


    document
        .querySelectorAll(
            '[data-action="edit-certificate"]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.getAttribute(
                            "data-id"
                        );


                    await editCertificate(id);

                }

            );

        });

}


/* =========================================================
   Edit Certificate
   ========================================================= */

async function editCertificate(id) {

    try {

        const reference =
            doc(
                db,
                "certificates",
                id
            );


        const snapshot =
            await getDoc(reference);


        if (!snapshot.exists()) {

            alert(
                "الشهادة غير موجودة."
            );

            return;

        }


        const data =
            snapshot.data();


        const name =
            prompt(
                "اسم الشهادة:",
                data.name || ""
            );


        if (name === null) {

            return;

        }


        const issuer =
            prompt(
                "الجهة المانحة:",
                data.issuer || ""
            );


        if (issuer === null) {

            return;

        }


        const year =
            prompt(
                "السنة:",
                data.year || ""
            );


        if (year === null) {

            return;

        }


        const link =
            prompt(
                "رابط الشهادة:",
                data.link || ""
            );


        if (link === null) {

            return;

        }


        await updateDoc(

            reference,

            {

                name:
                    name.trim(),

                issuer:
                    issuer.trim(),

                year:
                    year.trim(),

                link:
                    link.trim(),

                updatedAt:
                    serverTimestamp()

            }

        );


        alert(
            "تم تعديل الشهادة بنجاح ✅"
        );


        await loadCertificates();


    } catch (error) {

        console.error(
            "Edit certificate error:",
            error
        );


        alert(
            "فشل تعديل الشهادة:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   SKILLS
   ========================================================= */

async function loadSkills() {

    if (!skillsContainer) {

        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "skills"
                )
            );


        skillsContainer.innerHTML = "";


        if (skillsCount) {

            skillsCount.textContent =
                snapshot.size;

        }


        if (snapshot.empty) {

            skillsContainer.innerHTML = `

                <div class="empty-state">

                    <h3>No Skills Yet</h3>

                    <p>
                        Add your first skill.
                    </p>

                </div>

            `;

            return;

        }


        snapshot.forEach((item) => {

            const data =
                item.data();


            const card =
                document.createElement("div");

            card.className =
                "dashboard-card";


            card.innerHTML = `

                <div class="dashboard-card-content">

                    <h3>
                        ${escapeHTML(
                            data.name ||
                            "Skill"
                        )}
                    </h3>

                    <p>
                        Level:
                        ${escapeHTML(
                            data.level ||
                            ""
                        )}
                    </p>

                </div>

                <div class="dashboard-card-actions">

                    <button
                        class="secondary-button"
                        data-action="edit-skill"
                        data-id="${item.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="danger-button"
                        data-action="delete-skill"
                        data-id="${item.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            skillsContainer.appendChild(card);

        });


        attachSkillActions();


    } catch (error) {

        console.error(
            "Load skills error:",
            error
        );

    }

}


/* =========================================================
   Add Skill
   ========================================================= */

async function addSkill() {

    const name =
        prompt("اكتب اسم المهارة:");

    if (!name) {

        return;

    }


    const level =
        prompt(
            "اكتب مستوى المهارة، مثال: Beginner / Intermediate / Advanced:"
        );


    if (level === null) {

        return;

    }


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
                    level.trim(),

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }

        );


        alert(
            "تمت إضافة المهارة بنجاح ✅"
        );


        await loadSkills();


    } catch (error) {

        console.error(
            "Add skill error:",
            error
        );


        alert(
            "فشل إضافة المهارة:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   Skill Actions
   ========================================================= */

function attachSkillActions() {

    document
        .querySelectorAll(
            '[data-action="delete-skill"]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.getAttribute(
                            "data-id"
                        );


                    if (
                        !confirm(
                            "هل تريد حذف هذه المهارة؟"
                        )
                    ) {

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


                    } catch (error) {

                        console.error(
                            "Delete skill error:",
                            error
                        );


                        alert(
                            "فشل حذف المهارة:\n\n" +
                            error.message
                        );

                    }

                }

            );

        });


    document
        .querySelectorAll(
            '[data-action="edit-skill"]'
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        button.getAttribute(
                            "data-id"
                        );


                    await editSkill(id);

                }

            );

        });

}


/* =========================================================
   Edit Skill
   ========================================================= */

async function editSkill(id) {

    try {

        const reference =
            doc(
                db,
                "skills",
                id
            );


        const snapshot =
            await getDoc(reference);


        if (!snapshot.exists()) {

            alert(
                "المهارة غير موجودة."
            );

            return;

        }


        const data =
            snapshot.data();


        const name =
            prompt(
                "اسم المهارة:",
                data.name || ""
            );


        if (name === null) {

            return;

        }


        const level =
            prompt(
                "مستوى المهارة:",
                data.level || ""
            );


        if (level === null) {

            return;

        }


        await updateDoc(

            reference,

            {

                name:
                    name.trim(),

                level:
                    level.trim(),

                updatedAt:
                    serverTimestamp()

            }

        );


        alert(
            "تم تعديل المهارة بنجاح ✅"
        );


        await loadSkills();


    } catch (error) {

        console.error(
            "Edit skill error:",
            error
        );


        alert(
            "فشل تعديل المهارة:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   PROFILE
   ========================================================= */

async function loadProfile() {

    try {

        const reference =
            doc(
                db,
                "profile",
                "main"
            );


        const snapshot =
            await getDoc(reference);


        if (!snapshot.exists()) {

            return;

        }


        const data =
            snapshot.data();


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


    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );

    }

}


/* =========================================================
   Save Profile
   ========================================================= */

async function saveProfile() {

    try {

        await setDoc(

            doc(
                db,
                "profile",
                "main"
            ),

            {

                name:
                    profileName
                    ?
                    profileName.value.trim()
                    :
                    "",

                title:
                    profileTitle
                    ?
                    profileTitle.value.trim()
                    :
                    "",

                bio:
                    profileBio
                    ?
                    profileBio.value.trim()
                    :
                    "",

                updatedAt:
                    serverTimestamp()

            },

            {
                merge: true
            }

        );


        alert(
            "تم حفظ البروفايل بنجاح ✅"
        );


    } catch (error) {

        console.error(
            "Save profile error:",
            error
        );


        alert(
            "فشل حفظ البروفايل:\n\n" +
            error.message
        );

    }

}


/* =========================================================
   Button Events
   ========================================================= */

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


if (saveProfileButton) {

    saveProfileButton.addEventListener(
        "click",
        saveProfile
    );

}


/* =========================================================
   Utility - Escape HTML
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


/* =========================================================
   Utility - Escape Attribute
   ========================================================= */

function escapeAttribute(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   Initial Header
   ========================================================= */

updatePageHeader("dashboard");