import React,  { useState, useContext } from 'react';
import {db} from '../../firebase';
import { Select, Spin, Avatar, Popover } from 'antd';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { AppContext } from './Context/AppProvider';
const { Option } = Select;
let timeout;
let currentValue;

const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = () => {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where('name','==', currentValue));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let result = [];
      querySnapshot.forEach((doc)=>{
        result.push({id: doc.id, name: doc.data().name, avatar: doc.data().avatar, email: doc.data().email});
      })
      callback(result);
    })
    return unsubscribe;
  };
  timeout = setTimeout(fake, 300);
};

const SearchInput = (props) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const [fetching, setFetching] = useState(false);

  const {setTargetChat, setSelectedUserId, selectedUserId} = useContext(AppContext);

  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setData);
      setFetching(true);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={true}
      allowClear={true}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      onDeselect={()=>{setTargetChat(""); setSelectedUserId("")}}
      onClear={()=>{setTargetChat(""); setSelectedUserId("")}}
    >
      {
        data.map((d) => <Option key={d.id}>
          <div>
            <Popover content={<p><b>Email: </b>{d.email}</p>} trigger="hover" title="Information">
              <div onClick={() => {setTargetChat("user"); setSelectedUserId(d.id)}}>
                <Avatar size='small' src={d.avatar}>
                  {d.avatar ? '' : d.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                {`${d.name}`}
              </div>
            </Popover>

          </div>
          
        </Option>)
      }
    </Select>
  );
};



function FindMembers() {
  return (
    <div>
      <SearchInput className='search-input'
        placeholder="Enter member's name"
        style={{
          position: "relative",
          width: 269,
          left: 10,
          top: 20,
          borderRadius: 4,
        }}/>
    </div>
  )

}


export default FindMembers