// src/pages/EmployeeList.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProject } from './context/ProjectContext';  
import { useAuth } from "./hooks/useAuth.js";


export default function EmployeeList() {
  useAuth();
  const [employees, setEmployees] = useState([]);
  const [disabledEmployees, setDisabledEmployees] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const { type, index } = location.state || {};
  const { project, setProject } = useProject();

  useEffect(() => {
    // Fetch employee data from backend
    axios.get('http://localhost:5000/', { withCredentials: true })
      .then(response => {
        let data = response.data;
        console.log(type);

        // Filter or adjust data based on the type passed
        if (type === 'manager') {
          // Assuming 'isManager' or similar field exists to filter managers
          data = data.filter(employee => employee.current_role==='Manager');
        }

        else if(type==='leader'){
          data = data.filter(employee => employee.current_role==='Team Lead');
        }

        else{
          data = data.filter(employee => employee.current_role!=='Team Lead' && employee.current_role!=='Manager');
        }

        setEmployees(data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, [type]);

  useEffect(() => {
    // Determine disabled employees based on current project state
    const disabledSet = new Set();
    
    if (type === 'manager') {
      if (project.managerId) {
        disabledSet.add(project.managerId);
      }
    } else if (type === 'leader' && index !== undefined) {
      const currentLeader = project.teams[index]?.leaderId;
      if (currentLeader) {
        disabledSet.add(currentLeader);
      }
    } else if (type === 'members' && index !== undefined) {
      project.teams[index]?.members.forEach(member => {
        disabledSet.add(member);
      });
    }

    setDisabledEmployees(disabledSet);
  }, [project, type, index]);

  const handleAdd = (employee) => {
    const value = employee._id;
    
    if (disabledEmployees.has(value)) {
      return; // Prevent adding if already in the disabled set
    }

    if (type === 'manager') {
      setProject(prev => ({ 
        ...prev, 
        managerId: value, 
        managerName: `${employee.first_name} ${employee.last_name}` 
      }));
    } else if (type === 'leader' && index !== undefined) {
      setProject(prev => {
        const newTeams = [...prev.teams];
        newTeams[index].leaderId = value;
        newTeams[index].leaderName = `${employee.first_name} ${employee.last_name}`;
        return { ...prev, teams: newTeams };
      });
    } else if (type === 'members' && index !== undefined) {
      setProject(prev => {
        const newTeams = [...prev.teams];
        
        // Ensure membersNames is initialized as an array
        if (!Array.isArray(newTeams[index].membersNames)) {
          newTeams[index].membersNames = [];
        }

        newTeams[index].members.push(value);
        newTeams[index].membersNames.push(`${employee.first_name} ${employee.last_name}`);
        return { ...prev, teams: newTeams };
      });
    }

    navigate('/add-project'); // Navigate back to the AddProject page
  };

  return (
    <Box sx={{ padding: '30px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom align="center">Select an Employee</Typography>
      <List>
        {employees.filter(employee => employee.status === 'Active').map(employee => {
          const value = employee._id;
          return (
            <ListItem key={employee._id} sx={{ borderBottom: '1px solid #ddd' }}>
              <ListItemText primary={`${employee.first_name} ${employee.last_name}`} />
              <Tooltip title={disabledEmployees.has(value) ? "Employee already added" : ""}>
                <span>
                  <IconButton
                    onClick={() => handleAdd(employee)}
                    disabled={disabledEmployees.has(value)}
                  >
                    <AddIcon color={disabledEmployees.has(value) ? "disabled" : "primary"} />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}