import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import icon from '../components/assets/icon.png';
import { GiChart } from 'react-icons/gi';
import { HiOutlineUserAdd } from 'react-icons/hi'
import { RiMessage2Line } from 'react-icons/ri'
import { AiOutlineUnorderedList } from 'react-icons/ai';
import { CgImport } from 'react-icons/cg';
import { TbReportMoney } from 'react-icons/tb'
import { Link } from "react-router-dom";

import AdminSideMenu from "../components/AdminNavbar/SideMenu";
import TopBar from "../components/Topbar/TopBar";
import Slider from "../components/Slider/Slider";

function Dashboard() {
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
    <><TopBar></TopBar>
      <div className='header'>
        <h1>Dashboard</h1>
      </div>
      <Slider />
      <Link to="/message">
        <div className='container2'>
          <div className='header'>Message</div>
          <RiMessage2Line className='icon' />
          <div className='description'>
            Contact employees.
          </div>
        </div>
      </Link>
      <Link to="/admin/usermanagement">
        <div className='container1'>
          <div className='header'>Manage accounts</div>
          <AiOutlineUnorderedList className="icon" />
          <div className='description'>
            Checkout branches and manage their accounts.
          </div>
        </div>
      </Link>
      <Link to="/storage">
        <div className='container3'>
          <div className='header'>Import</div>
          <CgImport className="icon" />
          <div className='description'>
            Supplies can get low sometimes.
            <div />
            Import more here.
          </div>
        </div>
      </Link>
      <Link to="/report/details">
        <div className='container4'>
          <div className='header'>Detail Report</div>
          <TbReportMoney className="icon" />
          <div className='description'>
            See how branches are doing.
          </div>
        </div>
      </Link>
      <AdminSideMenu></AdminSideMenu>
    </>
  );
}
export default Dashboard;
