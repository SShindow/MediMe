import React,  { useState, useContext } from 'react';
import {db} from '../../firebase';
import { Select, Spin } from 'antd';
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
    const collectionRef = collection(db, "rooms");
    const q = query(collectionRef, where('name','==', currentValue));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let result = [];
      querySnapshot.forEach((doc)=>{
        result.push({id: doc.id, text: doc.data().name});
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

  const {setTargetChat, setSelectedRoomId, selectedRoomId} = useContext(AppContext);

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
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      onDeselect={()=>{setTargetChat(""); setSelectedRoomId("")}}
      allowClear={true}
    >
      {
        data.map((d) => <Option key={d.id}>
          <div onClick={() => {setTargetChat("group"); setSelectedRoomId(d.id)}}>
            {d.text}
          </div>
        </Option>)
      }
    </Select>
  );
};

function FindGroups() {
  return (
    <div className="group-search-container">
      <SearchInput placeholder="Enter group's name"
        style={{ 
          position: "relative",
          width: 269,
          left: 15,
          top: 70,
          
        }}
      />
    </div>
  )
};

export default FindGroups