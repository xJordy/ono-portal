import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  FormHelperText,
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
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    day: "",
    time: "",
    descr: ""
  });

  // Track touched fields for validation
  const [touched, setTouched] = useState({
    name: false,
    instructor: false,
    day: false,
    time: false,
    descr: false
  });

  // Track form errors
  const [errors, setErrors] = useState({
    name: "",
    instructor: "",
    day: "",
    time: "",
    descr: ""
  });

  // Update form when editing a course
  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        name: courseToEdit.name || "",
        instructor: courseToEdit.instructor || "",
        day: courseToEdit.day || "",
        time: courseToEdit.time || "",
        descr: courseToEdit.descr || ""
      });
      // Reset touched and errors when editing
      setTouched({
        name: false,
        instructor: false,
        day: false,
        time: false,
        descr: false
      });
      setErrors({
        name: "",
        instructor: "",
        day: "",
        time: "",
        descr: ""
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

  // Validate form data
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "שם הקורס הוא שדה חובה";
        } else if (value.trim().length < 3) {
          error = "שם הקורס חייב להכיל לפחות 3 תווים";
        }
        break;
      case "instructor":
        if (!value.trim()) {
          error = "שם המרצה הוא שדה חובה";
        }
        break;
      case "day":
        if (!value) {
          error = "יש לבחור יום";
        }
        break;
      case "time":
        if (!value) {
          error = "יש לבחור שעה";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Handle blur event for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle change for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If field has been touched, validate on change
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(name => {
      const error = validateField(name, formData[name]);
      newErrors[name] = error;
      if (error) isValid = false;
      
      // Mark all fields as touched
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
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
        studentIds: courseToEdit.studentIds,
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
      setTouched({
        name: false,
        instructor: false,
        day: false,
        time: false,
        descr: false
      });
      setErrors({
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

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          label="שם הקורס"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם המרצה"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.instructor && Boolean(errors.instructor)}
          helperText={touched.instructor && errors.instructor}
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
            onBlur={handleBlur}
            error={touched.day && Boolean(errors.day)}
            helperText={touched.day && errors.day}
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
            onBlur={handleBlur}
            error={touched.time && Boolean(errors.time)}
            helperText={touched.time && errors.time}
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
          onBlur={handleBlur}
          error={touched.descr && Boolean(errors.descr)}
          helperText={touched.descr && errors.descr}
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
