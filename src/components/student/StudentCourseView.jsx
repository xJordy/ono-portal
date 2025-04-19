import React from "react";
import { Box, Button, Typography, Paper, Tabs, Tab } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StudentCourseView = ({ course, onBack }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!course) return <Typography>לא נמצא קורס</Typography>;

  return (
    <Box>
      <Button 
        variant="outlined" 
        onClick={onBack} 
        sx={{ mb: 2 }}
        startIcon={<ArrowBackIcon />}
      >
        חזרה לרשימת הקורסים
      </Button>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h4">{course.name}</Typography>
        <Box sx={{ display: "flex", mt: 2, gap: 4 }}>
          <Typography variant="subtitle1">
            מרצה: {course.instructor}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
            {course.day} {course.time}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {course.descr}
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="course tabs"
        >
          <Tab label="מטלות" />
          <Tab label="הודעות" />
        </Tabs>
      </Box>

      {/* Assignments Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>מטלות הקורס</Typography>
        {course.assignments && course.assignments.length > 0 ? (
          course.assignments.map(assignment => (
            <Paper key={assignment.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">{assignment.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                תאריך הגשה: {assignment.dueDate}
              </Typography>
              <Typography variant="body1">
                {assignment.description}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography>אין מטלות לקורס זה עדיין.</Typography>
        )}
      </TabPanel>

      {/* Messages Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>הודעות הקורס</Typography>
        {course.messages && course.messages.length > 0 ? (
          course.messages.map(message => (
            <Paper key={message.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {message.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                מאת: {message.sender} | תאריך: {new Date(message.timestamp).toLocaleDateString('he-IL')}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {message.content}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography>אין הודעות לקורס זה עדיין.</Typography>
        )}
      </TabPanel>
    </Box>
  );
};

export default StudentCourseView;