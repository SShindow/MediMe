import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./front-end/Login/Login";



import Dashboard from "./front-end/Dashboard/Dashboard";
import Messages from "./front-end/Messages/Messages";
import Reports from "./front-end/Reports/Reports";
import Storage from "./front-end/Storage/Storage";
import Details from "./front-end/Details/Details";
import UserManagement from "./front-end/UserManagement/UserManagement";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
          
        
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/message" element={<Messages />} />
          <Route path="/report/overview" element={<Reports />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/report/details" element={<Details />} />
          <Route path="/admin/usermanagement" element={<UserManagement/>} />
        </Routes>
      </BrowserRouter>
    </>

  );
}
export default App;
