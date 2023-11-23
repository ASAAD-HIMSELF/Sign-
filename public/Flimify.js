import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPYgXHe7d0Y31Y5_0aC1UApn2RLE-dGBE",
  authDomain: "first-project-6faa0.firebaseapp.com",
  projectId: "first-project-6faa0",
  storageBucket: "first-project-6faa0.appspot.com",
  messagingSenderId: "646063922778",
  appId: "1:646063922778:web:8ba934e954ade917de4263",
  databaseURL: "https://first-project-6faa0-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const index = 0;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    profileImage.innerHTML = `<img class="photoURL" src="${user?.photoURL}" width="100" alt="User's Photo">`;
    accountType.innerHTML = `<div class="d-flex">Google Account <button onclick="signO()">SIGN OUT</button></div>`;
    profileName.innerHTML = `${user?.displayName}`;
    profileEmail.innerHTML = `${user?.providerData[0].email}`;
  } else {
    window.location.href = "sign_in_page.html";
  }
});

const signO = () => {
  signOut(auth)
    .then(() => {
      console.log("Log out");
    })
    .catch((error) => {
      console.log(error);
    });
};
window.signO = signO;

const addTodo = () => {
  onAuthStateChanged(auth, (user) => {
    let userName = user.displayName;
    if (movieName.value !== "" && genre.value !== "" && yearOfRelease.value !== "" && fileInput.value !== "") {
      let todoObj = {
        movie: movieName.value,
        genre: genre.value,
        year: yearOfRelease.value,
        file: fileInput.value,
      };
      movieName.value = "";
      genre.value = "";
      yearOfRelease.value = "";
      fileInput.value = "";
      console.log(todoObj);
      let dbref = ref(database, `allTodos/${index}`);
      set(dbref, todoObj);
      let done = set;
      if (done) {
        alert("saved");
      } else {
        alert("failed to save");
      }
    } else {
      alert("Ko sise o!");
    }
  });
};
window.addTodo = addTodo;

let dbref = ref(database, "allTodos");
onValue(dbref, (snapshot) => {
  const data = snapshot.val;
  console.log(data);
  index = Object.keys(data).length;
  console.log(index);
  data.map(
    (todoObj, index) =>
      (display.innerHTML += 
        `<div class="parent">
            <div class="card">
                <div class="content-box">
                    <span class="card-title">${todoObj.movie}</span>
                    <span class="see-more${todoObj.genre}</span>
                    <span class="see-more">${todoObj.year}</span>
                </div>
                <div class="date-box">
                    <h1 class="serialNumber">${index + 1}</h1>
                    <span class="date">${todoObj.file}</span>
                </div>
            </div>
        </div>`
        ));
});