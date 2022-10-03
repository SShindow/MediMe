import React, { useRef, useContext, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import {Modal} from 'antd';
import {createUser} from "../../firebase";
import {UserContext} from '../UserManagement/UserContext/UserContextProvider';

function AddUsersModal() {
  const form = useRef();
  const {isAddUsersVisible, setIsAddUsersVisible} = useContext(UserContext);

  const sendEmail = () => {
    emailjs.sendForm('service_9lh0zfc', 'template_qn7hyde', form.current, 'CQDDGpBoh_A3H8jAB')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

    const callAPI = (email, branch) => {
        fetch(`http://localhost:8080/employee/add/${branch}/employee/${email}`);
    }


    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [branch, setBranch] = useState("");

    const handleOk = () => {
        createUser(email, password, name, branch);
        callAPI(email, branch);
        sendEmail();
        setIsAddUsersVisible(false);
        document.getElementById("AddUserForm").reset();
    };

    const handleCancel = () => {
        setIsAddUsersVisible(false);
        document.getElementById("AddUserForm").reset();
    };

    useEffect(()=>{

    }, [])


  return (
      <div>
          <Modal title="Add users"
            visible={isAddUsersVisible}
            onOk={handleOk}
            onCancel={handleCancel}>
            <form ref={form} id="AddUserForm" className="create_form">
                <div>
                    <label for='name'>Name</label>
                    <input type="text" name="name" placeholder="Enter user's name: " onChange={(e)=>{setName(e.target.value)}} required/>
                </div>

                <div>
                    <label for='branch'>Branch</label>
                    <input type="text" name="branch" placeholder="Enter branch's name: " onChange={(e)=>{setBranch(e.target.value)}} required/>
                </div>

                <div>
                    <label for='email'>Email</label>
                    <input type="email" name="email" placeholder="Enter user's email: " onChange={(e)=>{setEmail(e.target.value)}} required/>
                </div>

                <div>
                    <label for='pasword'>Password</label>
                    <input type="password" name="password" placeholder="Enter user's password: " onChange={(e)=>{setPassword(e.target.value)}} required/>
                </div>
            </form>
            
          </Modal>
      </div>
    
  );
};

export default AddUsersModal;



//     const sendEmail = () => {
//         emailjs.sendForm('service_9lh0zfc', 'template_qn7hyde', email_content, 'CQDDGpBoh_A3H8jAB').then((result) => {
//             console.log(result.text);
//         }, (error) => {
//             console.log(error.text);
//         });
//         setEmail("");
//         setName("");
//         setPassword("");
//     };
    
//     const handleCancel = () => {
//         setIsAddUsersVisible(false);
//         form.resetFields(); 
//     };


//   return (
//     <div>
//         <Modal 
//             title="Add users"
//             visible={isAddUsersVisible}
//             onOk={handleOk}
//             onCancel={handleCancel}>
//             <Form form={form} layout='vertical'>
//                 <Form.Item
//                     name="name"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input Username!',
//                         },
//                     ]}
//                     hasFeedback>
//                     <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User name" onChange={(e)=>{setName(e.target.value)}} name="name" value={name} />
//                 </Form.Item>

//                 <Form.Item
//                     name="email"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input Mail!',
//                         },
//                     ]}
//                     hasFeedback>
//                     <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="User mail" onChange={(e)=>{setEmail(e.target.value)}} name="email" value={email}/>
//                 </Form.Item>

//                 <Form.Item
//                     name="password"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input Password!',
//                         },
//                     ]}
//                     hasFeedback>

//                     <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} name="password" value={password}/>
//                 </Form.Item>
//             </Form>
//         </Modal>
//     </div>
//   )
// }

// export default AddUsersModal;