import React, {useState, useContext} from 'react'
import { AppContext } from '../Context/AppProvider'
import {Modal, Form, Select, Spin, Avatar, Popover} from 'antd';
import {debounce} from 'lodash';
import {db} from '../../../firebase';
import {collection, query, where, getDocs, updateDoc, doc} from 'firebase/firestore';

function DebounceSelect({fetchOptions, debounceTimeout = 300, ...props}){
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
        setOptions([]);
        setFetching(true);

        fetchOptions(value).then((newOptions) => {
            setOptions(newOptions);
            setFetching(false);
        });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);

    React.useEffect(() => {
        return () => {
      // clear when unmount
          setOptions([]);
        };
    }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.uid} value={opt.uid} title={opt.name}>
          <Popover content={<p><b>Email: </b>{opt.email}</p>} title="Information" trigger="hover">
            <Avatar size='small' src={opt.avatar}>
              {opt.avatar ? '' : opt.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {`${opt.name}`}
          </Popover>
        </Select.Option>
      ))}
    </Select>
  );

}

async function fetchUserList(search){

    const docRef = query(collection(db, 'users'), where('name', '==', search));
    const userSnapshot = await getDocs(docRef);
    const userList = userSnapshot.docs.map(doc => doc.data())
    return userList;

}
         

function InviteMemberModal() {
    const {isInviteMemberVisible, setIsInviteMemberVisible, selectedRoom, selectedRoomId} = useContext(AppContext);
    const [value, setValue] = useState([]);

    const [form] = Form.useForm();
    const handleOk = () => {
        form.resetFields();
        setValue([]);
    
        // update members in current room
        const roomRef = doc(db, 'rooms', selectedRoomId)
    
        updateDoc(roomRef, {
          members: [...selectedRoom.members, ...value.map((val) => val.value)],
        });
    
        setIsInviteMemberVisible(false);
      };
    
      const handleCancel = () => {
        form.resetFields(); 
        setIsInviteMemberVisible(false);
        setValue([])
        
    };

  return (
    <div>
        <Modal 
            title="Add room's members"
            visible={isInviteMemberVisible}
            onOk={handleOk}
            onCancel={handleCancel}>
            <Form form={form} layout='vertical'>
                <DebounceSelect
                    mode="multiple"
                    lable="Name of members"
                    value={value}
                    placeholder="Enter member's name:"
                    fetchOptions={fetchUserList}
                    onChange={newValue => setValue(newValue)}
                    style={{width: '100%'}}
                />
            </Form>
        </Modal>
        
    </div>
  )

}

export default InviteMemberModal