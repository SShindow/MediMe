import React from 'react'
import { AppContext } from './Context/AppProvider';
import GroupMessState from './GroupMessState';

function RoomList() {

    const {setIsAddRoomVisible, setSelectedRoomId, usersRoom, setTargetChat} = React.useContext(AppContext);

    const handleAddRoom = () =>{
        setIsAddRoomVisible(true);
    };


  return (
    // <div>
    //     <p><b>Group Chat</b></p>
    //     <div className='GROUP CHAT'>
    //         {usersRoom.map((room) => (<p key={room.id}><button class='room_name' onClick={() => {setSelectedRoomId(room.id); setTargetChat("group")}}>{room.name}</button></p>))}

    <div className="RoomList">
        <p id="group-list-headings">GROUP CHAT</p>
        <div className='GroupList'>
            {/* {usersRoom.map((room) => (<p><button class='room_name' onClick={() => {setSelectedRoomId(room.id); setTargetChat("group")}}>{room.name}</button></p>))} */}
            {usersRoom.map((room)=> <GroupMessState key={room.id} roomId={room.id} roomName={room.name}/>)}
            <button className='btn-addroom' type="button" onClick={handleAddRoom}>Add Room</button>
        </div>
    </div>
  )
}

export default RoomList