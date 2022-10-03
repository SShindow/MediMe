import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import SideMenu from '../components/Navbar/SideMenu';
import './Details.css'
import { Link } from 'react-router-dom';

import TopBar from '../components/Topbar/TopBar';

import Dropdown_Details from '../Reports/Dropdown_Details';
import ImportTable from '../Reports/ImportTable';

function Reports() {
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
    <>
      <TopBar></TopBar>
      <div className='header'>
        <h1>Reports</h1>
      </div>
      <div className='pseudo-menu-2'>
        <div className='menu-item'>
          <Link to='/report/overview' style={{ textDecoration: 'none' }}>Overview</Link>
        </div>
        <div className='menu-item-active'>
          Details
        </div>
      </div>
      <SideMenu></SideMenu>
      <div className='tableName'>
        <Dropdown_Details></Dropdown_Details>
      </div>
      <div>
      </div>
      <div className="table-container">
        <ImportTable/>
      </div>
    </>
  )
}

export default Reports
