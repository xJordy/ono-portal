import React, { useEffect, useState } from "react";
import { Student } from "../../models/Models";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
// Add this import
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function StudentForm({ onSave, studentToEdit, students = [] }) {
  // Simple state to store form data
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // Add birthDate state
  const [birthDate, setBirthDate] = useState(null);

  // Update form when editing a student
  useEffect(() => {
    if (studentToEdit) {
      setId(studentToEdit.id);
      setFirstName(studentToEdit.firstName);
      setLastName(studentToEdit.lastName);
      setEmail(studentToEdit.email);
      // Set birthDate if it exists
      if (studentToEdit.birthDate) {
        setBirthDate(studentToEdit.birthDate);
      }
    } else {
      // Reset form when not editing
      setId("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setBirthDate(null);
    }
  }, [studentToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (studentToEdit) {
      // If editing, update the existing student
      const updatedStudent = new Student({
        id: studentToEdit.id,
        firstName,
        lastName,
        email,
        birthDate, // Include birthDate
      });
      onSave(updatedStudent);
    } else {
      // If adding a new student, check if ID already exists
      const existingIds = students.map((s) => s.id);

      if (existingIds.includes(id)) {
        // Show error - ID already exists
        alert("מספר תעודת זהות כבר קיים במערכת. אנא בחר מספר אחר.");
        return;
      }

      const newStudent = new Student({
        id, // Use the ID input by the user
        firstName,
        lastName,
        email,
        birthDate, // Include birthDate
      });
      onSave(newStudent);
    }

    // Reset form after saving
    if (!studentToEdit) {
      setId("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setBirthDate(null);
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
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          type="number"
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם פרטי"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם משפחה"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        {/* Update DatePicker to use dd/MM/yyyy format */}
        <DatePicker
          label="תאריך לידה"
          value={birthDate}
          onChange={(newValue) => setBirthDate(newValue)}
          format="DD/MM/YYYY"  // Add this line for date format
          slotProps={{ 
            textField: { 
              fullWidth: true,
              margin: "normal",
              required: true,
              placeholder: "DD/MM/YYYY" // Add placeholder to guide the user
            } 
          }}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
