import React, {useState, useContext} from 'react';
import {Form, Input, Modal} from 'antd';
import { AppContext } from '../Context/AppProvider';
import {auth, db} from '../../../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';


function AddRoomModal() {
    const current_uid = auth.currentUser.uid;
    const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
    const [form] = Form.useForm();
    const handleOk = () => {
        console.log({formData: form.getFieldValue()});
        addDoc(collection(db, 'rooms'), {...form.getFieldValue(), members:[current_uid], createdAt: Timestamp.fromDate(new Date())})
        setIsAddRoomVisible(false);
        form.resetFields();
      };
    
      const handleCancel = () => {
        setIsAddRoomVisible(false);
        form.resetFields(); 
    };
  return (
    <div>
        <Modal 
            title="Create Room"
            visible={isAddRoomVisible}
            onOk={handleOk}
            onCancel={handleCancel}>
            <Form form={form} layout='vertical'>
                <Form.Item label="Room Name" name='name'>
                    <Input placeholder="Enter room name"/>
                </Form.Item>

                <Form.Item label = "Room Description" name='description'>
                    <Input.TextArea placeholder="Enter Description"/>
                </Form.Item>
            </Form>
        </Modal>
        
    </div>
  )
}

export default AddRoomModal