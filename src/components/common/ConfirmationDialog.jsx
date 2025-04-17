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
  severity = "error", // can be "error", "warning", etc.
}) => {
  return (
    <Dialog open={open} onClose={onClose} dir="rtl">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          color={severity}
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;