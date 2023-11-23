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
import {
  getStorage,
  ref as stref,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

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
const storage = getStorage(app);
let index = 0;

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
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  onAuthStateChanged(auth, (user) => {
    let userName = user.displayName;
    if (todo.value !== "" && todoDesc.value !== "" && myFile.files.length > 0) {
      let fileName = myFile.files[0].name;
      let todoObj = {
        todo: todo.value,
        desc: todoDesc.value,
        file: fileName,
        userName,
        date,
        time,
      };
      todo.value = "";
      todoDesc.value = "";
      let uploadedFile = myFile.files[0];
      console.log(todoObj);
      let dbref = ref(database, `allTodos/${index}`);
      let done = set(dbref, todoObj);
      console.log(done);
      const storageRef = stref(storage, `App/${todoObj.userName}/${fileName}`);
      let doneStorage = uploadBytesResumable(storageRef, uploadedFile);
      doneStorage.on("state_changed", (snapshot) => {
        let progress = snapshot.bytesTransferred;
        let total = snapshot.totalBytes;
        const showProgress = ((progress / total) * 100).toFixed(2);
        console.log(showProgress);
        if (showProgress < total) {
          progressBar.innerHTML = `<div class="alert alert-danger p-2">${showProgress}%</div>`;
        } else if (showProgress == 100) {
          progressBar.innerHTML = `<div class="alert alert-success p-2">${showProgress}%</div>`;

          setTimeout(() => {
            progressBar.style.display = "none";
          }, 3000);
        }
      });
      if (done && doneStorage) {
        saved.innerHTML = `<div class="alert alert-success p-2">Saved!</div>`;

        setTimeout(() => {
          saved.style.display = "none";
        }, 3000);
      } else {
        saved.innerHTML = `<div class="alert alert-danger p-2">Failed to save!</div>`;

        setTimeout(() => {
          saved.style.display = "none";
        }, 3000);
      }
    } else {
      alert("Ko sise o! Please fill in all fields and select a file.");
    }
  });
};
window.addTodo = addTodo;

let dbref = ref(database, "allTodos");
onValue(dbref, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  index = Object.keys(data).length;
  console.log(index);
  if (data) {
    const dataArray = Object.values(data);
    index = dataArray.length;
    display.innerHTML = dataArray.map(
      (todoObj, index) => `
            <div class="parent">
                <div class="card">
                    <div class="content-box">
                        <span class="card-title">${todoObj.userName}</span>
                        <span class="see-more">${todoObj.todo}</span>
                        <span class="see-more">${todoObj.desc}</span>
                        <span class="see-more">${todoObj.file}</span>
                    </div>
                    <div class="date-box">
                        <h2 class="serialNumber">${index + 1}</h2>
                        <span class="date">${todoObj.date}</span>
                        <span class="time">${todoObj.time}</span>
                    </div>
                </div>
            </div>`
    );
  }
});
