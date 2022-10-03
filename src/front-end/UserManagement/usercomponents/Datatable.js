import React, { useContext } from 'react'
import "./Datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "./datatablesource";
import { useEffect, useState } from "react";
import {db, deleteUser} from "../../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDoc
} from "firebase/firestore";
import { UserContext } from '../UserContext/UserContextProvider';
import {Modal, Popover} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MemberCard from '../MemberCard';

function Datatable() {
  const [data, setData] = useState([]);
  const {userName, setUserName, avatar, setUserAvatar, email, setUserEmail, role, setRole, userId, setUserId, name, setName, isUserInfoVisible, setIsUserInfoVisible, branch, setBranch} = useContext(UserContext);
  const { confirm } = Modal;

  const showConfirm = async (id, email) => {
    confirm({
      title: 'Do you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'The information of the user will be removed permanently',

      onOk() {
        try {
          fetch(`http://localhost:8080/employee/delete/${email}`);
          deleteDoc(doc(db, "users", id));
          setData(data.filter((item) => item.id !== id));
        } catch (err) {
          console.log(err);
        }
      },

      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    
    if (userName){
        const unsub = onSnapshot(
            query(collection(db, "users"), where('name','==',userName)),
            (snapShot) => {
              let list = [];
              snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
              });
              setData(list);
            },
            (error) => {
              console.log(error);
            }
          );
      
          return () => {
            unsub();
          };
    }
    else{
        const unsub = onSnapshot(
            collection(db, "users"),
            (snapShot) => {
              let list = [];
              snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
              });
              setData(list);
            },
            (error) => {
              console.log(error);
            }
          );
      
          return () => {
            unsub();
          };
    }
  }, [userName]);

  const handleOnClick=(a) => {
    setIsUserInfoVisible(true);
    setName(a.name);
    setUserEmail(a.email);
    setUserAvatar(a.avatar);
    setUserId(a.uid);
    setRole(a.role);
    setBranch(a.branch);
  }



  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="viewButton" onClick={()=>handleOnClick(params.row)}>View</div>
            <div
              className="deleteButton"
              onClick={() => showConfirm(params.row.id, params.row.email)}>
              Delete
            </div>
          </div>

        );
      },
    },
  ];
  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      <div className="card_user_info">
        {isUserInfoVisible && <MemberCard avatar={avatar} role={role} name={name} email={email} branch={branch}/>}
      </div>
    </div>
  );
};

export default Datatable;
