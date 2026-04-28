// 🔥 PUT YOUR FIREBASE CONFIG HERE
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// AUTH
function signUp(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
}

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
}

function logout(){
  auth.signOut();
}

// STATE
const authBox = document.getElementById("authBox");
const uploadBox = document.getElementById("uploadBox");
const feed = document.getElementById("feed");

auth.onAuthStateChanged(user => {
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

  const ref = storage.ref().child(Date.now()+file.name);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  await db.collection("posts").add({
    image: url,
    caption: caption,
    created: Date.now()
  });

  captionInput.value = "";
  loadPosts();
}

// LOAD POSTS
async function loadPosts(){
  feed.innerHTML = "";

  const snapshot = await db.collection("posts")
    .orderBy("created","desc")
    .get();

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
}
