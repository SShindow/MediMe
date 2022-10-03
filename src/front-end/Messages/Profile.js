// import React from 'react';
// import {auth} from '../../firebase';
// import Camera from './svg/Camera';
// import avocado from '../components/assets/avocado.jpg';
// import {useState, useEffect} from 'react';
// import {storage, db} from '../../firebase';
// import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
// import {getDoc, doc, updateDoc} from 'firebase/firestore';

// function Profile() {
//   const [img, setImg] = useState("");
//   const [user, setUser] = useState("");

//   useEffect(() => {
//     getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
//       if (docSnap.exists) {
//         setUser(docSnap.data());
//       }
//     });

//     if (img) {
//       const uploadImg = async () => {
//         const imgRef = ref(
//           storage,
//           `avatar/${new Date().getTime()} - ${img.name}`
//         );
//         try {
//           if (user.avatarPath) {
//             await deleteObject(ref(storage, user.avatarPath));
//           }
//           const snap = await uploadBytes(imgRef, img);
//           const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

//           await updateDoc(doc(db, "users", auth.currentUser.uid), {
//             avatar: url,
//             avatarPath: snap.ref.fullPath,
//           });

//           setImg("");
//         } catch (err) {
//           console.log(err.message);
//         }
//       };
//       uploadImg();
//     }
//   }, [img]);

//   return user ? (
//     <div>
//         <div className="profile_container">
//             <div className="img_container">
//                 <img src= {user.avatar || avocado} alt="avatar" />
//                 <div className="overlay">
//                     <div>
//                         <label htmlFor="photo">
//                             <Camera/>
//                         </label>
//                         <input type="file" 
//                         accept="image/*" 
//                         style={{display:"none"}} 
//                         id='photo' 
//                         onChange={(e)=> setImg(e.target.files[0])} 
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='text_container'>
//                 <h3>{user.name}</h3>
//                 <p>{user.email}</p>
//             </div>
//         </div>
//     </div>
//   ): null;
// }

// export default Profile;