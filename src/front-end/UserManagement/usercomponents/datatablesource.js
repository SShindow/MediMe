export const userColumns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "avatar",
      headerName: "User",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.avatar} alt="avatar" />
            {params.row.username}
          </div>
        );
      },
    },

    {
      field: "name",
      headerName: "Name",
      width: 150,
    },


    {
      field: "email",
      headerName: "Email",
      width: 230,
    },
  
    {
      field: "role",
      headerName: "Role",
      width: 150,
    },

    {
      field: "branch",
      headerName:"Branch",
      width: 150,
    },

    {
      field: "isOnline",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        let status;
        if (params.row.isOnline){
          status = 'Active';
        }
        else{
          status = 'Inactive';
        }
        return (
          <div className={`cellWithStatus ${params.row.isOnline}`}>
            {status}
          </div>
        );
      },
    },
  ];