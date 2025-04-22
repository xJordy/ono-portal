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
  // Use a single formData object instead of individual state variables
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    day: "",
    time: "",
    descr: ""
  });

  // Update form when editing a course
  useEffect(() => {
    if (courseToEdit) {
      // Set all form fields at once
      setFormData({
        name: courseToEdit.name || "",
        instructor: courseToEdit.instructor || "",
        day: courseToEdit.day || "",
        time: courseToEdit.time || "",
        descr: courseToEdit.descr || ""
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        instructor: "",
        day: "",
        time: "",
        descr: ""
      });
    }
  }, [courseToEdit]);

  // Handle change for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, instructor, day, time, descr } = formData;

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
      const existingIds = courses.map((c) => c.id);
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
      setFormData({
        name: "",
        instructor: "",
        day: "",
        time: "",
        descr: ""
      });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {courseToEdit ? "ערוך את פרטי הקורס" : "מלא את פרטי הקורס"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="שם הקורס"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם המרצה"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          required
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            sx={{ input: { textAlign: "center" } }}
            select
            fullWidth
            margin="normal"
            label="יום"
            name="day"
            value={formData.day}
            onChange={handleChange}
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
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="תיאור"
          name="descr"
          value={formData.descr}
          onChange={handleChange}
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
