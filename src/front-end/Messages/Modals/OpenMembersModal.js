import React, {useState, useContext} from 'react';
import {Form, Input, Modal, Avatar, Typography} from 'antd';
import { AppContext } from '../Context/AppProvider';
import {auth, db} from '../../../firebase';
import { addDoc, collection, Timestamp, arrayRemove, doc, updateDoc} from 'firebase/firestore';

function OpenMembersModal() {
    const {members, isOpenMembersVisible, setIsOpenmembersVisible, selectedRoomId} = useContext(AppContext);

    const handleOk = () => {
        setIsOpenmembersVisible(false);
    };
    
    const handleCancel = () => {
        setIsOpenmembersVisible(false);
    };

    const removeMember = (id) =>{
        const roomRef = doc(db, "rooms", selectedRoomId);
        updateDoc(roomRef, {
            members: arrayRemove(id)
        });
    }
  return (
    <div>
        <Modal title="Group Members" visible={isOpenMembersVisible} onOk={handleOk} onCancel={handleCancel}>
            {members.map((member)=> (
                <div key={member.uid}>
                    <Avatar src={member.avatar}>{member.avatar ? '' : member.name?.charAt(0)?.toUpperCase()}</Avatar>
                    <Typography.Text>{member.name}</Typography.Text>
                    <button className='remove-member' onClick={()=>removeMember(member.uid)}>Remove</button>
                </div>
            ))}
        </Modal>
    </div>
  )
}

export default OpenMembersModal