import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import AddEmployee from './AddEmployee';
import AddProject from './AddProject';
import EmployeeDetails from './EmployeeDetails';
import ProjectDetails from './ProjectDetails';
import EmployeeList from './EmployeeList';
import { ProjectProvider } from './context/ProjectContext';
import UploadEmployee from './UploadEmployee';


export default function App() {
  return (
    <ProjectProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-employee" element={<AddEmployee/>} />
        <Route path="/upload-employee" element={<UploadEmployee/>}/>
        <Route path="/add-project" element={<AddProject/>} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
        <Route path="/project-details" element={<ProjectDetails/>}/>
        <Route path="/employee-list" element={<EmployeeList />} />
      </Routes>
    </Router>
    </ProjectProvider>
  );
}