import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import SideMenu from '../components/Navbar/SideMenu';
import './Messages.css'
import RoomList from './RoomList';
import './RoomList.css'
import Chatwindow from './Chatwindow';
import UserInfo from './UserInfo';
import './UserInfo.css'
import AddRoomModal from './Modals/AddRoomModal';
import AppProvider from './Context/AppProvider';
import OpenMembersModal from './Modals/OpenMembersModal';
import InviteMemberModal from './Modals/InviteMemberModal';
import UserList from './UserList';
import TopBar from '../components/Topbar/TopBar';
import FindMembers from './FindMembers';
import FindGroups from './FindGroups';

function Messages() {

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
      <TopBar className='top-bar'/>
      <h1>Messages</h1>
      <AppProvider>
        <div class='grid_container'>

          { /*
          <div class='item1'>
            <>
              <div className='header'>
                <h1>Messages</h1>
              </div>
            <TopBar/><SideMenu></SideMenu>
            <TopBar></TopBar>
            </>
          </div>
          */ }

          <div class='item1'>
            <>
            <SideMenu></SideMenu>
            </>
          </div>

          <div class="item2">
            <FindMembers/>
            <UserList/>
            <FindGroups/>
            <RoomList />
            <AddRoomModal/>
            <OpenMembersModal/>
            <InviteMemberModal/>
          </div>

          <div class="item3">
            <Chatwindow/>
          </div>

          <div class="item4">
            <UserInfo/>
          </div>
    
        </div>
        
      </AppProvider>
    </>
  )
}

export default Messages