import React, {useContext, useState} from 'react';
import { AppContext } from './Context/AppProvider';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function GroupMessState({roomId, roomName}) {
    const {setSelectedRoomId, setTargetChat} = useContext(AppContext);
    const [data, setData] = useState();

    if (roomId){
        const id_search = roomId;
  
        getDoc(doc(db, "lastMessageGroup", id_search)).then(docSnap => {
          if (docSnap.exists()) {
            setData(docSnap.data());
          } else {
            setData(null);
          }
        })
      }
  
      const handleOnClick = ()=>{
        if (roomId&&data){
          const id_search = roomId;
          updateDoc(doc(db, 'lastMessageGroup', id_search), {unread:false});
        }
      }

  return (
    <div>
        <button class='room_name' onClick={() => {setSelectedRoomId(roomId); setTargetChat("group"); handleOnClick()}}><b>{roomName}</b></button>
        {data && (
            <>
                {data.from !== auth.currentUser.uid && data.unread && (
                <small className='unread'>New</small>)}
            </>
            )}
        {data && (
            <>
                <strong>{data.from === auth.currentUser.uid ? "Me: " : "Friend: "}</strong>
                {data.text}
            </>
            )}
    </div>
  )
}

export default GroupMessState