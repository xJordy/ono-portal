import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "אישור",
  cancelText = "ביטול",
  severity = "error",
  disabled = false, // Add this new prop
}) => {
  return (
    <Dialog open={open} onClose={onClose} dir="rtl">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={disabled}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          color={severity}
          variant="contained"
          autoFocus
          disabled={disabled}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;