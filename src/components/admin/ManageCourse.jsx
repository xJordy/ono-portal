import { useState, useEffect, useRef, useMemo } from "react";
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
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Assignment, Message, Student, Course } from "../../models/Models";
import {
  saveCourseToLocalStorage,
  getStudentsFromLocalStorage,
} from "../../utils/localStorage";
import { courseService, studentService } from "../../firebase"; // Add this import
import AssignmentForm from "./AssignmentForm";
import MessageForm from "./MessageForm";
import ConfirmationDialog from "../common/ConfirmationDialog";
import StudentTable from "./StudentTable";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// TODO: REFRESHING THE BROWSER PAGE IN ANY TAB CREATES AN ERROR

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

// Add the students prop to the component
const ManageCourse = ({
  course,
  onBack,
  onCourseUpdate,
  onStudentsUpdate,
  students,
}) => {
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
  // Loadeing states
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [addingStudents, setAddingStudents] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [removingStudentId, setRemovingStudentId] = useState(null);

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
      // First try using students passed from props if available
      if (students && students.length > 0) {
        setAllStudents(students);
        return;
      }

      // Fallback to localStorage if no students in props
      const studentsData = getStudentsFromLocalStorage();
      // Create proper Student instances with methods
      const studentInstances = studentsData.map(
        (student) =>
          new Student({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            birthDate: student.birthDate,
            enrolledCourses: student.enrolledCourses || [],
          })
      );
      setAllStudents(studentInstances);
    };

    loadStudents();
  }, [students]); // Add students as a dependency

  // Update the getAvailableStudents function
  const getAvailableStudents = () => {
    // Show all students, but we'll mark enrolled ones differently
    let filteredStudents = allStudents;

    // Apply search filtering if needed
    if (searchQuery) {
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.includes(searchQuery)
      );
    }

    return filteredStudents;
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
  const { id } = useParams(); // Get course ID from URL
  const navigate = useNavigate();
  const location = useLocation();

  // When changing tabs, update URL
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Remove this URL navigation - it's causing the redirect
    // const tabPaths = ["assignments", "messages", "students"];
    // navigate(`/admin/courses/manage/${id}/${tabPaths[newValue]}`);
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

  const handleConfirmDeleteAssignment = async () => {
    try {
      // Set the deleting state to show spinner
      setDeletingAssignmentId(assignmentToDelete);
      
      // Find assignment to get title for success message
      const assignment = currentCourse.assignments.find(
        (a) => a.id === assignmentToDelete
      );
      const assignmentTitle = assignment ? assignment.title : "המטלה";

      // Delete from Firestore
      await courseService.deleteAssignment(
        currentCourse.id,
        assignmentToDelete
      );

      // Update local state
      const updatedAssignments = currentCourse.assignments.filter(
        (a) => a.id !== assignmentToDelete
      );

      setCurrentCourse((prev) => ({
        ...prev,
        assignments: updatedAssignments,
      }));

      // Notify parent if needed
      if (onCourseUpdate) {
        onCourseUpdate({
          ...currentCourse,
          assignments: updatedAssignments,
        });
      }

      // Show success message
      setSuccessAlert({
        open: true,
        message: `${assignmentTitle} נמחקה בהצלחה!`,
        severity: "info",
      });
    } catch (error) {
      console.error(`Error deleting assignment ${assignmentToDelete}:`, error);
      setSuccessAlert({
        open: true,
        message: `שגיאה במחיקת המטלה: ${error.message}`,
        severity: "error",
      });
    } finally {
      // Reset states
      setDeletingAssignmentId(null);
      setAssignmentToDelete(null);
    }
  };

  // Add handler to close alert
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlert({ ...successAlert, open: false });
  };

  // Update the assignment submission handler
  const handleSubmitAssignment = async (formData) => {
    try {
      setSavingAssignment(true); // Start saving

      if (assignmentToEdit) {
        // Update existing assignment in Firestore
        const updatedAssignment = await courseService.updateAssignment(
          currentCourse.id,
          {
            id: assignmentToEdit,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
          }
        );

        // Update local state
        const updatedAssignments = currentCourse.assignments.map((a) =>
          a.id === assignmentToEdit ? updatedAssignment : a
        );

        setCurrentCourse((prev) => ({
          ...prev,
          assignments: updatedAssignments,
        }));

        // Notify parent if needed
        if (onCourseUpdate) {
          onCourseUpdate({
            ...currentCourse,
            assignments: updatedAssignments,
          });
        }

        // Show success message
        setSuccessAlert({
          open: true,
          message: `המטלה "${formData.title}" עודכנה בהצלחה!`,
          severity: "success",
        });
      } else {
        // Create new assignment object
        const newAssignment = new Assignment(
          null, // ID will be assigned by Firestore
          formData.title,
          formData.description,
          formData.dueDate
        );

        // Add to Firestore
        const savedAssignment = await courseService.addAssignment(
          currentCourse.id,
          newAssignment
        );

        // Update local state with the new assignment that includes an ID
        const updatedAssignments = [
          ...currentCourse.assignments,
          savedAssignment,
        ];
        setCurrentCourse((prev) => ({
          ...prev,
          assignments: updatedAssignments,
        }));

        // Notify parent if needed
        if (onCourseUpdate) {
          onCourseUpdate({
            ...currentCourse,
            assignments: updatedAssignments,
          });
        }

        // Show success message
        setSuccessAlert({
          open: true,
          message: `המטלה "${formData.title}" נוספה בהצלחה!`,
          severity: "success",
        });
      }

      // Close dialog and reset state
      setOpenAssignmentDialog(false);
      setAssignmentToEdit(null);
    } catch (error) {
      console.error("Error saving assignment:", error);
      setSuccessAlert({
        open: true,
        message: `שגיאה בשמירת המטלה: ${error.message}`,
        severity: "error",
      });
    } finally {
      setSavingAssignment(false); // End saving
    }
  };

  // Update the message handler
  const handleAddMessage = async (formData) => {
    try {
      // Set loading state to true before saving
      setSavingMessage(true);
      
      // Create new message object
      const newMessage = new Message(
        null, // ID will be assigned by Firestore
        formData.title,
        formData.content,
        formData.sender
      );

      // Add to Firestore
      const savedMessage = await courseService.addMessage(
        currentCourse.id,
        newMessage
      );

      // Update local state with the new message that includes an ID
      const updatedMessages = [...currentCourse.messages, savedMessage];
      setCurrentCourse((prev) => ({
        ...prev,
        messages: updatedMessages,
      }));

      // Notify parent if needed
      if (onCourseUpdate) {
        onCourseUpdate({
          ...currentCourse,
          messages: updatedMessages,
        });
      }

      // Show success message
      setSuccessAlert({
        open: true,
        message: `ההודעה "${formData.title}" נוספה בהצלחה!`,
        severity: "success",
      });

      // Close dialog
      setOpenMessageDialog(false);
    } catch (error) {
      console.error("Error adding message:", error);
      setSuccessAlert({
        open: true,
        message: `שגיאה בשמירת ההודעה: ${error.message}`,
        severity: "error",
      });
    } finally {
      // Always reset loading state
      setSavingMessage(false);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
  };

  const handleConfirmDeleteMessage = async () => {
    try {
      // Set deleting state to show spinner
      setDeletingMessageId(messageToDelete);
      
      // Find message to get title for success message
      const message = currentCourse.messages.find(
        (m) => m.id === messageToDelete
      );
      const messageTitle = message ? message.title : "ההודעה";

      // Delete from Firestore
      await courseService.deleteMessage(currentCourse.id, messageToDelete);

      // Update local state
      const updatedMessages = currentCourse.messages.filter(
        (m) => m.id !== messageToDelete
      );

      setCurrentCourse((prev) => ({
        ...prev,
        messages: updatedMessages,
      }));

      // Notify parent if needed
      if (onCourseUpdate) {
        onCourseUpdate({
          ...currentCourse,
          messages: updatedMessages,
        });
      }

      // Show success message
      setSuccessAlert({
        open: true,
        message: `${messageTitle} נמחקה בהצלחה!`,
        severity: "info",
      });
    } catch (error) {
      console.error(`Error deleting message ${messageToDelete}:`, error);
      setSuccessAlert({
        open: true,
        message: `שגיאה במחיקת ההודעה: ${error.message}`,
        severity: "error",
      });
    } finally {
      // Reset states
      setDeletingMessageId(null);
      setMessageToDelete(null);
    }
  };

  // Student handlers
  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) return;

    try {
      // Set loading state to true before enrollment
      setAddingStudents(true);
      
      // Find the selected student objects
      const studentsToAdd = allStudents.filter((student) =>
        selectedStudents.includes(student.id)
      );

      // Process enrollments sequentially instead of concurrently to avoid race conditions
      for (const student of studentsToAdd) {
        try {
          // Enroll student in course
          await courseService.enrollStudent(currentCourse.id, student.id);
          // Add course to student's enrolled courses
          await studentService.enrollInCourse(student.id, currentCourse.id);
        } catch (error) {
          console.error(`Error enrolling student ${student.id}:`, error);
          // Continue with other students even if one fails
        }
      }

      // Update local state with the new student IDs
      const updatedStudentIds = [
        ...currentCourse.studentIds,
        ...selectedStudents.filter(
          (id) => !currentCourse.studentIds.includes(id)
        ),
      ];

      // Update local state
      setCurrentCourse((prev) => ({
        ...prev,
        studentIds: updatedStudentIds,
      }));

      // Notify parent component
      if (onCourseUpdate) {
        onCourseUpdate({
          ...currentCourse,
          studentIds: updatedStudentIds,
        });
      }

      // Show success message
      setSuccessAlert({
        open: true,
        message:
          selectedStudents.length === 1
            ? "סטודנט אחד נוסף לקורס בהצלחה!"
            : `${selectedStudents.length} סטודנטים נוספו לקורס בהצלחה!`,
        severity: "success",
      });

      // Reset state
      setOpenStudentDialog(false);
      setSelectedStudents([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error enrolling students:", error);
      setSuccessAlert({
        open: true,
        message: "שגיאה ברישום הסטודנטים לקורס",
        severity: "error",
      });
    } finally {
      // Always reset loading state
      setAddingStudents(false);
    }
  };

  const handleDeleteStudent = (studentId) => {
    setStudentToDelete(studentId);
  };

  const handleConfirmDeleteStudent = async () => {
    try {
      // Set removing state to show spinner
      setRemovingStudentId(studentToDelete);
      
      // Get student details for success message
      const student = allStudents.find((s) => s.id === studentToDelete);
      const studentName = student
        ? `${student.firstName} ${student.lastName}`
        : "הסטודנט";

      // Remove from Firestore
      await courseService.removeStudent(currentCourse.id, studentToDelete);
      await studentService.removeFromCourse(studentToDelete, currentCourse.id);

      // Update local state
      const updatedStudentIds = currentCourse.studentIds.filter(
        (id) => id !== studentToDelete
      );

      setCurrentCourse((prev) => ({
        ...prev,
        studentIds: updatedStudentIds,
      }));

      // Notify parent components if needed
      if (onCourseUpdate) {
        onCourseUpdate({
          ...currentCourse,
          studentIds: updatedStudentIds,
        });
      }

      // Show success message
      setSuccessAlert({
        open: true,
        message: `${studentName} הוסר מהקורס בהצלחה!`,
        severity: "info",
      });
    } catch (error) {
      console.error(`Error removing student ${studentToDelete}:`, error);
      setSuccessAlert({
        open: true,
        message: `שגיאה בהסרת הסטודנט: ${error.message}`,
        severity: "error",
      });
    } finally {
      // Reset states
      setRemovingStudentId(null);
      setStudentToDelete(null);
    }
  };

  // Get the actual student objects for this course
  const courseStudents = useMemo(() => {
    // First check if currentCourse exists
    if (!currentCourse) {
      return [];
    }

    // Then safely handle both old and new data structures
    if (currentCourse.studentIds && Array.isArray(currentCourse.studentIds)) {
      return currentCourse.studentIds
        .map((id) => allStudents.find((student) => student.id === id))
        .filter(Boolean);
    } else if (
      currentCourse.students &&
      Array.isArray(currentCourse.students)
    ) {
      // Support legacy format that uses students array directly
      return currentCourse.students;
    }
    // Default to empty array if neither exists
    return [];
  }, [currentCourse, allStudents]);

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
                      disabled={deletingAssignmentId === assignment.id}
                    >
                      {deletingAssignmentId === assignment.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <DeleteIcon />
                      )}
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
                    disabled={deletingMessageId === message.id}
                  >
                    {deletingMessageId === message.id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )}
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

        {courseStudents.length > 0 ? (
          <StudentTable
            students={courseStudents}
            onDelete={(studentId) => {
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
              delete: true,
            }}
            skipConfirmation={true}
          />
        ) : (
          <Typography>אין סטודנטים רשומים לקורס זה עדיין.</Typography>
        )}
      </TabPanel>

      {/* Assignment Dialog */}
      <Dialog
        open={openAssignmentDialog}
        onClose={() => {
          if (!savingAssignment) { // Prevent closing during saving
            setOpenAssignmentDialog(false);
            setAssignmentToEdit(null);
            setNewAssignment({ title: "", description: "", dueDate: "" });
          }
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
          isSaving={savingAssignment} // Pass the saving state here
        />
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={openMessageDialog}
        onClose={() => {
          if (!savingMessage) { // Prevent closing during saving
            setOpenMessageDialog(false);
          }
        }}
        disableRestoreFocus
        disableEnforceFocus={false}
        disableAutoFocus={false}
      >
        <DialogTitle>הוסף הודעה חדשה</DialogTitle>
        <MessageForm
          onSubmit={handleAddMessage}
          onCancel={() => setOpenMessageDialog(false)}
          isSaving={savingMessage} // Pass the saving state here
        />
      </Dialog>

      {/* Student Enrollment Dialog */}
      <Dialog
        open={openStudentDialog}
        onClose={() => {
          if (!addingStudents) { // Prevent closing during enrollment
            setOpenStudentDialog(false);
            setSelectedStudents([]);
            setSearchQuery("");
          }
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
                {getAvailableStudents().map((student) => {
                  // Check if student is already enrolled in this course
                  const isEnrolled = currentCourse.studentIds?.includes(
                    student.id
                  );

                  return (
                    <ListItemButton
                      key={student.id}
                      dense
                      onClick={() =>
                        !isEnrolled && handleStudentSelection(student.id)
                      }
                      sx={{
                        backgroundColor: isEnrolled
                          ? "rgba(76, 175, 80, 0.08)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: isEnrolled
                            ? "rgba(76, 175, 80, 0.12)"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              isEnrolled ||
                              selectedStudents.includes(student.id)
                            }
                            onChange={() => handleStudentSelection(student.id)}
                            disabled={isEnrolled} // Disable if already enrolled
                            color={isEnrolled ? "success" : "primary"}
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
                            {isEnrolled && (
                              <Typography
                                variant="caption"
                                color="success.main"
                                sx={{ display: "block" }}
                              >
                                כבר רשום בקורס זה
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  );
                })}
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
            disabled={addingStudents}
          >
            ביטול
          </Button>
          <Button
            onClick={handleAddStudents}
            variant="contained"
            disabled={selectedStudents.length === 0 || addingStudents}
          >
            {addingStudents ? (
      <>
        <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
        {"מוסיף..."}
      </>
    ) : selectedStudents.length === 0 ? (
      "בחר סטודנטים"
    ) : selectedStudents.length === 1 ? (
      "הוסף סטודנט"
    ) : (
      `הוסף ${selectedStudents.length} סטודנטים`
    )}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={assignmentToDelete !== null}
        onClose={() => !deletingAssignmentId && setAssignmentToDelete(null)}
        onConfirm={handleConfirmDeleteAssignment}
        title="האם למחוק את המטלה?"
        message="פעולה זו תמחק את המטלה באופן מוחלט. האם אתה בטוח?"
        confirmText={deletingAssignmentId ? "מוחק..." : "כן, מחק מטלה"}
        disabled={deletingAssignmentId !== null}
      />

      <ConfirmationDialog
        open={messageToDelete !== null}
        onClose={() => !deletingMessageId && setMessageToDelete(null)}
        onConfirm={handleConfirmDeleteMessage}
        title="האם למחוק את ההודעה?"
        message="פעולה זו תמחק את ההודעה באופן מוחלט. האם אתה בטוח?"
        confirmText={deletingMessageId ? "מוחק..." : "כן, מחק הודעה"}
        disabled={deletingMessageId !== null}
      />

      <ConfirmationDialog
        open={studentToDelete !== null}
        onClose={() => !removingStudentId && setStudentToDelete(null)}
        onConfirm={handleConfirmDeleteStudent}
        title="האם להסיר את הסטודנט מהקורס?"
        message="פעולה זו תסיר את הסטודנט מרשימת המשתתפים בקורס. האם אתה בטוח?"
        confirmText={removingStudentId ? "מסיר..." : "כן, הסר את הסטודנט"}
        disabled={removingStudentId !== null}
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
