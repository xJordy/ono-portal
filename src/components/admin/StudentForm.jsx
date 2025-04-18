import React, { useEffect, useState } from "react";
import { Student } from "../../models/Models";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

export default function StudentForm({ onSave, studentToEdit, students = [] }) {
  // Simple state to store form data
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Update form when editing a student
  useEffect(() => {
    if (studentToEdit) {
      setId(studentToEdit.id);
      setFirstName(studentToEdit.firstName);
      setLastName(studentToEdit.lastName);
      setEmail(studentToEdit.email);
    } else {
      // Reset form when not editing
      setId("");
      setFirstName("");
      setLastName("");
      setEmail("");
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
      });
      onSave(newStudent);
    }

    // Reset form after saving
    if (!studentToEdit) {
      setId("");
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {studentToEdit ? "עריכת סטודנט" : "מלא את פרטי הסטודנט"}
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
