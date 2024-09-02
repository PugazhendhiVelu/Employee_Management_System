import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
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

const UploadEmployee = () => {
    useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        excelFile: null,
        sheetName: '',
        rowStart: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,  
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('uploadfile', formData.uploadfile);  // Ensure the key is 'uploadfile'
        if (formData.sheetName) data.append('sheetName', formData.sheetName);
        if (formData.rowStart) data.append('rowStart', formData.rowStart);
    
        try {
            await axios.post('http://localhost:5000/excel/upload', data);
            navigate('/home');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    

    return (
        <Background>
            <StyledPaper>
                <Typography variant="h4" align="center" gutterBottom>
                    Upload Excel File
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        type="file"
                        label="Excel File"
                        margin="normal"
                        name="uploadfile"
                        onChange={handleChange}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Sheet Name (Optional)"
                        margin="normal"
                        name="sheetName"
                        value={formData.sheetName}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Row Start (Optional)"
                        margin="normal"
                        name="rowStart"
                        value={formData.rowStart}
                        onChange={handleChange}
                        type="number"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </form>
            </StyledPaper>
        </Background>
    );
};

export default UploadEmployee;