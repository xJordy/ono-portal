import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  List,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Assignment, Message, Student } from "../../models/Models";
import { saveCourseToLocalStorage } from "../../utils/localStorage";

// TabPanel component for tab content
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

const ManageCourse = ({ course, onBack }) => {
  const [currentCourse, setCurrentCourse] = useState(course);
  const [tabValue, setTabValue] = useState(0);

  // Form states
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [assignmentToEdit, setAssignmentToEdit] = useState(null);

  const [newMessage, setNewMessage] = useState({
    content: "",
    sender: "מנהל",
  });

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Dialog states
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Save changes to localStorage whenever the course changes
  useEffect(() => {
    if (currentCourse) {
      saveCourseToLocalStorage(currentCourse);
    }
  }, [currentCourse]);

  // Assignment handlers
  const handleAddAssignment = () => {
    const assignment = new Assignment(
      Date.now().toString(),
      newAssignment.title,
      newAssignment.description,
      newAssignment.dueDate
    );

    const updatedCourse = currentCourse.addAssignment(assignment);
    setCurrentCourse(updatedCourse);    

    setNewAssignment({ title: "", description: "", dueDate: "" });
    setOpenAssignmentDialog(false);
  };

  const handleEditAssignment = (assignment) => {
    setAssignmentToEdit(assignment.id);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
    });
    setOpenAssignmentDialog(true);
  };

  const handleUpdateAssignment = () => {
    const updatedCourse = currentCourse.updateAssignment(assignmentToEdit, {
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
    });
    setCurrentCourse(updatedCourse);
    // Reset your state accordingly
    setNewAssignment({ title: "", description: "", dueDate: "" });
    setAssignmentToEdit(null);
    setOpenAssignmentDialog(false);
  };

  const handleDeleteAssignment = (assignmentId) => {
    const updatedCourse = currentCourse.removeAssignment(assignmentId);
    setCurrentCourse(updatedCourse);
  };

  // Message handlers
  const handleAddMessage = () => {
    const message = new Message(
      Date.now().toString(),
      newMessage.content,
      newMessage.sender,
      new Date()
    );

    setCurrentCourse((prev) => {
      const updated = { ...prev };
      updated.messages = [...(prev.messages || []), message];
      return updated;
    });

    setNewMessage({ content: "", sender: "מנהל" });
    setOpenMessageDialog(false);
  };

  const handleDeleteMessage = (messageId) => {
    setCurrentCourse((prev) => {
      const updated = { ...prev };
      updated.messages = prev.messages.filter((m) => m.id !== messageId);
      return updated;
    });
  };

  // Student handlers
  const handleAddStudent = () => {
    const student = new Student(
      Date.now().toString(),
      newStudent.firstName,
      newStudent.lastName,
      newStudent.email
    );

    setCurrentCourse((prev) => {
      const updated = { ...prev };
      updated.students = [...(prev.students || []), student];
      // Also enroll the student in the course
      student.enrollInCourse(updated);
      return updated;
    });

    setNewStudent({ firstName: "", lastName: "", email: "" });
    setOpenStudentDialog(false);
  };

  const handleDeleteStudent = (studentId) => {
    setCurrentCourse((prev) => {
      const updated = { ...prev };
      updated.students = prev.students.filter((s) => s.id !== studentId);
      return updated;
    });
  };

  if (!currentCourse) return <Typography>לא נמצא קורס</Typography>;

  return (
    <Box>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        חזרה לרשימת הקורסים
      </Button>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h4">{currentCourse.name}</Typography>
        <Box sx={{ display: "flex", mt: 2, gap: 4 }}>
          <Typography variant="subtitle1">
            מרצה: {currentCourse.instructor}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
            {currentCourse.day} {currentCourse.time}
          </Typography>
        </Box>{" "}
        <Typography variant="body1" sx={{ mt: 2 }}>
          {currentCourse.descr}
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="course management tabs"
        >
          <Tab label="מטלות" />
          <Tab label="הודעות" />
          <Tab label="סטודנטים" />
        </Tabs>
      </Box>

      {/* Assignments Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">רשימת מטלות</Typography>
          <Button
            variant="contained"
            onClick={() => setOpenAssignmentDialog(true)}
          >
            הוסף מטלה
          </Button>
        </Box>

        <List elevation={2} sx={{}}>
          {currentCourse.assignments && currentCourse.assignments.length > 0 ? (
            currentCourse.assignments.map((assignment) => (
              <Paper key={assignment.id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{assignment.title}</Typography>
                  <IconButton
                    onClick={() => handleEditAssignment(assignment)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
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
        </List>
      </TabPanel>

      {/* Messages Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">הודעות הקורס</Typography>
          <Button
            variant="contained"
            onClick={() => setOpenMessageDialog(true)}
          >
            הוסף הודעה
          </Button>
        </Box>

        <List>
          {currentCourse.messages && currentCourse.messages.length > 0 ? (
            currentCourse.messages.map((message) => (
              <Paper key={message.id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2">
                    {message.sender} -{" "}
                    {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteMessage(message.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography variant="body1">{message.content}</Typography>
              </Paper>
            ))
          ) : (
            <Typography>אין הודעות לקורס זה עדיין.</Typography>
          )}
        </List>
      </TabPanel>

      {/* Students Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">סטודנטים בקורס</Typography>
          <Button
            variant="contained"
            onClick={() => setOpenStudentDialog(true)}
          >
            הוסף סטודנט
          </Button>
        </Box>

        <List>
          {currentCourse.students && currentCourse.students.length > 0 ? (
            currentCourse.students.map((student) => (
              <Paper key={student.id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">
                    {student.firstName} {student.lastName}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteStudent(student.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2">{student.email}</Typography>
              </Paper>
            ))
          ) : (
            <Typography>אין סטודנטים רשומים לקורס זה עדיין.</Typography>
          )}
        </List>
      </TabPanel>

      {/* Assignment Dialog */}
      <Dialog
        open={openAssignmentDialog}
        onClose={() => setOpenAssignmentDialog(false)}
      >
        <DialogTitle>הוסף מטלה חדשה</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="כותרת"
            fullWidth
            value={newAssignment.title}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="תיאור"
            fullWidth
            multiline
            rows={4}
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                description: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="תאריך הגשה"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAssignment.dueDate}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, dueDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignmentDialog(false)}>ביטול</Button>
          <Button onClick={assignmentToEdit ? handleUpdateAssignment : handleAddAssignment} variant="contained">
            {assignmentToEdit ? "עדכן מטלה" : "הוסף מטלה"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={openMessageDialog}
        onClose={() => setOpenMessageDialog(false)}
      >
        <DialogTitle>הוסף הודעה חדשה</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="תוכן ההודעה"
            fullWidth
            multiline
            rows={4}
            value={newMessage.content}
            onChange={(e) =>
              setNewMessage({ ...newMessage, content: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>ביטול</Button>
          <Button onClick={handleAddMessage} variant="contained">
            שלח
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Dialog */}
      <Dialog
        open={openStudentDialog}
        onClose={() => setOpenStudentDialog(false)}
      >
        <DialogTitle>הוסף סטודנט לקורס</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם פרטי"
            fullWidth
            value={newStudent.firstName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, firstName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="שם משפחה"
            fullWidth
            value={newStudent.lastName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, lastName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="אימייל"
            type="email"
            fullWidth
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentDialog(false)}>ביטול</Button>
          <Button onClick={handleAddStudent} variant="contained">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCourse;
