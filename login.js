"use strict";

/* =========================================================
   Ahmed Samir Portfolio
   Admin Login
   ========================================================= */

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   ADMIN UID
   ========================================================= */

const ADMIN_UID = "Sszp0JmpjcQhpsg78kqh5VS8row1";


/* =========================================================
   DOM Elements
   ========================================================= */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");


/* =========================================================
   Message Helper
   ========================================================= */

function showMessage(message, type = "error") {

    loginMessage.textContent = message;

    loginMessage.className = "message " + type;

}


/* =========================================================
   Check Existing Login
   ========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        return;
    }


    /* -----------------------------------------------------
       Check Admin UID
       ----------------------------------------------------- */

    if (user.uid === ADMIN_UID) {

        showMessage(
            "You are already logged in. Redirecting...",
            "success"
        );


        setTimeout(() => {

            window.location.href = "admin.html";

        }, 700);


        return;
    }


    /* -----------------------------------------------------
       User is not the admin
       ----------------------------------------------------- */

    try {

        await signOut(auth);

    } catch (error) {

        console.error(
            "Sign out error:",
            error
        );

    }


    showMessage(
        "This account is not authorized as an administrator.",
        "error"
    );

});


/* =========================================================
   Login Form
   ========================================================= */

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    /* -----------------------------------------------------
       Get Values
       ----------------------------------------------------- */

    const email = emailInput.value.trim();
    const password = passwordInput.value;


    /* -----------------------------------------------------
       Basic Validation
       ----------------------------------------------------- */

    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    /* -----------------------------------------------------
       Disable Button
       ----------------------------------------------------- */

    loginButton.disabled = true;

    loginButton.textContent = "Signing in...";

    showMessage(
        "Checking your account...",
        "success"
    );


    try {

        /* -------------------------------------------------
           Firebase Login
           ------------------------------------------------- */

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        /* -------------------------------------------------
           Check Admin UID
           ------------------------------------------------- */

        if (user.uid !== ADMIN_UID) {

            await signOut(auth);


            showMessage(
                "Access denied. This account is not the portfolio administrator.",
                "error"
            );


            loginButton.disabled = false;

            loginButton.textContent = "Login";

            return;
        }


        /* -------------------------------------------------
           Successful Login
           ------------------------------------------------- */

        showMessage(
            "Login successful. Opening admin dashboard...",
            "success"
        );


        setTimeout(() => {

            window.location.href = "admin.html";

        }, 700);


    } catch (error) {

        console.error(
            "Firebase Login Error:",
            error
        );


        let message =
            "Login failed. Please check your email and password.";


        /* -------------------------------------------------
           Firebase Error Messages
           ------------------------------------------------- */

        switch (error.code) {

            case "auth/invalid-credential":

                message =
                    "Incorrect email or password.";

                break;


            case "auth/user-not-found":

                message =
                    "No account was found with this email.";

                break;


            case "auth/wrong-password":

                message =
                    "Incorrect password.";

                break;


            case "auth/invalid-email":

                message =
                    "Please enter a valid email address.";

                break;


            case "auth/too-many-requests":

                message =
                    "Too many attempts. Please try again later.";

                break;


            case "auth/network-request-failed":

                message =
                    "Network error. Check your internet connection.";

                break;


            default:

                message =
                    "Login failed. Please try again.";

                break;
        }


        showMessage(
            message,
            "error"
        );


        loginButton.disabled = false;

        loginButton.textContent = "Login";

    }

});