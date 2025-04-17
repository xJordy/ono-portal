import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { Course } from "../../models/Models";

const generateUniqueId = (existingIds) => {
  let id;
  do {
    id = Math.floor(1000 + Math.random() * 9000).toString();
  } while (existingIds.includes(id));
  return id;
};

const CourseForm = ({ onSave, courseToEdit, courses = [] }) => {
  // Simple state to store form data
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [descr, setDescr] = useState("");

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
      setName("");
      setInstructor("");
      setDay("");
      setTime("");
      setDescr("");
    }
  }, [courseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (courseToEdit) {
      // If editing, update the existing course
      const updatedCourse = new Course({
        id: courseToEdit.id,
        name,
        instructor,
        day,
        time,
        descr,
        assignments: courseToEdit.assignments,
        messages: courseToEdit.messages,
        students: courseToEdit.students,
      });
      onSave(updatedCourse);
    } else {
      // If adding, create a new course with a unique ID
      const existingIds = courses.map(c => c.id);
      const newCourse = new Course({
        id: generateUniqueId(existingIds),
        name,
        instructor,
        day,
        time,
        descr,
      });
      onSave(newCourse);
    }

    // Clear form after submission (if not editing)
    if (!courseToEdit) {
      setName("");
      setInstructor("");
      setDay("");
      setTime("");
      setDescr("");
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {courseToEdit ? "עריכת קורס" : "מלא את פרטי הקורס"}
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

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            sx={{ input: { textAlign: "center" } }}
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
            type="time"
            sx={{
              "& input": {
                textAlign: "center",
              },
              "& input::-webkit-calendar-picker-indicator": {
                display: "none",
              },
            }}
            margin="normal"
            label="שעה"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </Box>

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
          {courseToEdit ? "עדכן קורס" : "הוסף קורס"}
        </Button>
      </Box>
    </Paper>
  );
};

export default CourseForm;
