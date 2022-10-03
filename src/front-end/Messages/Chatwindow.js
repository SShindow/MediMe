import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from './Context/AppProvider';
import Mess from './Mess'
import { Alert, Avatar, Tooltip, Form, Input, Button, Badge, Typography } from 'antd';
import { auth, db } from '../../firebase';
import { addDoc, collection, Timestamp, onSnapshot, query, orderBy, setDoc, doc } from 'firebase/firestore';
import styled from 'styled-components';
import './Chatwindow.css';
import { InfoCircleOutlined } from '@ant-design/icons';


const MessageListStyled = styled.div`
  max-height: 100vh;
`;


function Chatwindow() {

  const { selectedRoomId, selectedRoom, members, setIsOpenmembersVisible, setIsInviteMemberVisible, currentUser, selectedUser, selectedUserId, targetchat} = useContext(AppContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const [messages, setMessages] = useState([]);
  const [permessages, setPerMessages] = useState([]);


  useEffect(() => {
    if (selectedRoomId) {
      const collectionRef = collection(db, 'messagesroom', selectedRoomId, 'chat');
      const q = query(collectionRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        })
        setMessages(messages)
      });
      return unsubscribe;
    }

  }, [selectedRoomId])


  useEffect(() => {
    if (selectedUserId) {
      const id = auth.currentUser.uid > selectedUserId ? `${auth.currentUser.uid + selectedUserId}` : `${selectedUserId + auth.currentUser.uid}`;
      const collectionRef = collection(db, 'messageusers', id, 'chat');
      const q = query(collectionRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let permessages = [];
        querySnapshot.forEach((doc) => {
          permessages.push({ ...doc.data(), id: doc.id });
        })
        setPerMessages(permessages)
      });
      return unsubscribe;
    }
  }, [selectedUserId])


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleOnSubmitGroupMessage = () => {
    addDoc(collection(db, 'messagesroom', selectedRoomId, 'chat'), {
      text: inputValue,
      uid: auth.currentUser.uid,
      avatar: currentUser.avatar,
      roomId: selectedRoomId,
      name: currentUser.name,
      createdAt: Timestamp.fromDate(new Date())
    })

    setDoc(doc(db, "lastMessageGroup", selectedRoomId),{
      text: inputValue,
      from: auth.currentUser.uid,
      to: selectedRoomId,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    })

    form.resetFields(['message']);

  }


  const handleOnSubmitPersonalMessage = () => {
    const id = auth.currentUser.uid > selectedUserId ? `${auth.currentUser.uid + selectedUserId}` : `${selectedUserId + auth.currentUser.uid}`;
    const id_sender_firebase = currentUser.id_firebase;
    const id_receiver_firebase = selectedUser.id_firebase;

    addDoc(collection(db, 'messageusers', id, 'chat'), {
      text: inputValue,
      from: auth.currentUser.uid,
      name: currentUser.name,
      to: selectedUserId,
      avatar: currentUser.avatar,
      createdAt: Timestamp.fromDate(new Date()),
      id: id,
    })

    setDoc(doc(db, 'lastMsg', id), {
      inputValue,
      from: auth.currentUser.uid,
      to: selectedUserId,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    })

    setDoc(doc(db,"users",id_sender_firebase),{
      avatar: currentUser.avatar,
      avatarPath: currentUser.avatarPath,
      branch: currentUser.branch,
      email: currentUser.email,
      isOnline: currentUser.isOnline,
      name: currentUser.name,
      role: currentUser.role,
      uid: currentUser.uid,
      last_history: Timestamp.fromDate(new Date()),
    })

    setDoc(doc(db,"users",id_receiver_firebase),{
      avatar: selectedUser.avatar,
      avatarPath: selectedUser.avatarPath,
      branch: selectedUser.branch,
      email: selectedUser.email,
      isOnline: selectedUser.isOnline,
      name: selectedUser.name,
      role: selectedUser.role,
      uid: selectedUser.uid,
      last_history: Timestamp.fromDate(new Date()),
    })

    addDoc(collection(db, 'userhistory'), {
      from: auth.currentUser.uid,
      to: selectedUserId,
      createdtAt: Timestamp.fromDate(new Date()),
    })

    form.resetFields(['message']);
  }

  if (selectedRoom.id && targetchat === "group") {
    return (
      <div>
        <div>
          <div className='top-group'>
            <p className='room-name'>{selectedRoom.name}</p>
            <span className='room-description'>{selectedRoom.description}</span>
            <div className='avatar_group'>
              <Avatar.Group size='large' maxCount={2}>
                {members.map((member) => <Tooltip title={member.name} key={member.id}>
                  <Avatar src={member.avatar}>{member.avatar ? '' : member.name.charAt(0)?.toUpperCase()}</Avatar>
                </Tooltip>)}

              </Avatar.Group>
            </div>
          </div>

          <div>
            <button type="button" onClick={()=>setIsOpenmembersVisible(true)} className="view-user">Info</button>
          </div>

          <div >
            <button type="button" onClick={() => setIsInviteMemberVisible(true) } className='invite-people-btn'>Invite people</button>
          </div>

          <MessageListStyled>
            {
              messages.map((mes) => <Mess key={mes.id} text={mes.text} photoURL={mes.avatar} displayName={mes.name} createdAt={mes.createdAt} uid={mes.uid} />)
            }
          </MessageListStyled>
          <div className='bottom'>
          <Form form={form}>
            <Form.Item name='message'>
              <Input
                onChange={handleInputChange}
                onPressEnter={handleOnSubmitGroupMessage}
                placeholder='Enter message...'
                bordered={true}
                autoComplete='off'
                className='input-message'
              />
            </Form.Item>
            
              <Button type='primary' onClick={handleOnSubmitGroupMessage} className='btn-send'>
                Send
              </Button>
           
          </Form>

          </div>
        </div>
      </div>
    )
  }

  if (selectedUserId && targetchat === "user") {
    return (
      <div>
        <div>
          <div >
            <div className='top'>
              <Badge dot status={selectedUser.isOnline ? 'success' : 'error'}>
                <Avatar src={selectedUser.avatar} className='avatar'>{selectedUser.avatar ? '' : selectedUser.name?.charAt(0)?.toUpperCase()}</Avatar>
              </Badge>
              <Typography.Text className='author' >{selectedUser.name}</Typography.Text>
            </div>
          </div>
        </div>


        <MessageListStyled>
          {
            permessages.map((mes) => <Mess key={mes.id} text={mes.text} photoURL={mes.avatar} displayName={mes.name} createdAt={mes.createdAt} uid={mes.from} />)
          }
        </MessageListStyled>


        <Form form={form}>
          <Form.Item name='message'>
            <Input
              onChange={handleInputChange}
              onPressEnter={handleOnSubmitPersonalMessage}
              placeholder='Enter message...'
              bordered={true}
              autoComplete='off'
              className='input-message'
            />
          </Form.Item>
          <div className='bottom'>
            <Button type='primary' onClick={handleOnSubmitPersonalMessage} className='btn-send'>
              Send
            </Button>
          </div>
        </Form>
      </div>

    )

  }

  return (
    <Alert message='Please choose the recipients'
      type='info'
      className='alert-info'
      showIcon
      style={{
        margin: 5,
        position: 'relative',
        top: '-465px',
      
      }}
      closable />
  )


}

export default Chatwindow