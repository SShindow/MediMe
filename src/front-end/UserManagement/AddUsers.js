import React, { useContext } from 'react'
import {UserContext} from '../UserManagement/UserContext/UserContextProvider';
import AddUsersModal from './AddUsersModal';
import "./UserManagement";

function AddUsers() {
    const {setIsAddUsersVisible} = useContext(UserContext);

    const handleAddUser = () =>{
        setIsAddUsersVisible(true);
    };
  return (
    <div>
        <button className="btn-add-user" onClick={handleAddUser}>Add user</button>
        <AddUsersModal/>
    </div>
  )
}

export default AddUsers