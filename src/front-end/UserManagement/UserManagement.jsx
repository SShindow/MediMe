import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import icon from '../components/assets/icon.png';
import AdminSideMenu from "../components/AdminNavbar/SideMenu";
import TopBar from "../components/Topbar/TopBar";
import AddUsers from "./AddUsers";
import UserContextProvider from "./UserContext/UserContextProvider";
import Datatable from "./usercomponents/Datatable";
import Filter from "./Filter";
import MemberCard from "./MemberCard";

function UserManagement() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (error) {
        console.log(error);
        }
    };
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);
  return (
    <UserContextProvider>
        <div>
            <TopBar></TopBar>
            <AdminSideMenu></AdminSideMenu>
            <div className='header'>
                User Management
            </div>
            <div className='admin-menu'>
                <div className='add-user'>
                    <AddUsers/> 
                </div>
                <div className="filter">
                    <Filter/>
                </div>              
                {/* <Filter/>
                <AddUsers/> */}

            </div>

            <div className="data_table">
                <Datatable/>
            </div>
            
        </div>
    </UserContextProvider>
    
  )
}

export default UserManagement;