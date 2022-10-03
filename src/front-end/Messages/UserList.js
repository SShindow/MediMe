import React from 'react'
import { AppContext } from './Context/AppProvider'
import UserMessState from './UserMessState'
import {auth} from '../../firebase';
import FindMembers from './FindMembers';
import "./UserList.css"

function UserList() {
    const {recipients} = React.useContext(AppContext);
    const currentUser = auth.currentUser.uid;
  return (
    <div>
        <p id="user-list-headings">RECENT CHAT</p>
        <div className = 'UserList'>
            {recipients.map((recipient)=> <UserMessState key={recipient.uid} photoURL={recipient.avatar} displayName={recipient.name} id={recipient.uid} state={recipient.isOnline} user={currentUser}/>)}
        </div>

    </div>
  )
}

export default UserList