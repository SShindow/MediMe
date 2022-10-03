import { initializeApp} from "firebase/app";
import 'firebase/firestore';
import {
 GoogleAuthProvider,
 getAuth,
 signInWithPopup,
 signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
 sendPasswordResetEmail,
 signOut,
 deleteUser
} from "firebase/auth";
import {
 getFirestore,
 query,
 getDocs,
 collection,
 where,
 addDoc,
 updateDoc,
 doc,
 FieldPath
} from "firebase/firestore";

import {getStorage} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { create, update } from "lodash";

// This is for temporary project
const firebaseConfig = {
  apiKey: "AIzaSyBM9cjaQ5HfW7D_X2EkgwSP_117VBiOsGM",
  authDomain: "medime-7b20e.firebaseapp.com",
  projectId: "medime-7b20e",
  storageBucket: "medime-7b20e.appspot.com",
  messagingSenderId: "785349721770",
  appId: "1:785349721770:web:a87d6b6a4e104e4a5f5ad3",
  measurementId: "G-5L370SJD29"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid",'==',user?.uid));
      const data = await getDocs(q);
      const id = data.docs[0].id;
      updateDoc(doc(db, "users", id),{
        isOnline: true,
      })
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const createUser = async(email, password, name, branch) => {
  try{
    let originalUser = auth.currentUser;
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const usercreated = res.user;
    await addDoc(collection(db, 'users'), {
      name: name, 
      email: email, 
      uid: usercreated.uid, 
      isOnline: false, 
      role: 'employee', 
      avatar: 'https://firebasestorage.googleapis.com/v0/b/medime-7b20e.appspot.com/o/avatar%2F1653204181074%20-%20peavo.jpg?alt=media&token=6233715c-2028-440d-8539-383ddb4fe2d2',
      avatarPath: 'avatar/1654926953315 - avocado.png',
      branch: branch})

    auth.updateCurrentUser(originalUser);
    
  }catch(err){
    console.error(err);
    alert(err.message);
  }
}

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// const logout = () => {
//     const res = signOut(auth);
//     const user = res.user;
//     const navigate = useNavigate();
//     updateDoc(doc(db, 'users', user.uid),{
//       isOnline: false,
//     })

const logout = async (id) => {
  updateDoc(doc(db, "users", id),{
    isOnline: false,
  })
  signOut(auth);

};

export {
    auth,
    db,
    getAuth,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    createUser,
    sendPasswordReset,
    logout,
    storage,
    FieldPath, 
    deleteUser,
};