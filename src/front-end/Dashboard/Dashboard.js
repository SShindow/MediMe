import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import icon from '../components/assets/icon.png';
import { GiHealthNormal, GiChart } from 'react-icons/gi';
import { TbReportMoney } from 'react-icons/tb';
import { RiMessage2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'

import SideMenu from "../components/Navbar/SideMenu";
import TopBar from "../components/Topbar/TopBar";
import Slider from "../components/Slider/Slider";
import AdminDashboard from "../AdminDashboard/Dashboard";

function Dashboard() {
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
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  if (role === "admin") {
    return (
      <AdminDashboard />
    )
  }
  else if (role === "employee") return (
    <><TopBar></TopBar>
      <div className='header'>
        <h1>Dashboard</h1>
      </div>
      <Slider />
      <Link to='/storage'>
        <div className='container1'>
          <div className='header'>Storage</div>
          <GiHealthNormal className='icon' />
          <div className='description'>
            Check what's still in stock.
          </div>
        </div>
      </Link>
      <Link to='/message'>
        <div className='container2'>
          <div className='header'>Message</div>
          <RiMessage2Line className="icon" />
          <div className='description'>
            Having trouble?
            <div />
            Ask your college for help.
          </div>
        </div>
      </Link>
      <Link to='/report/details'>
        <div className='container3'>
          <div className='header'>Detail Report</div>
          <TbReportMoney className="icon" />
          <div className='description'>
            Get daily detail report here.
          </div>
        </div>
      </Link>
      <Link to='/report/overview'>
        <div className='container4'>
          <div className='header'>Graph</div>
          <GiChart className="icon" />
          <div className='description'>
            See how your branch is performing.
          </div>
        </div>
      </Link>
      <SideMenu></SideMenu>
    </>
  );
}
export default Dashboard;
