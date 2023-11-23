const togglePasswordVisibility = (eyeIcon, passwordField) => {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.src = "Asset/Images/eye-open.png";
  } else {
    passwordField.type = "password";
    eyeIcon.src = "Asset/Images/eye-close.png";
  }
}

let eyeIcon = document.getElementById("eyeIcon");
let password = document.getElementById("password");

eyeIcon.onclick = () => {
  togglePasswordVisibility(eyeIcon, password);
};

let eyeIconOne = document.getElementById("eyeIconOne");
let passwordOne = document.getElementById("passwordOne");

eyeIconOne.onclick = () => {
  togglePasswordVisibility(eyeIconOne, passwordOne);
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPYgXHe7d0Y31Y5_0aC1UApn2RLE-dGBE",
  authDomain: "first-project-6faa0.firebaseapp.com",
  projectId: "first-project-6faa0",
  storageBucket: "first-project-6faa0.appspot.com",
  messagingSenderId: "646063922778",
  appId: "1:646063922778:web:8ba934e954ade917de4263",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const signUp = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      if (user) {
        window.location.href = "sign_in_page.html";
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
window.signUp = signUp;

const signIn = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.log(error);
    });
};
window.signIn = signIn;

const signInGoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      if (result) {
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("Google Verified");
        });
        window.location.href = "dashboard.html";
      } else {
        console.log("Email not verified");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
window.signInGoogle = signInGoogle;

const signInGitHub = () => {
  signInWithPopup(auth, githubProvider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      if (result) {
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("GitHub Verified");
        });
        window.location.href = "dashboard.html";
      } else {
        console.log("Email not verified");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
window.signInGitHub = signInGitHub;
