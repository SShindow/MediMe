import React, { useRef, useEffect } from 'react'
import { Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { formatRelative } from 'date-fns/esm';
import { auth } from '../../firebase';
import './Mess.css';

function formatDate(seconds) {
  let formattedDate = '';

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}


function Mess({ text, displayName, createdAt, photoURL, uid }) {

  const currentUserId = auth.currentUser.uid;

  if (currentUserId === uid) {
    return (
      <div className='chat-show'><div className='sender'>
        <Avatar size='large' src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      
        <p className='text-message-sender'>
          {text}
        </p>
        </div>
      </div>
    );

  }

  else {
    return (
      <div className='chat-show'>
        <div className='receiver'>
          <Avatar size='large' src={photoURL}>
            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography.Text className='author'>{displayName}</Typography.Text>
          <Typography.Text className='date'>
            {formatDate(createdAt?.seconds)}
          </Typography.Text>
        
        <p className='text-message-receiver'>
          {text}
        </p>
        </div>
      </div>
    );

  }


}

export default Mess