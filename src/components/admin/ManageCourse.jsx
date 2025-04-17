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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Assignment, Message, Student } from "../../models/Models";
import { saveCourseToLocalStorage } from "../../utils/localStorage";
import AssignmentForm from "./AssignmentForm";
import MessageForm from "./MessageForm";
import ConfirmationDialog from "../common/ConfirmationDialog";

// Add this right after your imports
const generateUniqueId = (existingIds) => {
  let id;
  do {
    id = Math.floor(1000 + Math.random() * 9000).toString();
  } while (existingIds.includes(id));
  return id;
};

// Update the formatDateTime function to return separate date and time
const formatDateTime = (timestamp) => {
  const date = new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(timestamp));

  const time = new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));

  return { date, time };
};

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

// Update the component signature to accept the new prop
const ManageCourse = ({ course, onBack, onCourseUpdate }) => {
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
  // Add these near your other state variables
const [assignmentToDelete, setAssignmentToDelete] = useState(null);
const [messageToDelete, setMessageToDelete] = useState(null);
const [studentToDelete, setStudentToDelete] = useState(null);

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
  const handleEditAssignment = (assignment) => {
    setAssignmentToEdit(assignment.id);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
    });
    setOpenAssignmentDialog(true);
  };

  const handleDeleteAssignment = (assignmentId) => {
    setAssignmentToDelete(assignmentId);
  };

  const handleConfirmDeleteAssignment = () => {
    const updatedCourse = currentCourse.removeAssignment(assignmentToDelete);
    setCurrentCourse(updatedCourse);
    if (onCourseUpdate) onCourseUpdate(updatedCourse);
    setAssignmentToDelete(null);
  };

  // Message handlers
  const handleAddMessage = (formData) => {
    const existingIds = currentCourse.messages.map(m => m.id);
    const message = new Message(
      generateUniqueId(existingIds),
      formData.title,
      formData.content,
      formData.sender,
      new Date()
    );

    const updatedCourse = currentCourse.addMessage(message);
    setCurrentCourse(updatedCourse);
    
    // Add this line to propagate the change to parent
    if (onCourseUpdate) onCourseUpdate(updatedCourse);
    
    setOpenMessageDialog(false);
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
  };

  const handleConfirmDeleteMessage = () => {
    const updatedCourse = currentCourse.removeMessage(messageToDelete);
    setCurrentCourse(updatedCourse);
    if (onCourseUpdate) onCourseUpdate(updatedCourse);
    setMessageToDelete(null);
  };

  // Student handlers
  const handleAddStudent = () => {
    const existingIds = currentCourse.students?.map(s => s.id) || [];
    const student = new Student(
      generateUniqueId(existingIds),
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
    if (onCourseUpdate) onCourseUpdate(currentCourse);
  };

  const handleDeleteStudent = (studentId) => {
    setStudentToDelete(studentId);
  };

  const handleConfirmDeleteStudent = () => {
    setCurrentCourse((prev) => {
      const updated = { ...prev };
      updated.students = prev.students.filter((s) => s.id !== studentToDelete);
      return updated;
    });
    if (onCourseUpdate) onCourseUpdate(currentCourse);
    setStudentToDelete(null);
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
            onClick={() => {
              // Reset assignmentToEdit before opening dialog for a new assignment
              setAssignmentToEdit(null);
              setNewAssignment({ title: "", description: "", dueDate: "" });
              setOpenAssignmentDialog(true);
            }}
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
                  <Box sx={{ display: "flex", gap: 1 }}>
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
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {message.title}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeleteMessage(message.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                  מאת: {message.sender} | תאריך:{" "}
                  {formatDateTime(message.timestamp).date} | שעה:{" "}
                  {formatDateTime(message.timestamp).time}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap'}}>{message.content}</Typography>
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
        onClose={() => {
          setOpenAssignmentDialog(false);
          setAssignmentToEdit(null);
          setNewAssignment({ title: "", description: "", dueDate: "" });
        }}
        disableRestoreFocus
        disableEnforceFocus={false}
        disableAutoFocus={false}
      >
        <DialogTitle>
          {assignmentToEdit ? "עדכן מטלה" : "הוסף מטלה חדשה"}
        </DialogTitle>
        <AssignmentForm
          assignment={assignmentToEdit ? newAssignment : null}
          isEditMode={!!assignmentToEdit}
          onSubmit={(formData) => {
            if (assignmentToEdit) {
              // Update assignment with form data
              const updatedCourse = currentCourse.updateAssignment(
                assignmentToEdit,
                {
                  title: formData.title,
                  description: formData.description,
                  dueDate: formData.dueDate,
                }
              );
              setCurrentCourse(updatedCourse);
              if (onCourseUpdate) onCourseUpdate(updatedCourse);
            } else {
              // Add new assignment with 4-digit ID
              const existingIds = currentCourse.assignments?.map(a => a.id) || [];
              const assignment = new Assignment(
                generateUniqueId(existingIds),
                formData.title,
                formData.description,
                formData.dueDate
              );
              const updatedCourse = currentCourse.addAssignment(assignment);
              setCurrentCourse(updatedCourse);
              if (onCourseUpdate) onCourseUpdate(updatedCourse);
            }
            // Reset state and close dialog
            setNewAssignment({ title: "", description: "", dueDate: "" });
            setAssignmentToEdit(null);
            setOpenAssignmentDialog(false);
          }}
          onCancel={() => setOpenAssignmentDialog(false)}
        />
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={openMessageDialog}
        onClose={() => setOpenMessageDialog(false)}
        disableRestoreFocus
        disableEnforceFocus={false}
        disableAutoFocus={false}
      >
        <DialogTitle>הוסף הודעה חדשה</DialogTitle>
        <MessageForm
          onSubmit={handleAddMessage}
          onCancel={() => setOpenMessageDialog(false)}
        />
      </Dialog>

      {/* Student Dialog */}
      <Dialog
        open={openStudentDialog}
        onClose={() => setOpenStudentDialog(false)}
        // Add these props for better focus management
        disableRestoreFocus
        disableEnforceFocus={false}
        disableAutoFocus={false}
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

      <ConfirmationDialog
        open={assignmentToDelete !== null}
        onClose={() => setAssignmentToDelete(null)}
        onConfirm={handleConfirmDeleteAssignment}
        title="האם למחוק את המטלה?"
        message="פעולה זו תמחק את המטלה באופן מוחלט. האם אתה בטוח?"
        confirmText="כן, מחק מטלה"
      />

      <ConfirmationDialog
        open={messageToDelete !== null}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleConfirmDeleteMessage}
        title="האם למחוק את ההודעה?"
        message="פעולה זו תמחק את ההודעה באופן מוחלט. האם אתה בטוח?"
        confirmText="כן, מחק הודעה"
      />

      <ConfirmationDialog
        open={studentToDelete !== null}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDeleteStudent}
        title="האם להסיר את הסטודנט מהקורס?"
        message="פעולה זו תסיר את הסטודנט מרשימת המשתתפים בקורס. האם אתה בטוח?"
        confirmText="כן, הסר את הסטודנט"
      />
    </Box>
  );
};

export default ManageCourse;
