import { onSnapshot, query } from 'firebase/firestore';
import React from 'react'
import {useEffect, useState} from 'react';
import {db} from '../../firebase';
import {collection, where} from 'firebase/firestore'
import UserState from './UserState';
import './UserState.css';

function UserInfo() {
    const [activeUsers, setActiveUsers] = useState([]);
    const [inactiveUsers, setInactiveUsers] = useState([]);
 
    useEffect(() => {
        const userRef = collection(db, "users");
        const q = query(userRef, where('isOnline','==',true))

        onSnapshot(q, (querySnapshot) => {
            let activeUsers = []
            querySnapshot.forEach((doc) => {
                activeUsers.push({...doc.data(), id:doc.id})
            })
            setActiveUsers(activeUsers);
        });
    },[])

    useEffect(() => {
        const userRef = collection(db, "users");
        const q = query(userRef, where('isOnline','==',false))

        onSnapshot(q, (querySnapshot) => {
            let inactiveUsers = []
            querySnapshot.forEach((doc) => {
                inactiveUsers.push({...doc.data(), id:doc.id})
            })
            setInactiveUsers(inactiveUsers);
        });
    },[])


  return (
    <div className='Activity'>
        <p id='Active'>Active users</p>
        <div className='active'>
            {activeUsers.map((user)=> <UserState key={user.uid} photoURL={user.avatar} displayName={user.name} state='success' id={user.uid} email={user.email}/>)}
        </div>

        <p className='inactive-title' id='Inactive' style = {{ top: '269px'}}>Inactive users</p>
        <div className='inactive'>
            {inactiveUsers.map((user)=> <UserState key={user.uid} photoURL={user.avatar} displayName={user.name} state='error' id={user.uid} email={user.email}/>)}
        </div>
    </div>
  )
}

export default UserInfo