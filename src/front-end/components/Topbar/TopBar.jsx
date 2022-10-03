import React, { useState, useEffect } from 'react';
import Camera from './svg/Camera';
import * as AIIcons from 'react-icons/ai';
import { storage, auth, db, logout } from "../../../firebase";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getDoc, doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate, Link } from "react-router-dom";
import profilePic from '../assets/profile.png';
import * as BIIcons from 'react-icons/bi';
import './TopBar.css'

function TopBar() {
    const [open, setOpen] = useState(false);
    const [img, setImg] = useState("");
    const [user, setUser] = useState([]);
    const [id, setId] = useState();
    const navigate = useNavigate();

    useEffect(()=>{
        const q = query(collection(db, "users"), where('uid','==', auth.currentUser.uid));
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let user = [];
            querySnapshot.forEach((doc)=>{
                user.push({...doc.data(), id: doc.id});
            })
            if (user){
                setUser(user[0]);
                setId(user[0].id);
            }
            });
            return unsubscribe;
    }, [auth.currentUser.uid])

    useEffect(() => {

        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                );
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath));
                    }
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

                    await updateDoc(doc(db, "users", user.id), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                    });

                    setImg("");
                } catch (err) {
                    console.log(err.message);
                }
            };
            uploadImg();
        }
    }, [img]);


    return (
        <div className='top-menu'>
            <div className='notification'>
                <AIIcons.AiOutlineBell />
            </div>
            <div className='account' onClick={() => setOpen(!open)}>
                <div className='profile'>
                    <img src={user?.avatar || profilePic} alt="avatar" />
                </div>
                <div className='account-info'>
                    <div className='username'>{user.name}</div>
                    <div>{user?.email}</div>

                </div>
                <div className={`dropdown-menu ${(open ? "open" : "")}`}>
                    <ul>
                        <li>
                            <a className='profile-item'>
                                <div className='profile'>
                                    <img src={user?.avatar || profilePic} alt="avatar" />
                                    <div className="overlay">
                                        <div>
                                            <label htmlFor="photo">
                                                <Camera />
                                            </label>
                                            <input type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                id='photo'
                                                onChange={(e) => setImg(e.target.files[0])}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className='account-info'>
                                    <div className='username'>{user?.name}</div>
                                    <div>{user?.email}</div>
                                    <div className='small-text'>View account's information</div>

                                </div>
                            </a>
                        </li>
                        <li>
                            <a className='menu-item' onClick={()=>logout(id)}>
                                <div className='icon'>
                                    <BIIcons.BiLogOut></BIIcons.BiLogOut>
                                </div>
                                <span>Logout</span>

                            </a>
                        </li>
                    </ul>

                </div>
            </div>

        </div>
    )
}

export default TopBar
