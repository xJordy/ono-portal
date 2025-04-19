import React, { useState, useEffect, useRef } from "react";
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
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  DialogContentText,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Assignment, Message, Student, Course } from "../../models/Models";
import {
  saveCourseToLocalStorage,
  getStudentsFromLocalStorage,
} from "../../utils/localStorage";
import AssignmentForm from "./AssignmentForm";
import MessageForm from "./MessageForm";
import ConfirmationDialog from "../common/ConfirmationDialog";
import StudentTable from "./StudentTable";

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
const ManageCourse = ({ course, onBack, onCourseUpdate, onStudentsUpdate }) => {
  const [currentCourse, setCurrentCourse] = useState(course);
  const [tabValue, setTabValue] = useState(0);

  // Add this to your other state declarations
  const isFirstRender = useRef(true);

  // Form states
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [assignmentToEdit, setAssignmentToEdit] = useState(null);

  // Dialog states
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  // Add these near your other state variables
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Add success alert state
  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: "",
    severity: "success", // Default to success for adds/edits
  });

  // Add these state variables with your other state declarations
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Add this effect to load all students when the component mounts
  useEffect(() => {
    const loadStudents = () => {
      const studentsData = getStudentsFromLocalStorage();
      // Create proper Student instances with methods
      const studentInstances = studentsData.map(student => 
        new Student({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          birthDate: student.birthDate,
          enrolledCourses: student.enrolledCourses || []
        })
      );
      setAllStudents(studentInstances);
    };

    loadStudents();
  }, []);

  // Add this function to get available students (not already enrolled)
  const getAvailableStudents = () => {
    // Get IDs of students already in the course
    const enrolledStudentIds =
      currentCourse.students?.map((student) => student.id) || [];

    // Filter out students who are already enrolled
    const availableStudents = allStudents.filter(
      (student) => !enrolledStudentIds.includes(student.id)
    );

    // Apply search filtering
    if (!searchQuery) return availableStudents;

    return availableStudents.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.includes(searchQuery)
    );
  };

  // Add this function to handle student selection
  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

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

  // Add this near your other useEffects, just after the state definitions
  const prevCourseRef = useRef(null);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Deep comparison to check if course actually changed meaningfully
    const hasChanged =
      JSON.stringify(prevCourseRef.current) !== JSON.stringify(currentCourse);

    if (onCourseUpdate && currentCourse && hasChanged) {
      // Store current state to compare later
      prevCourseRef.current = JSON.parse(JSON.stringify(currentCourse));

      // Use a timeout to break the synchronous update cycle
      const timeoutId = setTimeout(() => {
        onCourseUpdate(currentCourse);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [currentCourse, onCourseUpdate]);

  // Alternative - only update parent when specific actions occur
  const shouldUpdateParent = useRef(false);

  // And add a separate useEffect specifically for parent updates
  useEffect(() => {
    if (currentCourse && shouldUpdateParent.current) {
      onCourseUpdate(currentCourse);
      shouldUpdateParent.current = false;
    }
  }, [currentCourse, onCourseUpdate]);

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
    // Get the assignment title before deletion for the message
    const assignmentTitle =
      currentCourse.assignments.find((a) => a.id === assignmentToDelete)
        ?.title || "המטלה";

    const updatedCourse = currentCourse.removeAssignment(assignmentToDelete);
    setCurrentCourse(updatedCourse);
    if (onCourseUpdate) onCourseUpdate(updatedCourse);

    // Show info message for deletion instead of success
    setSuccessAlert({
      open: true,
      message: `${assignmentTitle} נמחקה בהצלחה!`,
      severity: "info", // Change to blue
    });

    setAssignmentToDelete(null);
  };

  // Add handler to close alert
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlert({ ...successAlert, open: false });
  };

  // Update the assignment submission handler
  const handleSubmitAssignment = (formData) => {
    if (assignmentToEdit) {
      // Update assignment with form data
      const updatedCourse = currentCourse.updateAssignment(assignmentToEdit, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
      });
      setCurrentCourse(updatedCourse);
      if (onCourseUpdate) onCourseUpdate(updatedCourse);

      // Show success message
      setSuccessAlert({
        open: true,
        message: `המטלה "${formData.title}" עודכנה בהצלחה!`,
      });
    } else {
      // Add new assignment with 4-digit ID
      const existingIds = currentCourse.assignments?.map((a) => a.id) || [];
      const assignment = new Assignment(
        generateUniqueId(existingIds),
        formData.title,
        formData.description,
        formData.dueDate
      );
      const updatedCourse = currentCourse.addAssignment(assignment);
      setCurrentCourse(updatedCourse);
      if (onCourseUpdate) onCourseUpdate(updatedCourse);

      // Show success message
      setSuccessAlert({
        open: true,
        message: `המטלה "${formData.title}" נוספה בהצלחה!`,
      });
    }
    // Reset state and close dialog
    setNewAssignment({ title: "", description: "", dueDate: "" });
    setAssignmentToEdit(null);
    setOpenAssignmentDialog(false);
  };

  // Message handlers
  const handleAddMessage = (formData) => {
    const existingIds = currentCourse.messages.map((m) => m.id);
    const message = new Message(
      generateUniqueId(existingIds),
      formData.title,
      formData.content,
      formData.sender,
      new Date()
    );

    const updatedCourse = currentCourse.addMessage(message);
    setCurrentCourse(updatedCourse);

    if (onCourseUpdate) onCourseUpdate(updatedCourse);

    // Show success message
    setSuccessAlert({
      open: true,
      message: `ההודעה "${formData.title}" נוספה בהצלחה!`,
    });

    setOpenMessageDialog(false);
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
  };

  const handleConfirmDeleteMessage = () => {
    // Get the message title before deletion for the message
    const messageTitle =
      currentCourse.messages.find((m) => m.id === messageToDelete)?.title ||
      "ההודעה";

    const updatedCourse = currentCourse.removeMessage(messageToDelete);
    setCurrentCourse(updatedCourse);
    if (onCourseUpdate) onCourseUpdate(updatedCourse);

    setSuccessAlert({
      open: true,
      message: `${messageTitle} נמחקה בהצלחה!`,
      severity: "info", // Change to blue
    });

    setMessageToDelete(null);
  };

  // Student handlers
  const handleAddStudents = () => {
    if (selectedStudents.length === 0) return;

    // Find the selected student objects - ensure they're proper Student instances
    const studentsToAdd = allStudents.filter((student) =>
      selectedStudents.includes(student.id)
    );

    // Track updated students for syncing back to the main state
    const updatedStudents = [];

    setCurrentCourse((prev) => {
      // Create a proper Course instance with all methods
      const updated = new Course({
        id: prev.id,
        name: prev.name,
        instructor: prev.instructor,
        day: prev.day,
        time: prev.time,
        descr: prev.descr,
        assignments: [...prev.assignments],
        messages: [...prev.messages],
        students: [...prev.students],
      });
      
      // Now use the proper enrollStudent method!
      studentsToAdd.forEach((student) => {
        // Create a proper Student instance with ALL properties
        const studentInstance = new Student({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          birthDate: student.birthDate, // Ensure birthDate is included
          enrolledCourses: [...(student.enrolledCourses || [])]
        });
        
        updated.enrollStudent(studentInstance);
        updatedStudents.push(studentInstance);
      });
      
      return updated;
    });

    // Update global students state with the enrolled students
    if (updatedStudents.length > 0 && onStudentsUpdate) {
      onStudentsUpdate(updatedStudents);
    }

    // Rest of your code (success messages, etc.)
    shouldUpdateParent.current = true;
    setSuccessAlert({
      open: true,
      message: selectedStudents.length === 1
        ? "סטודנט אחד נוסף לקורס בהצלחה!"
        : `${selectedStudents.length} סטודנטים נוספו לקורס בהצלחה!`,
      severity: "success",
    });
    setOpenStudentDialog(false);
    setSelectedStudents([]);
    setSearchQuery("");
  };

  const handleDeleteStudent = (studentId) => {
    setStudentToDelete(studentId);
  };

  const handleConfirmDeleteStudent = () => {
    // Get student name before deletion for the message
    const student = currentCourse.students.find(
      (s) => s.id === studentToDelete
    );
    const studentName = student
      ? `${student.firstName} ${student.lastName}`
      : "הסטודנט/ית";

    setCurrentCourse((prev) => {
      const updated = { ...prev };
      updated.students = prev.students.filter((s) => s.id !== studentToDelete);
      return updated;
    });

    // Flag that we need to update the parent
    shouldUpdateParent.current = true;

    // Show info message for deletion instead of success
    setSuccessAlert({
      open: true,
      message: `${studentName} הוסר/ה מהקורס בהצלחה!`,
      severity: "info", // Change to blue
    });

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
                  תאריך הגשה: {formatDateTime(assignment.dueDate).date}
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
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {message.content}
                </Typography>
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

        {currentCourse.students && currentCourse.students.length > 0 ? (
          <StudentTable
            students={currentCourse.students}
            onDelete={(studentId) => {
              // Directly set the studentToDelete without showing the table's confirmation dialog
              setStudentToDelete(studentId);
            }}
            tableProps={{
              sx: { tableLayout: "fixed" },
            }}
            columnWidths={{
              id: "15%",
              firstName: "15%",
              lastName: "20%",
              email: "30%",
              birthDate: "15%",
              actions: "15%",
            }}
            actionButtons={{
              edit: false,
              delete: true
            }}
            skipConfirmation={true} // Add this prop to bypass the StudentTable confirmation
          />
        ) : (
          <Typography>אין סטודנטים רשומים לקורס זה עדיין.</Typography>
        )}
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
          onSubmit={handleSubmitAssignment}
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

      {/* Student Enrollment Dialog */}
      <Dialog
        open={openStudentDialog}
        onClose={() => {
          setOpenStudentDialog(false);
          setSelectedStudents([]);
          setSearchQuery("");
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>הוספת סטודנטים לקורס</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            בחר סטודנטים מהרשימה כדי לרשום אותם לקורס.
          </DialogContentText>

          <TextField
            fullWidth
            margin="normal"
            placeholder="חיפוש לפי שם או ת.ז."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
            {getAvailableStudents().length > 0 ? (
              <List>
                {getAvailableStudents().map((student) => (
                  <ListItemButton
                    key={student.id}
                    dense
                    onClick={() => handleStudentSelection(student.id)}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentSelection(student.id)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1">
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ת.ז: {student.id} | {student.email}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography align="center" sx={{ p: 2 }}>
                {searchQuery
                  ? "לא נמצאו סטודנטים מתאימים לחיפוש."
                  : "כל הסטודנטים כבר רשומים לקורס או שלא נוספו סטודנטים למערכת."}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenStudentDialog(false);
              setSelectedStudents([]);
              setSearchQuery("");
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleAddStudents}
            variant="contained"
            disabled={selectedStudents.length === 0}
          >
            {selectedStudents.length === 0
              ? "בחר סטודנטים"
              : selectedStudents.length === 1
              ? "הוסף סטודנט"
              : `הוסף ${selectedStudents.length} סטודנטים`}
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

      <Snackbar
        open={successAlert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={successAlert.severity || "success"}
          sx={{ width: "100%" }}
        >
          {successAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageCourse;
