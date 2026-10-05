/* =========================================================
   Ahmed Samir Portfolio - Admin Login
   ========================================================= */

"use strict";


import {
    auth
} from "./firebase.js";


import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginLoader =
    document.getElementById("loginLoader");

const loginMessage =
    document.getElementById("loginMessage");


/* =========================================================
   SHOW MESSAGE
   ========================================================= */

function showMessage(
    message,
    type = "error"
) {

    loginMessage.textContent = message;

    loginMessage.className =
        `login-message ${type}`;

}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoading(isLoading) {

    loginButton.disabled = isLoading;

    loginLoader.classList.toggle(
        "hidden",
        !isLoading
    );

    loginButtonText.textContent =
        isLoading
            ? "Signing In..."
            : "Sign In";
}


/* =========================================================
   TOGGLE PASSWORD
   ========================================================= */

togglePassword.addEventListener(
    "click",
    () => {

        const isPassword =
            passwordInput.type === "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        togglePassword.textContent =
            isPassword
                ? "Hide"
                : "Show";

    }
);


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            showMessage(
                "Please enter your email and password."
            );

            return;
        }


        setLoading(true);

        showMessage("");


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "dashboard.html";

                },
                700
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            let message =
                "Unable to sign in. Please check your details.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "Email or password is incorrect.";

            }


            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                message =
                    "No account was found with this email.";

            }


            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message =
                    "The password is incorrect.";

            }


            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Please enter a valid email address.";

            }


            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                message =
                    "Too many attempts. Please try again later.";

            }


            showMessage(message);

        }


        finally {

            setLoading(false);

        }

    }
);


/* =========================================================
   CHECK CURRENT LOGIN
   ========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            window.location.href =
                "dashboard.html";

        }

    }
);