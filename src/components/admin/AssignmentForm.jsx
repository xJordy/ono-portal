import { useState, useEffect } from "react";
import { TextField, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";

const AssignmentForm = ({ 
  assignment, 
  onSubmit, 
  onCancel, 
  isEditMode,
  isSaving = false // Add this prop with default value
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    dueDate: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Initialize form when editing an assignment
  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate || "",
      });
      // Reset touched and errors when editing
      setTouched({
        title: false,
        description: false,
        dueDate: false,
      });
      setErrors({
        title: "",
        description: "",
        dueDate: "",
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: "",
        description: "",
        dueDate: "",
      });
    }
  }, [assignment]);

  const validateField = (name, value) => {
    let error = "";
    const today = new Date().toISOString().split("T")[0];

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "כותרת היא שדה חובה";
        } else if (value.trim().length < 3) {
          error = "כותרת חייבת להכיל לפחות 3 תווים";
        }
        break;
      case "description":
        if (!value.trim()) {
          error = "תיאור הוא שדה חובה";
        } else if (value.trim().length < 10) {
          error = "תיאור חייב להכיל לפחות 10 תווים";
        }
        break;
      case "dueDate":
        if (!value) {
          error = "תאריך הגשה הוא שדה חובה";
        } else if (value < today) {
          error = "תאריך ההגשה לא יכול להיות בעבר";
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

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="כותרת"
          fullWidth
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && Boolean(errors.title)}
          helperText={touched.title && errors.title}
          required
        />
        <TextField
          margin="dense"
          label="תיאור"
          fullWidth
          multiline
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
          required
        />
        <TextField
          margin="dense"
          label="תאריך הגשה"
          type="date"
          fullWidth
          name="dueDate"
          sx={{
            "& input": {
              textAlign: "center",
            },
            "& input::-webkit-calendar-picker-indicator": {
              display: "none",
            },
          }}
          value={formData.dueDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dueDate && Boolean(errors.dueDate)}
          helperText={touched.dueDate && errors.dueDate}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          type="button" 
          onClick={onCancel}
          disabled={isSaving}
        >
          ביטול
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              {isEditMode ? "מעדכן..." : "מוסיף..."}
            </>
          ) : (
            isEditMode ? "עדכן מטלה" : "הוסף מטלה"
          )}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AssignmentForm;
