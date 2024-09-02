import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Menu, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import { useAuth } from "./hooks/useAuth.js";

const Background = styled(Box)({
  height: '100vh',
  backgroundColor: '#fff',
  display: 'flex',
});

const ContentArea = styled(Box)({
  flex: 1,
  padding: '40px',
});

const ContentAreaHead = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
});

const TableWrapper = styled(Box)({
  display: 'block',
  maxHeight: '400px',
  overflowY: 'auto',
});

const StyledTableContainer = styled(TableContainer)({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
});

const FixedTableHead = styled(TableHead)({
  position: 'sticky',
  top: 0,
  backgroundColor: '#4facfe',
  zIndex: 1,
});

const StatusDot = styled(Box)(({ status }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: status === 'Active' ? 'green' : 'red',
  marginRight: '8px',
}));

export default function EmployeeDetails() {
  useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { employeeId } = location.state || {};
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusOptions, setStatusOptions] = useState(['Active', 'Terminated', 'Resigned', 'Retired']);

  const qualificationOptions = ['B.E', 'M.E', 'B.Tech', 'M.Tech', 'BBA', 'MBA', 'MCA', 'BCA', 'B.Sc', 'M.Sc'];
  const roleOptions = ['Intern', 'Trainee', 'Junior', 'Senior', 'Team Lead', 'Manager'];

  useEffect(() => {
    if (employeeId) {
      axios.get(`http://localhost:5000/getEmployee/id/${employeeId}`, { withCredentials: true })
        .then(response => {
          const employeeData = response.data;
          employeeData.joining_date = formatDate(employeeData.joining_date);
          employeeData.DoB = formatDate(employeeData.DoB);
          const projectIds = employeeData.projects?.projectId || [];
          
          if (Array.isArray(projectIds) && projectIds.length > 0) {
            // Fetch all projects by IDs
            Promise.all(
              projectIds.map(id =>
                axios.get(`http://localhost:5000/getProject/id/${id}`, { withCredentials: true })
                  .then(response => response.data)
              )
            )
            .then(projects => {
              // setProjects(projects); // Set the fetched projects
              // setEmpprojects(projects.map(project => project.name)); // Store only project names for display
              setProjects(projects.map(project => ({ id: project._id, name: project.name }))); // Store project names and IDs for display

            })
            .catch(error => console.error('Error fetching projects:', error));
          }
          
          setEmployee(employeeData);
          setEditedEmployee(employeeData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching employee data:', error);
          setError('Failed to fetch employee data.');
          setLoading(false);
        });
    } else {
      setError('No employee ID provided.');
      setLoading(false);
    }
  }, [employeeId]);
  

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    return !isNaN(formattedDate) ? formattedDate.toISOString().split('T')[0] : '';
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/editEmployee/editbyid/${employeeId}`, editedEmployee, { withCredentials: true })
      .then(() => {
        setEmployee(editedEmployee);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating employee data:', error);
        setError('Failed to update employee data.');
      });
  };

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusClose = (status) => {
    if (status) {
      axios.put(`http://localhost:5000/editEmployee/editbyid/${employeeId}`, { ...editedEmployee, status }, { withCredentials: true })
        .then(() => {
          setEditedEmployee((prev) => ({ ...prev, status }));
          setEmployee((prev) => ({ ...prev, status }));
        })
        .catch(error => {
          console.error('Error updating employee status:', error);
          setError('Failed to update employee status.');
        });
    }
    setAnchorEl(null);
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading employee data...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  if (!employee) {
    return <Typography variant="h6" align="center">No employee data available.</Typography>;
  }

  return (
    <Background>
      <ContentArea>
        <ContentAreaHead>
          <Box display="flex" alignItems="center" marginBottom="10px">
            <Typography variant="h4" gutterBottom>
              Employee Details
            </Typography>
            <Box display="flex" alignItems="center" marginLeft="auto">
              {employee.status && (
                <Box display="flex" alignItems="center" marginRight="20px">
                  <StatusDot status={employee.status} />
                  <Typography variant="h6">{employee.status}</Typography>
                </Box>
              )}
              <Button
                variant="contained"
                sx={{ backgroundColor: '#4caf50', color: '#fff', '&:hover': { backgroundColor: '#45a049' }, marginRight: '10px' }}
                onClick={() => navigate('/home')}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff9800', color: '#fff', '&:hover': { backgroundColor: '#f57c00' }, marginRight: '10px' }}
                onClick={isEditing ? handleSave : handleEditClick}
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#2196f3', color: '#fff', '&:hover': { backgroundColor: '#1976d2' } }}
                onClick={handleStatusClick}
              >
                Status
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleStatusClose()}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option} onClick={() => handleStatusClose(option)}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </ContentAreaHead>
        <TableWrapper>
          <StyledTableContainer component={Paper}>
            <Table>
              <FixedTableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                </TableRow>
              </FixedTableHead>
              <TableBody>
                {[
                  { label: 'First Name', value: 'first_name' },
                  { label: 'Last Name', value: 'last_name' },
                  { label: 'Date of Birth', value: 'DoB' },
                  { label: 'Phone Number', value: 'phone_number' },
                  { label: 'Email', value: 'email' },
                  { label: 'Address', value: 'address' },
                  { label: 'Aadhar Number', value: 'aadhar_number' },
                  {
                    label: 'Highest Qualification',
                    value: 'highest_qualification',
                    type: 'select',
                    options: qualificationOptions,
                  },
                  { label: 'University', value: 'university' },
                  { label: 'Percentage', value: 'percentage' },
                  { label: 'Year of Graduation', value: 'year_of_graduation' },
                  { label: 'Previous Employer', value: 'previous_employer' },
                  { label: 'Years of Experience', value: 'years_of_experience' },
                  { label: 'Previous Role', value: 'previous_role' },
                  {
                    label: 'Current Role',
                    value: 'current_role',
                    type: 'select',
                    options: roleOptions,
                  },
                  { label: 'Department', value: 'department' },
                  { label: 'Joining Date', value: 'joining_date' },
                  { label: 'Bank Name', value: 'bank_name' },
                  { label: 'Account Number', value: 'account_number' },
                  { label: 'IFSC Code', value: 'ifsc_code' }
                ].map((field) => (
                  <TableRow key={field.value}>
                    <TableCell><strong>{field.label}</strong></TableCell>
                    <TableCell>
                      {isEditing ? (
                        field.type === 'select' ? (
                          <TextField
                            select
                            name={field.value}
                            value={editedEmployee[field.value] || ''}
                            onChange={handleChange}
                            fullWidth
                          >
                            {field.options.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <TextField
                            name={field.value}
                            value={editedEmployee[field.value] || ''}
                            onChange={handleChange}
                            fullWidth
                          />
                        )
                      ) : (
                        employee[field.value] || 'N/A'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell><strong>Projects</strong></TableCell>
                  <TableCell>
                    {projects.length > 0 ? (
                      projects.map((project, index) => (
                        <Typography key={index}>{project.name}</Typography>
                      ))
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>

            </Table>
          </StyledTableContainer>
        </TableWrapper>
      </ContentArea>
    </Background>
  );
}
