import React, { useContext, useState } from 'react'
import { Avatar, Badge, Typography } from 'antd';
import styled from 'styled-components';
import { AppContext } from './Context/AppProvider';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  .author {
    margin-left: 5px;
    font-weight: bold;
  }
  &:hover {
    cursor:pointer
  }
  .text{
    margin-left: 5px;
  }
`;

function UserMessState({displayName, photoURL, id, state, user}) {

    const {setSelectedUserId, setTargetChat} = useContext(AppContext);
    const [data, setData] = useState();

    if (user&&id){
      const id_search = user > id ? `${user+id}`:`${id+user}`;

      getDoc(doc(db, "lastMsg", id_search)).then(docSnap => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(null);
        }
      })
    }

    const handleOnClick = ()=>{
      if (user&&id){
        const id_search = user > id ? `${user+id}`:`${id+user}`;
        updateDoc(doc(db, 'lastMsg', id_search), {unread:false});
      }
    }


    return (
        <WrapperStyled onClick={() => {setSelectedUserId(id); setTargetChat("user"); handleOnClick()}}>
          <div>
            <Badge dot status = {state===true? 'success':'error'}>
                <Avatar  src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
            </Badge>
            <Typography.Text className='author' >{displayName}</Typography.Text>
                {data && (
                <>
                  {data.from !== user && data.unread && (
                  <small className='unread'>New</small>)}
                </>
                )}
            <div>
              <Typography.Text className='text'>
                {data && (
                <>
                  <strong>{data.from === user ? "Me: " : "Friend: "}</strong>
                  {data.inputValue}
                </>
                )}
              </Typography.Text>
            </div>
          </div>
        </WrapperStyled>
    );
}

export default UserMessState