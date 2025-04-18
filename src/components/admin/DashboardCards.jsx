import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const DashboardCards = ({ courses }) => {
  // Reusable card component to avoid repetition
  const StatCard = ({ value, label }) => (
    <Card
      sx={{
        minWidth: 150,
        maxWidth: 220,
        backgroundColor: "white",
        boxShadow: 2,
        borderRadius: 2,
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-4px)",
          borderColor: "primary.light",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h3"
          component="div"
          align="center"
          sx={{
            fontWeight: "500",
            mb: 1,
            color: "#2c3e50",
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "#7f8c8d",
            fontSize: "1rem",
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );

  // Calculate statistics
  const totalAssignments = courses.reduce(
    (total, course) => total + (course.assignments?.length || 0),
    0
  );

  const totalMessages = courses.reduce(
    (total, course) => total + (course.messages?.length || 0),
    0
  );

  const totalStudents = courses.reduce(
    (total, course) => total + (course.students?.length || 0),
    0
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        לוח בקרה
      </Typography>
      <Typography gutterBottom>
        ברוך הבא למערכת ניהול הקורסים. השתמש בתפריט כדי לנווט.
      </Typography>

      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 3 }}>
        <StatCard value={courses.length} label="קורסים" />
        {/* TODO: Show messages from Students? */}
        <StatCard value={totalAssignments} label="מטלות" />
        <StatCard value={totalMessages} label="הודעות" />
        <StatCard value={totalStudents} label="סטודנטים" />
      </Box>
    </Box>
  );
};

export default DashboardCards;
