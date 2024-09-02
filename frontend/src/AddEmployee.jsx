import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stepper, Step, StepLabel, Paper, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./hooks/useAuth.js";
const Background = styled(Box)({
  height: '100vh',
  backgroundColor: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledPaper = styled(Paper)({
  padding: '40px',
  maxWidth: '800px',
  width: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const StyledStepper = styled(Stepper)({
  marginBottom: '30px',
});

const StyledButton = styled(Button)({
  marginTop: '20px',
  backgroundColor: '#4caf50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
});

const CustomMenuItem = styled(MenuItem)({
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

const sections = [
  'Personal Information 1',
  'Personal Information 2',
  'Education and Qualification',
  'Experience',
  'Current Role and Designation',
  'Bank Details'
];

export default function AddEmployee() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    DoB: '',
    phone_number: '',
    email: '',
    address: '',
    aadhar_number: '',
    highest_qualification: '',
    university: '',
    percentage: '',
    year_of_graduation: '',
    experience_type: 'Fresher',  // New state for experience type
    previous_employer: '',
    years_of_experience: '',
    previous_role: '',
    current_role: '',
    department: '',
    joining_date: '',
    bank_name: '',
    account_number: '',
    ifsc_code: ''
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', formData);

    axios.post('http://localhost:5000/addEmployee', formData)
      .then(response => {
        console.log('Employee added:', response.data);
        navigate('/home');
      })
      .catch(error => {
        console.error('Error adding employee:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <Background>
      <StyledPaper>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Employee
        </Typography>

        <StyledStepper activeStep={activeStep} alternativeLabel>
          {sections.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        <Box>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personal Information 1
              </Typography>
              <TextField fullWidth label="First Name" margin="normal" name="first_name" value={formData.first_name} onChange={handleChange} required />
              <TextField fullWidth label="Last Name" margin="normal" name="last_name" value={formData.last_name} onChange={handleChange} required />
              <TextField fullWidth label="Date of Birth" margin="normal" name="DoB" type="date" InputLabelProps={{ shrink: true }} value={formData.DoB} onChange={handleChange} required />
              <TextField fullWidth label="Phone Number" margin="normal" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personal Information 2
              </Typography>
              <TextField fullWidth label="Email" margin="normal" name="email" value={formData.email} onChange={handleChange} required />
              <TextField fullWidth label="Address" margin="normal" name="address" value={formData.address} onChange={handleChange} required />
              <TextField fullWidth label="Aadhar Number" margin="normal" name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} required />
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Education and Qualification
              </Typography>
              <TextField
                fullWidth
                select
                label="Highest Qualification"
                margin="normal"
                name="highest_qualification"
                value={formData.highest_qualification}
                onChange={handleChange}
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 250,
                    },
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
              >
                {['B.E', 'M.E', 'B.Tech', 'M.Tech', 'BBA', 'MBA', 'MCA', 'BCA', 'B.Sc', 'M.Sc'].map((option) => (
                  <CustomMenuItem key={option} value={option}>
                    {option}
                  </CustomMenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="University" margin="normal" name="university" value={formData.university} onChange={handleChange} required />
              <TextField fullWidth label="Percentage" margin="normal" name="percentage" value={formData.percentage} onChange={handleChange} required />
              <TextField fullWidth select label="Year of Graduation" margin="normal" name="year_of_graduation" value={formData.year_of_graduation} onChange={handleChange} required>
                {Array.from(new Array(25), (val, i) => 2000 + i).map(year => (
                  <CustomMenuItem key={year} value={year}>{year}</CustomMenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Experience
              </Typography>
              <RadioGroup
                row
                name="experience_type"
                value={formData.experience_type}
                onChange={handleChange}
              >
                <FormControlLabel value="Fresher" control={<Radio />} label="Fresher" />
                <FormControlLabel value="Experienced" control={<Radio />} label="Experienced" />
              </RadioGroup>

              {formData.experience_type === 'Experienced' && (
                <>
                  <TextField fullWidth label="Previous Employer" margin="normal" name="previous_employer" value={formData.previous_employer} onChange={handleChange} />
                  <TextField fullWidth label="Years of Experience" margin="normal" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} />
                  <TextField fullWidth label="Previous Role" margin="normal" name="previous_role" value={formData.previous_role} onChange={handleChange} />
                </>
              )}
            </Box>
          )}

          {activeStep === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Role and Designation
              </Typography>
              <TextField fullWidth select label="Current Role" margin="normal" name="current_role" value={formData.current_role} onChange={handleChange} required>
                {['Intern', 'Trainee', 'Junior', 'Senior','Team Lead','Manager'].map((option) => (
                  <CustomMenuItem key={option} value={option}>
                    {option}
                  </CustomMenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Department" margin="normal" name="department" value={formData.department} onChange={handleChange} required />
              <TextField fullWidth label="Joining Date" margin="normal" name="joining_date" type="date" InputLabelProps={{ shrink: true }} value={formData.joining_date} onChange={handleChange} required />
            </Box>
          )}

          {activeStep === 5 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Bank Details
              </Typography>
              <TextField fullWidth label="Bank Name" margin="normal" name="bank_name" value={formData.bank_name} onChange={handleChange} required />
              <TextField fullWidth label="Account Number" margin="normal" name="account_number" value={formData.account_number} onChange={handleChange} required />
              <TextField fullWidth label="IFSC Code" margin="normal" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} required />
            </Box>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === sections.length - 1 ? (
            <StyledButton onClick={handleSubmit}>
              Submit
            </StyledButton>
          ) : (
            <StyledButton onClick={handleNext}>
              Next
            </StyledButton>
          )}
        </Box>
      </StyledPaper>
    </Background>
  );
}
