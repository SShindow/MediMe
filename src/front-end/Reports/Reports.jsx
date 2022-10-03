import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import SideMenu from '../components/Navbar/SideMenu';
import { Button } from 'antd'
import './Reports.css'
import Import from './fake_monthly_imports_data.json'
import Export from './fake_monthly_sales_data.json'
import ImportYearly from './fake_yearly_imports_data.json'
import ExportYearly from './fake_yearly_sales_data.json'
import LineChart from '../components/LineChart/LineChart';
import Medicine from '../components/assets/medicine.png'
import Sold from '../components/assets/sold.png'
import Money from '../components/assets/money.png'
import { Link } from 'react-router-dom';

import TopBar from '../components/Topbar/TopBar';
import { async } from '@firebase/util';

import Details from './Details';

function Reports() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Monthly progress");
  const [userData, setUserData] = useState({
    labels: [...Import].map((data) => data.day),
    datasets: [
      {
        label: "Import",
        data: [...Import].map((data) => data.value),
        backgroundColor: [
          "rgba(75,192,192,1)",
        ],
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
      {
        label: "Export",
        data: [...Export].map((data) => data.value),
        backgroundColor: [
          "#0A3C6C",
        ],
        borderColor: "#0A3C6C",
        borderWidth: 2,
      }
    ],
  });

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
    console.log(selected)
    if(selected === "Monthly progress"){
      changeToMonthly();
    }
    else if (selected === "Yearly progress") {
      changeToYearly();
    }
  },[selected])

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();

  }, [user, loading]);

  

  const changeToYearly = async () => setUserData({
    labels: [...ImportYearly].map((data) => data.month),
    datasets: [
      {
        label: "Import",
        data: [...ImportYearly].map((data) => data.value),
        backgroundColor: [
          "rgba(75,192,192,1)",
        ],
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
      {
        label: "Export",
        data: [...ExportYearly].map((data) => data.value),
        backgroundColor: [
          "#0A3C6C",
        ],
        borderColor: "#0A3C6C",
        borderWidth: 2,
      }
    ],


  });

  const changeToMonthly = async () => setUserData({
    labels: [...Import].map((data) => data.day),
    datasets: [
      {
        label: "Import",
        data: [...Import].map((data) => data.value),
        backgroundColor: [
          "rgba(75,192,192,1)",
        ],
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
      {
        label: "Export",
        data: [...Export].map((data) => data.value),
        backgroundColor: [
          "#0A3C6C",
        ],
        borderColor: "#0A3C6C",
        borderWidth: 2,
      }
    ],


  });


  return (
    <>
      <TopBar></TopBar>
      <div className='header'>
        <h1>Reports</h1>
      </div>
      <div className='pseudo-menu'>
        <div className='menu-item-active'>
          Overview
        </div>
        <div className='menu-item'>
          <Link to='/report/details' style={{ textDecoration: 'none' }}>Details</Link>
        </div>
      </div>
      <div className='import-container'>
        <div className='header'>Total Imported Product</div>
        <img src={Medicine}></img>
        <div className='import-data'>
          <div className='import-data-info'>1,134</div>
          <div className='import-data-data'>items</div>
        </div>
      </div>
      <div className='export-container'>
        <div className='header'>Total Sold Product</div>
        <img src={Sold}></img>
        <div className='export-data'>
          <div className='export-data-info'>15.5M</div>
          <div className='export-data-data'>items</div>
        </div>
      </div>
      <div className='earning-container'>
        <div className='header'>Total Earning</div>
        <img src={Money}></img>
        <div className='earning-data'>
          <div className='earning-data-info'>50,057</div>
          <div className='earning-data-data'>VND</div>
        </div>
      </div>
      <div className='graph'>
        <div className="dropdown">
          <select onChange={(event) => {setSelected(event.target.value);
          }} value={selected} className='dropdown'>
            <option value="Monthly progress">Monthly progress</option>
            <option value="Yearly progress">Yearly progress</option>
            <option value="3">Lifetime progress</option>
          </select>
        </div>
        <LineChart
          chartData={userData} />
      </div>
      <SideMenu></SideMenu>
    </>
  )
}

export default Reports
