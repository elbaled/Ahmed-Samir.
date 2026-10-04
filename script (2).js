/* =========================================================
   AHMED SAMIR PORTFOLIO
   Main JavaScript
========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const body = document.body;

const themeBtn =
    document.getElementById("themeBtn");

const menuBtn =
    document.getElementById("menuBtn");

const navbar =
    document.getElementById("navbar");

const navLinks =
    document.querySelectorAll(".nav-link");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const projectCards =
    document.querySelectorAll(".project-card");

const backToTop =
    document.getElementById("backToTop");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   CURRENT YEAR
========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && navbar) {

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("open");

        const isOpen =
            navbar.classList.contains("open");

        menuBtn.textContent =
            isOpen ? "✕" : "☰";

    });

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (navbar) {

            navbar.classList.remove("open");

        }

        if (menuBtn) {

            menuBtn.textContent = "☰";

        }

    });

});


/* =========================================================
   THEME
========================================================= */

const savedTheme =
    localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {

    body.classList.add("light-mode");

    if (themeBtn) {

        themeBtn.textContent = "☾";

    }

}


if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        body.classList.toggle("light-mode");

        const isLight =
            body.classList.contains("light-mode");

        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );

        themeBtn.textContent =
            isLight ? "☾" : "☀";

    });

}


/* =========================================================
   PROJECT FILTER
========================================================= */

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const filter =
            button.dataset.filter;


        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        projectCards.forEach((card) => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =========================================================
   BACK TO TOP
========================================================= */

window.addEventListener("scroll", () => {

    if (!backToTop) {
        return;
    }

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("main section[id]");


const updateActiveNavigation = () => {

    let currentSection = "";

    const scrollPosition =
        window.scrollY + 150;


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        const sectionId =
            section.getAttribute("id");


        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            currentSection = sectionId;

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");


        const target =
            link.getAttribute("href");


        if (
            target === `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

};


window.addEventListener(
    "scroll",
    updateActiveNavigation
);

updateActiveNavigation();


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const header =
    document.getElementById("header");


window.addEventListener("scroll", () => {

    if (!header) {
        return;
    }


    if (window.scrollY > 30) {

        header.style.boxShadow =
            "0 10px 35px rgba(0, 0, 0, 0.12)";

    } else {

        header.style.boxShadow =
            "none";

    }

});


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (navbar) {

            navbar.classList.remove("open");

        }

        if (menuBtn) {

            menuBtn.textContent = "☰";

        }

    }

});


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "Ahmed Samir Portfolio loaded successfully."
);
