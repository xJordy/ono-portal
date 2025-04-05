import React from "react";
import { TextField, DialogContent, DialogActions, Button } from "@mui/material";

const AssignmentForm = ({ assignment, onSubmit, onCancel, isEditMode }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Initialize form when editing an assignment
  React.useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="כותרת"
          fullWidth
          name="title"
          value={formData.title}
          onChange={handleChange}
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
          required
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" variant="contained">
          {isEditMode ? "עדכן מטלה" : "הוסף מטלה"}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AssignmentForm;
