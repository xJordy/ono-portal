import React, { useState, useEffect } from "react";
import { TextField, DialogContent, DialogActions, Button } from "@mui/material";

const MessageForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
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
      content: "",
      sender: "מנהל",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="תוכן ההודעה"
          fullWidth
          multiline
          rows={4}
          columns={12}
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