import React, { useState, useEffect } from "react";
import { TextField, DialogContent, DialogActions, Button } from "@mui/material";

const MessageForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sender: "מנהל",
  });

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
    // Reset form
    setFormData({
      title: "",
      content: "",
      sender: "מנהל",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent sx={{ width: "550px", height: "300px" }}>
        <TextField
          autoFocus
          margin="dense"
          label="נושא ההודעה"
          fullWidth
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          autoFocus
          margin="dense"
          label="תוכן ההודעה"
          fullWidth
          multiline
          rows={9}
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" variant="contained">
          שלח
        </Button>
      </DialogActions>
    </form>
  );
};

export default MessageForm;
