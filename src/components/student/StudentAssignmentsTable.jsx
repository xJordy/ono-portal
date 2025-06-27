import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentAssignmentsTable = ({ courses, selectedStudentId }) => {
  const navigate = useNavigate();

  // Extract all assignments from all courses
  const assignments = courses.flatMap((course) =>
    (course.assignments || []).map((assignment) => ({
      ...assignment,
      courseName: course.name,
      courseId: course.id,
    }))
  );

  // Sort assignments by due date (upcoming first)
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  // Handle row click to navigate to course view
  const handleAssignmentClick = (assignment) => {
    if (selectedStudentId) {
      navigate(`/student/${selectedStudentId}/viewCourse/${assignment.courseId}`);
    }
  };

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
                <TableRow
                  key={assignment.id}
                  onClick={() => handleAssignmentClick(assignment)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                      backgroundColor: "rgba(25, 118, 210, 0.12)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      color: "primary.main",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {assignment.courseName}
                  </TableCell>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {assignment.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="caption"
        sx={{ mt: 1, display: "block", textAlign: "center" }}
      >
        המטלות מסודרות לפי תאריך הגשה (הקרובות ביותר בראש הטבלה)
        <br />
        <Typography variant="caption" color="primary.main">
          לחץ על שורה כדי לעבור לקורס המתאים
        </Typography>
      </Typography>
    </>
  );
};

export default StudentAssignmentsTable;
