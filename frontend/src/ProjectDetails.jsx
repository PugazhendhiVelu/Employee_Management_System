import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
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
  backgroundColor: status === 'Ongoing' || status === 'Completed' ? 'green' : 'red',
  marginRight: '8px',
}));

export default function ProjectDetails() {
  useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = location.state || {};
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusOptions, setStatusOptions] = useState(['Ongoing', 'Terminated', 'Completed', 'Yet to Start']);

  useEffect(() => {
    if (projectId) {
      axios.get(`http://localhost:5000/getProject/id/${projectId}`, { withCredentials: true })
        .then(response => {
          const projectData = response.data;
          projectData.deadline = formatDate(projectData.deadline);
          projectData.teams = projectData.teams || []; // Ensure teams is an array
          setProject(projectData);
          setEditedProject(projectData); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching project data:', error);
          setError('Failed to fetch project data.');
          setLoading(false);
        });
    } else {
      setError('No project ID provided.');
      setLoading(false);
    }
  }, [projectId]);

  const formatDate = (date) => {
    if (!date) return ''; // Return an empty string for invalid or undefined dates
    const formattedDate = new Date(date);
    return !isNaN(formattedDate) ? formattedDate.toISOString().split('T')[0] : ''; // Check for valid date
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/editProject/id/${projectId}`, editedProject, { withCredentials: true })
      .then(() => {
        setProject(editedProject); // Update the project state with edited data
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating project data:', error);
        setError('Failed to update project data.');
      });
  };

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusClose = (status) => {
    if (status) {
      axios.put(`http://localhost:5000/editProject/id/${projectId}`, { ...editedProject, status }, { withCredentials: true })
        .then(() => {
            setEditedProject((prev) => ({ ...prev, status }));
          setProject((prev) => ({ ...prev, status }));
        })
        .catch(error => {
          console.error('Error updating project status:', error);
          setError('Failed to update project status.');
        });
    }
    setAnchorEl(null);
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading project data...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  if (!project) {
    return <Typography variant="h6" align="center">No project data available.</Typography>;
  }

  return (
    <Background>
      <ContentArea>
        <ContentAreaHead>
          <Box display="flex" alignItems="center" marginBottom="10px">
            <Typography variant="h4" gutterBottom>
              Project Details
            </Typography>
            <Box display="flex" alignItems="center" marginLeft="auto">
              {project.status && (
                <Box display="flex" alignItems="center" marginRight="20px">
                  <StatusDot status={project.status} />
                  <Typography variant="h6">{project.status}</Typography>
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
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>{isEditing ? (
                    <TextField
                      name="name"
                      value={editedProject.name || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    project.name || 'N/A'
                  )}</TableCell>
                </TableRow>
                {/*<TableRow>
                  <TableCell>Manager</TableCell>
                  <TableCell>{isEditing ? (
                    <TextField
                      name="manager"
                      value={editedProject.manager || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    project.manager || 'N/A'
                  )}</TableCell>
                </TableRow>*/}
                <TableRow>
                  <TableCell>Manager</TableCell>
                  <TableCell>
                    {project.manager || 'N/A'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Teams</TableCell>
                  <TableCell>
                    {Array.isArray(project.teams) && project.teams.length > 0 ? (
                      project.teams.map((team, index) => (
                        <Box key={index} mb={2}>
                          <Typography variant="subtitle1"><strong>Team Name:</strong> {team.name || 'N/A'}</Typography>
                          <Typography variant="subtitle1"><strong>Leader:</strong> {team.leaderName || 'N/A'}</Typography>
                          <Typography variant="subtitle1"><strong>Members:</strong> {Array.isArray(team.membersNames) ? team.membersNames.join(', ') : 'N/A'}</Typography>
                        </Box>
                      ))
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{isEditing ? (
                    <TextField
                      name="description"
                      value={editedProject.description || ''}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    project.description || 'N/A'
                  )}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deadline</TableCell>
                  <TableCell>{isEditing ? (
                    <TextField
                      name="deadline"
                      value={editedProject.deadline || ''}
                      onChange={handleChange}
                      type="date"
                      fullWidth
                    />
                  ) : (
                    project.deadline || 'N/A'
                  )}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </StyledTableContainer>
        </TableWrapper>
      </ContentArea>
    </Background>
  );
}