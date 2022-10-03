import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Storage.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import icon from '../components/assets/icon.png';

import TopBar from '../components/Topbar/TopBar';
import SideMenu from '../components/Navbar/SideMenu';

import CompleteTable from './CompleteTable';
import CompleteTableAdmin from './CompleteTable-Admin';


function Storage() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
            setRole(data.role);
            //console.log(data.name);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);
    if (role === "admin") {
        return (
            <>
                <TopBar></TopBar>
                <div className='header'>
                    <h1>Storage</h1>
                </div>
                <SideMenu></SideMenu>
                <div className="container">
                    <CompleteTableAdmin />
                </div>


            </>
        )
    } else if (role === "employee") return (
        <>
            <TopBar></TopBar>
            <div className='header'>
                <h1>Storage</h1>
            </div>
            <SideMenu></SideMenu>
            <div className="container">
                <CompleteTable />
            </div>


        </>
    )
}

export default Storage
