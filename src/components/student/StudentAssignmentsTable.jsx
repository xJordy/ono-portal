import React from "react";
import { 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Typography 
} from "@mui/material";

const StudentAssignmentsTable = ({ courses }) => {
  // Extract all assignments from all courses
  const assignments = courses.flatMap(course => 
    (course.assignments || []).map(assignment => ({
      ...assignment,
      courseName: course.name,
      courseId: course.id
    }))
  );

  // Sort assignments by due date (upcoming first)
  const sortedAssignments = [...assignments].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>שם הקורס</TableCell>
              <TableCell>שם המטלה</TableCell>
              <TableCell>תאריך הגשה</TableCell>
              <TableCell>תיאור</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  אין מטלות בקורסים שלך עדיין.
                </TableCell>
              </TableRow>
            ) : (
              sortedAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.courseName}</TableCell>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell sx={{ 
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {assignment.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
        המטלות מסודרות לפי תאריך הגשה (הקרובות ביותר בראש הטבלה)
      </Typography>
    </>
  );
};

export default StudentAssignmentsTable;