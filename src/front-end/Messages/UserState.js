import React, { useContext } from 'react';
import { Avatar, Badge, Typography, Popover } from 'antd';
// import styled from 'styled-components';
import { AppContext } from './Context/AppProvider';
// import WrapperStyled from './WrapperStyled';

/* const WrapperStyled = styled.div`
  margin-bottom: 10px;
  .author {
    margin-left: 5px;
    font-weight: bold;
  }
  &:hover {
    cursor:pointer
  }
`;
*/

function UserState({displayName, photoURL, state, id, email}) {
    const {setSelectedUserId, setTargetChat} = useContext(AppContext);
    const content = (
      <div>
        <p><b>Name:</b> {displayName}</p>
        <p><b>Email:</b> {email}</p>
      </div>
    );
    return (
      <Popover content={content} title="Information" trigger="hover">
        <div className='selection' onClick={() => {setSelectedUserId(id); setTargetChat("user")}}>
          <div>
            <Badge dot status={state}>
                <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
            </Badge>
            
            <Typography.Text className='author'>{displayName}</Typography.Text>
          </div>
        </div>
      </Popover>
    );
}

export default UserState