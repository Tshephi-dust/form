// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn5P-JUEOtMENzobvzkn8H0idvOMpLf_4",
  authDomain: "dust14.firebaseapp.com",
  projectId: "dust14",
  storageBucket: "dust14.firebasestorage.app",
  messagingSenderId: "368154085876",
  appId: "1:368154085876:web:346af2e31e8eecfe8b11a1",
  measurementId: "G-E984NRK8V1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// GET ELEMENTS
const email = document.getElementById("email");
const password = document.getElementById("password");
const imageInput = document.getElementById("imageInput");
const captionInput = document.getElementById("captionInput");

const authBox = document.getElementById("authBox");
const uploadBox = document.getElementById("uploadBox");
const feed = document.getElementById("feed");

// AUTH
function signUp(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(() => alert("Account created ✅"))
    .catch(err => alert(err.message));
}

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => alert("Logged in ✅"))
    .catch(err => alert(err.message));
}

function logout(){
  auth.signOut().then(() => alert("Logged out"));
}

// STATE
firebase.auth().onAuthStateChanged(user => {
  if(user){
    authBox.style.display = "none";
    uploadBox.style.display = "block";
    loadPosts();
  } else {
    authBox.style.display = "block";
    uploadBox.style.display = "none";
  }
});

// UPLOAD
async function uploadPost(){
  const file = imageInput.files[0];
  const caption = captionInput.value;

  if(!file) return alert("Select image");

  try {
    const ref = storage.ref().child(Date.now()+file.name);
    await ref.put(file);
    const url = await ref.getDownloadURL();

    await db.collection("posts").add({
      image: url,
      caption: caption,
      created: Date.now()
    });

    captionInput.value = "";
    imageInput.value = "";
    loadPosts();
  } catch(err) {
    alert(err.message);
  }
}

// LOAD POSTS
async function loadPosts(){
  feed.innerHTML = "Loading...";

  try {
    const snapshot = await db.collection("posts")
      .orderBy("created","desc")
      .get();

    feed.innerHTML = "";

    snapshot.forEach(doc => {
      const post = doc.data();

      const div = document.createElement("div");
      div.className = "post";

      div.innerHTML = `
        <img src="${post.image}">
        <p>${post.caption}</p>
      `;

      feed.appendChild(div);
    });

  } catch(err) {
    feed.innerHTML = "Error loading posts";
    console.error(err);
  }
}

    feed.appendChild(div);
  });
}
