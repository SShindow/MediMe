import React, { useContext } from 'react'
import UserContextProvider, { UserContext } from './UserContext/UserContextProvider';
import "./UserManagement.css";
import "./Filter.css";


function Filter() {
    const {userName, setUserName} = useContext(UserContext);

  return (
    <div className='filter_user'>
        <span>
            <input
            type="text"
            placeholder="Search..."
            onChange={(e)=>{setUserName(e.target.value)}}
            />
      </span>
        
    </div>
  )
}

export default Filter