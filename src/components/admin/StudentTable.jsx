import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import ConfirmationDialog from "../common/ConfirmationDialog";

// Add this helper function to format date
const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  
  // Handle both Date objects and dayjs objects
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Add skipConfirmation to props
export default function StudentTable({
  students,
  onEdit,
  onDelete,
  tableProps,
  columnWidths = {},
  actionButtons = { edit: true, delete: true },
  skipConfirmation = false // Add this prop
}) {
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleDeleteClick = (studentId, e) => {
    e.stopPropagation();
    if (skipConfirmation) {
      // Call delete directly if confirmation is skipped
      onDelete(studentId);
    } else {
      // Show confirmation dialog as usual
      setStudentToDelete(studentId);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(studentToDelete);
    setStudentToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%", ...(tableProps?.sx || {}) }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell width={columnWidths.id}>תעודת זהות</TableCell>
              <TableCell
                width={columnWidths.firstName}
                sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
              >
                שם פרטי
              </TableCell>
              <TableCell width={columnWidths.lastName}>שם משפחה</TableCell>
              <TableCell width={columnWidths.email}>אימייל</TableCell>
              {/* Add birth date header */}
              <TableCell width={columnWidths.birthDate}>תאריך לידה</TableCell>
              <TableCell width={columnWidths.actions}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  אין סטודנטים עדיין. הוסף את הסטודנט הראשון בתפריט בצד ימין!
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  {/* Add birth date cell */}
                  <TableCell>{formatDate(student.birthDate)}</TableCell>
                  <TableCell>
                    {actionButtons.edit && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => onEdit(student)}
                      >
                        ערוך
                      </Button>
                    )}
                    {actionButtons.delete && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ ml: actionButtons.edit ? 1 : 0 }}
                        onClick={(e) => handleDeleteClick(student.id, e)}
                      >
                        מחק
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={studentToDelete !== null}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="אישור מחיקה"
        message="האם אתה בטוח שברצונך למחוק את הסטודנט הזה? פעולה זו לא ניתנת לביטול."
        confirmText="כן, מחק"
        cancelText="לא, השאר את הסטודנט"
      />
    </>
  );
}
