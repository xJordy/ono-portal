import { useState } from "react";
import { TextField, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";

const MessageForm = ({ onSubmit, onCancel, isSaving = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sender: "מנהל",
  });

  const [touched, setTouched] = useState({
    title: false,
    content: false,
    sender: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    sender: "",
  });

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "נושא ההודעה הוא שדה חובה";
        } else if (value.trim().length < 3) {
          error = "נושא ההודעה חייב להכיל לפחות 3 תווים";
        }
        break;
      case "content":
        if (!value.trim()) {
          error = "תוכן ההודעה הוא שדה חובה";
        } else if (value.trim().length < 10) {
          error = "תוכן ההודעה חייב להכיל לפחות 10 תווים";
        }
        break;
      case "sender":
        if (!value.trim()) {
          error = "שם השולח הוא שדה חובה";
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
    // Reset form
    setFormData({
      title: "",
      content: "",
      sender: "מנהל",
    });
    setTouched({
      title: false,
      content: false,
      sender: false,
    });
    setErrors({
      title: "",
      content: "",
      sender: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogContent sx={{ width: "550px", height: "300px" }}>
        <TextField
          autoFocus
          margin="dense"
          label="נושא ההודעה"
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
          label="תוכן ההודעה"
          fullWidth
          multiline
          rows={9}
          name="content"
          value={formData.content}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.content && Boolean(errors.content)}
          helperText={touched.content && errors.content}
          required
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
              {"שולח..."}
            </>
          ) : (
            "שלח"
          )}
        </Button>
      </DialogActions>
    </form>
  );
};

export default MessageForm;
