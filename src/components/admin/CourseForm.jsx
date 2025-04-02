import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Course } from '../../models/Models';

const CourseForm = ({ onSave, courseToEdit }) => {
  // Simple state to store form data
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  
  // Update form when editing a course
  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name);
      setInstructor(courseToEdit.instructor);
    } else {
      // Reset form when not editing
      setName('');
      setInstructor('');
    }
  }, [courseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (courseToEdit) {
      // If editing, update the existing course
      courseToEdit.name = name;
      courseToEdit.instructor = instructor;
      onSave(courseToEdit);
    } else {
      // If adding, create a new course
      const newCourse = new Course(
        Date.now().toString(), // Simple ID
        name,
        instructor
      );
      onSave(newCourse);
    }
    
    // Clear form after submission (if not editing)
    if (!courseToEdit) {
      setName('');
      setInstructor('');
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {courseToEdit ? 'עריכת קורס' : 'הוספת קורס חדש'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="שם הקורס"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="שם המרצה"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          required
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          {courseToEdit ? 'עדכן קורס' : 'הוסף קורס'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CourseForm;