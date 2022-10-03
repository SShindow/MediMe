import { Modal } from 'antd';
import React, {useContext} from 'react';
import { UserContext } from './UserContext/UserContextProvider';
import { Avatar, Card } from 'antd';
import { FullscreenExitOutlined } from '@ant-design/icons';
import medime_tagline from '../components/assets/medime_tagline.jpg';
import "./UserManagement.css";


const { Meta } = Card;

function MemberCard({role, name, email, avatar}) { 

    const {isUserInfoVisible, setIsUserInfoVisible} = useContext(UserContext);

  return (
    <div className="user_info_card">
        <Card
            hoverable
            style={{
                width: 300,
                borderRadius: "20px",
                color: '#013567',
                height: "40%" 
            }}
            cover={
                <img
                    alt="example"
                    src={medime_tagline}
                />
            }
        extra={<FullscreenExitOutlined onClick={()=>{setIsUserInfoVisible(false)}} />}>
            <Meta
                avatar={<Avatar src={avatar} />}
                title="Medime Personal Card">
            </Meta>
            <p><i>Position: </i>{role}</p>
            <p><b>Name: </b>{name}</p>
            <p><b>Email: </b>{email}</p>
        </Card>
    </div>
  )
}

export default MemberCard