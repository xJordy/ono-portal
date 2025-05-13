import { useEffect, useState } from "react";
import { Student } from "../../models/Models";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function StudentForm({ onSave, studentToEdit, students = [] }) {
  // Form data state
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: null,
  });

  // Track touched fields for validation
  const [touched, setTouched] = useState({
    id: false,
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
  });

  // Track form errors
  const [errors, setErrors] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
  });

  // Update form when editing a student
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        id: studentToEdit.id || "",
        firstName: studentToEdit.firstName || "",
        lastName: studentToEdit.lastName || "",
        email: studentToEdit.email || "",
        birthDate: studentToEdit.birthDate
          ? dayjs(studentToEdit.birthDate)
          : null,
      });
      // Reset touched and errors when editing
      setTouched({
        id: false,
        firstName: false,
        lastName: false,
        email: false,
        birthDate: false,
      });
      setErrors({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
      });
    } else {
      // Reset form when not editing
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: null,
      });
    }
  }, [studentToEdit]);

  // Validate form data
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "id":
        if (!value.trim()) {
          error = "מספר תעודת זהות הוא שדה חובה";
        } else if (!/^\d{9}$/.test(value)) {
          error = "תעודת זהות חייבת להכיל 9 ספרות";
        } else if (!studentToEdit && students.some((s) => s.id === value)) {
          error = "מספר תעודת זהות כבר קיים במערכת";
        }
        break;
      case "firstName":
        if (!value.trim()) {
          error = "שם פרטי הוא שדה חובה";
        } else if (value.trim().length < 2) {
          error = "שם פרטי חייב להכיל לפחות 2 תווים";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "שם משפחה הוא שדה חובה";
        } else if (value.trim().length < 2) {
          error = "שם משפחה חייב להכיל לפחות 2 תווים";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "כתובת אימייל היא שדה חובה";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "כתובת אימייל אינה תקינה";
        }
        break;
      case "birthDate":
        if (!value) {
          error = "תאריך לידה הוא שדה חובה";
        } else if (dayjs(value).isAfter(dayjs())) {
          error = "תאריך לידה לא יכול להיות בעתיד";
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
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle change for text input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If field has been touched, validate on change
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Special handler for DatePicker
  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: newValue,
    }));

    // If field has been touched, validate on change
    if (touched.birthDate) {
      const error = validateField("birthDate", newValue);
      setErrors((prev) => ({
        ...prev,
        birthDate: error,
      }));
    }
  };

  // Mark birthDate as touched when the date picker loses focus
  const handleDateBlur = () => {
    setTouched((prev) => ({
      ...prev,
      birthDate: true,
    }));

    const error = validateField("birthDate", formData.birthDate);
    setErrors((prev) => ({
      ...prev,
      birthDate: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((name) => {
      const error = validateField(name, formData[name]);
      newErrors[name] = error;
      if (error) isValid = false;

      // Mark all fields as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
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
        enrolledCourses: studentToEdit.enrolledCourses || [],
      });
      onSave(updatedStudent);
    } else {
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
        birthDate: null,
      });
      setTouched({
        id: false,
        firstName: false,
        lastName: false,
        email: false,
        birthDate: false,
      });
      setErrors({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
      });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {studentToEdit ? "ערוך את פרטי סטודנט" : "מלא את פרטי הסטודנט"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          label="תעודת זהות"
          name="id"
          value={formData.id}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.id && Boolean(errors.id)}
          helperText={touched.id && errors.id}
          required
          disabled={!!studentToEdit} // Disable ID field when editing
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם פרטי"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="שם משפחה"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && Boolean(errors.lastName)}
          helperText={touched.lastName && errors.lastName}
          required
        />

        <DatePicker
          label="תאריך לידה"
          value={formData.birthDate}
          onChange={handleDateChange}
          onClose={handleDateBlur}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true,
              placeholder: "DD/MM/YYYY",
              error: touched.birthDate && Boolean(errors.birthDate),
              helperText: touched.birthDate && errors.birthDate,
            },
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
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
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
