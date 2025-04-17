import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import ConfirmationDialog from "../common/ConfirmationDialog";

const CourseTable = ({
  courses,
  onEdit,
  onDelete,
  onManage,
  tableProps,
  columnWidths = {},
}) => {
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleDeleteClick = (courseId, e) => {
    e.stopPropagation();
    setCourseToDelete(courseId);
  };

  const handleConfirmDelete = () => {
    onDelete(courseToDelete);
    setCourseToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%", ...(tableProps?.sx || {}) }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell width={columnWidths.id}>קוד קורס</TableCell>
              <TableCell
                width={columnWidths.name}
                sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
              >
                שם הקורס
              </TableCell>
              <TableCell width={columnWidths.instructor}>מרצה</TableCell>
              <TableCell width={columnWidths.schedule}>יום ושעה</TableCell>
              <TableCell width={columnWidths.actions}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  אין קורסים עדיין. הוסף את הקורס הראשון בתפריט בצד ימין!
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={course.id}
                  onClick={() => onEdit(course)}
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>{course.id}</TableCell>
                  <TableCell
                    sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    {course.name}
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    {course.day} {course.time}
                  </TableCell>
                  <TableCell
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking buttons
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onManage(course);
                      }}
                    >
                      ניהול
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => handleDeleteClick(course.id, e)}
                      sx={{ ml: 1 }}
                    >
                      מחיקה
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={courseToDelete !== null}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="האם למחוק את הקורס?"
        message="פעולה זו תמחק את הקורס לצמיתות ותגרום לאובדן כל המטלות, הודעות ורשימות הסטודנטים הקשורים אליו. האם אתה בטוח?"
        confirmText="כן, מחק קורס"
      />
    </>
  );
};

export default CourseTable;
