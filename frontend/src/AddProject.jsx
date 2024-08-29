// src/pages/AddProject.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useProject } from './context/ProjectContext';

export default function AddProject() {
  const { project, setProject } = useProject();
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee data from backend
    axios.get('http://localhost:5000/', { withCredentials: true })
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleAddTeam = () => {
    setProject(prev => ({
      ...prev,
      teams: [...prev.teams, { id: Date.now(), name: '', leaderId: '', leaderName: '', members: [], membersNames: [] }]
    }));
  };

  const handleDeleteTeam = (teamId) => {
    setProject(prev => ({
      ...prev,
      teams: prev.teams.filter(team => team.id !== teamId)
    }));
  };

  const handleTeamChange = (index, type, value) => {
    setProject(prev => {
      const newTeams = [...prev.teams];
      newTeams[index][type] = value;
      return { ...prev, teams: newTeams };
    });
  };

  const handleAddMember = (teamIndex) => {
    navigate('/employee-list', { state: { type: 'members', index: teamIndex } });
  };

  const handleSubmit = () => {
    console.log(project)
    axios.post('http://localhost:5000/addproject/new', project, { withCredentials: true })
      .then(() => navigate('/home'))
      .catch(error => console.error('Error adding project:', error));
  };

  return (
    <Box component={Paper} sx={{ padding: '30px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom align="center">Add New Project</Typography>
      <TextField
        label="Project Name"
        fullWidth
        value={project.name}
        onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        label="Project Manager"
        fullWidth
        value={project.managerName}
        onClick={() => navigate('/employee-list', { state: { type: 'manager' } })}
        sx={{ marginBottom: '20px' }}
      />
      {project.teams.map((team, index) => (
        <Box key={team.id} sx={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Team {index + 1}</Typography>
          <TextField
            label="Team Name"
            fullWidth
            value={team.name}
            onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            label="Team Leader"
            fullWidth
            value={team.leaderName}
            onClick={() => navigate('/employee-list', { state: { type: 'leader', index } })}
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            label="Team Members"
            fullWidth
            value={Array.isArray(team.membersNames) ? team.membersNames.join(', ') : ''}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddMember(index)}
                  style={{ height: '40px', width: '100px' }}
                >
                  Add
                </Button>
              )
            }}
            sx={{ marginBottom: '15px' }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteTeam(team.id)}
            sx={{ marginTop: '10px' }}
          >
            Delete Team
          </Button>
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={handleAddTeam}
        sx={{ marginBottom: '20px' }}
      >
        Add Another Team
      </Button>
      <TextField
        label="Project Description"
        fullWidth
        multiline
        rows={4}
        value={project.description}
        onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
        sx={{ marginBottom: '20px' }}
      />
      <TextField
        label="Deadline"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={project.deadline}
        onChange={(e) => setProject(prev => ({ ...prev, deadline: e.target.value }))}
        sx={{ marginBottom: '20px' }}
      />
      <Button
        variant="contained"
        sx={{ backgroundColor: '#4caf50', color: '#fff', '&:hover': { backgroundColor: '#45a049' } }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

