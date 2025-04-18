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

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  tableProps,
  columnWidths = {},
}) {
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleDeleteClick = (studentId, e) => {
    e.stopPropagation();
    setStudentToDelete(studentId);
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
              <TableCell width={columnWidths.id}>מספר תעודת זהות</TableCell>
              <TableCell
                width={columnWidths.firstName}
                sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
              >
                שם פרטי
              </TableCell>
              <TableCell width={columnWidths.lastName}>שם משפחה</TableCell>
              <TableCell width={columnWidths.email}>אימייל</TableCell>
              <TableCell width={columnWidths.actions}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => onEdit(student)}
                    >
                      ערוך
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={(e) => handleDeleteClick(student.id, e)}
                    >
                      מחק
                    </Button>
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
