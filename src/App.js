import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { useAuth } from "./providers/AuthProvider";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "antd/dist/antd.css";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/auth/SignIn.js";
import Main from "../src/components/layout/Main.js";
import ListStudents from "./pages/students/ListStudents.js";
import ListParents from "./pages/students/ListParents.js";
import StudentLeaves from "./pages/students/studentleaves.js";
import StaffLeave from "./pages/students/staffleaves.js";
import StudentSetup from "./pages/students/studentsetup.js";
import StaffSetup from "./pages/students/staffsetup.js";
import SalarySetup from "./pages/students/salarysetup.js";
import ListStaffs from "./pages/staff/ListStaffs.js";
import ViewStudent from "./pages/students/ViewStudent.js";
import ViewStaff from "./pages/staff/ViewStaff.js";
import DepartmentSetup from "./pages/setting/DepartmentSetup.js";
import Create from "./pages/students/Create.js";
import SalarySlip from "./pages/staff/salarySlip.js";
import CreateStaff from "./pages/students/CreateStaff.js";
import UpdateStaff from "./pages/staff/UpdateStaff.js";
import DownloadReport from "./pages/staff/DownloadReport.js";


function App() {
  const { isLoggedIn, userToken } = useAuth(); // Use the useAuth hook
  console.log("is user logged in", isLoggedIn);
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Router>
        <Routes>
          {userToken ? (
            <>
            
              <Route path="/students" element={<Main><ListStudents /></Main>} />
              <Route path="/studentleaves" element={<Main><StudentLeaves /></Main>} />
              <Route path="/studentsetup" element={<Main><StudentSetup /></Main>} />
              <Route path="/students/:id" element={<Main><ViewStudent /></Main>} />
              <Route path="/parents" element={<Main><ListParents /></Main>} />


              <Route path="/ListStaffs" element={<Main><ListStaffs /></Main>} />
              <Route path="/ListStaffs/downloadReport/:date" element={<DownloadReport />} />
              <Route path="/staff/:id" element={<Main><ViewStaff /></Main>} />
              <Route path="/staff/update/:id" element={<Main><UpdateStaff /></Main>} />
              <Route path="/staffleaves" element={<Main><StaffLeave /></Main>} />
              <Route path="/staffsetup" element={<Main><StaffSetup /></Main>} />
              <Route path="/departmentsetup" element={<Main><DepartmentSetup /></Main>} />
              <Route path="/salarysetup" element={<Main><SalarySetup /></Main>} />
              <Route path="staff/salarySlip/:id" element={<Main><SalarySlip /></Main>} />
              <Route path="/create" element={<Main><Create /></Main>} />
              <Route path="/salaryslip/:id" element={<Main><SalarySlip /></Main>} />
              <Route path="/staffs/create" element={<Main><CreateStaff /></Main>} />
              
              {/* Other routes for authenticated users */}
              <Route path="*" element={<Main><Dashboard userToken={userToken} /></Main>} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
    </Router>
  );
}

export default App;
