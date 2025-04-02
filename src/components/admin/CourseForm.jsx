import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { Course } from '../../models/Models';

const CourseForm = ({ onSave, courseToEdit }) => {
  // Simple state to store form data
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [descr, setDescr] = useState('');
  
  // Update form when editing a course
  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name);
      setInstructor(courseToEdit.instructor);
      setDay(courseToEdit.day);
      setTime(courseToEdit.time);
      setDescr(courseToEdit.descr);
    } else {
      // Reset form when not editing
      setName('');
      setInstructor('');
      setDay('');
      setTime('');
      setDescr('');
    }
  }, [courseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (courseToEdit) {
      // If editing, update the existing course
      courseToEdit.name = name;
      courseToEdit.instructor = instructor;
      courseToEdit.day = day;
      courseToEdit.time = time;
      courseToEdit.descr = descr;
      onSave(courseToEdit);
    } else {
      // If adding, create a new course
      const newCourse = new Course(
        Date.now().toString(), // Simple ID
        name,
        instructor,
        day,
        time,
        descr
      );
      onSave(newCourse);
    }
    
    // Clear form after submission (if not editing)
    if (!courseToEdit) {
      setName('');
      setInstructor('');
      setDay('');
      setTime('');
      setDescr('');
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {courseToEdit ? 'עריכת קורס' : 'מלא את פרטי הקורס'}
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

        <TextField
          select
          fullWidth
          margin="normal"
          label="יום"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        >
          <MenuItem value="יום א׳">ראשון</MenuItem>
          <MenuItem value="יום ב׳">שני</MenuItem>
          <MenuItem value="יום ג׳">שלישי</MenuItem>
          <MenuItem value="יום ד׳">רביעי</MenuItem>
          <MenuItem value="יום ה׳">חמישי</MenuItem>
        </TextField>

        <TextField
          fullWidth
          type='time'
          margin="normal"
          label="שעה"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="תיאור"
          value={descr}
          onChange={(e) => setDescr(e.target.value)}
          multiline
          rows={4}
          variant="outlined"
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