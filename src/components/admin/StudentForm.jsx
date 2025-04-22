import React, { useEffect, useState } from "react";
import { Student } from "../../models/Models";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function StudentForm({ onSave, studentToEdit, students = [] }) {
  // Use a single formData object instead of individual state variables
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: null
  });

  // Update form when editing a student
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        id: studentToEdit.id || "",
        firstName: studentToEdit.firstName || "",
        lastName: studentToEdit.lastName || "",
        email: studentToEdit.email || "",
        // Convert birthDate to a dayjs object if it exists
        birthDate: studentToEdit.birthDate ? dayjs(studentToEdit.birthDate) : null
      });
    } else {
      // Reset form when not editing
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: null
      });
    }
  }, [studentToEdit]);

  // Handle change for text input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Special handler for DatePicker
  const handleDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      birthDate: newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, firstName, lastName, email, birthDate } = formData;

    // Convert dayjs object to native Date before saving
    const birthDateValue = birthDate ? birthDate.toDate() : null;

    if (studentToEdit) {
      const updatedStudent = new Student({
        id: studentToEdit.id,
        firstName,
        lastName,
        email,
        birthDate: birthDateValue,
      });
      onSave(updatedStudent);
    } else {
      const existingIds = students.map((s) => s.id);

      if (existingIds.includes(id)) {
        alert("מספר תעודת זהות כבר קיים במערכת. אנא בחר מספר אחר.");
        return;
      }

      const newStudent = new Student({
        id,
        firstName,
        lastName,
        email,
        birthDate: birthDateValue,
      });
      onSave(newStudent);
    }

    // Reset form after saving (if not editing)
    if (!studentToEdit) {
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: null
      });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {studentToEdit ? "ערוך את פרטי סטודנט" : "מלא את פרטי הסטודנט"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="תעודת זהות"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          type="number"
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם פרטי"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם משפחה"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <DatePicker
          label="תאריך לידה"
          value={formData.birthDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          slotProps={{ 
            textField: { 
              fullWidth: true,
              margin: "normal",
              required: true,
              placeholder: "DD/MM/YYYY"
            } 
          }}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="אימייל"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          type="email"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {studentToEdit ? "עדכן סטודנט" : "הוסף סטודנט"}
        </Button>
      </Box>
    </Paper>
  );
}
