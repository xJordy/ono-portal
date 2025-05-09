import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Box, Typography, Snackbar, Alert, Button } from "@mui/material";
import CourseForm from "./CourseForm";
import CourseTable from "../common/shared/CourseTable";
import ManageCourse from "./ManageCourse";
import CourseManager from "./CourseManager"; // Add this import
import Sidebar from "../common/shared/Sidebar";
import { Assignment, Course, Student, Message } from "../../models/Models";
import {
  saveCoursesToLocalStorage,
  getCoursesFromLocalStorage,
} from "../../utils/localStorage";
import DashboardCards from "../common/shared/DashboardCards";
import InfoIcon from "@mui/icons-material/Info";
import StudentForm from "./StudentForm";
import StudentTable from "./StudentTable";
import {
  saveStudentsToLocalStorage,
  getStudentsFromLocalStorage,
} from "../../utils/localStorage";
import AddIcon from '@mui/icons-material/Add';
// Add import for Firebase services
import { courseService, studentService } from "../../firebase";

export default function AdminPortal() {
  // State to store all courses
  const [courses, setCourses] = useState([]);
  // State to track which course is being edited
  const [courseToEdit, setCourseToEdit] = useState(null);
  // State to track which course is being managed
  const [selectedCourse, setSelectedCourse] = useState(null);
  // Ref to track initialization
  const isFirstRenderRef = useRef(true);
  // Add state for the success message
  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: "",
    severity: "success", // Default severity
  });

  // Add these new states for students
  const [students, setStudents] = useState([]);
  const [studentToEdit, setStudentToEdit] = useState(null);
  
  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine current page from URL
  const currentPage = getPageFromPath(location.pathname);

  // Function to convert URL path to sidebar navigation item
  function getPageFromPath(path) {
    if (path === "/admin" || path === "/admin/") return "dashboard";
    if (path.includes("/admin/courses/new")) return "addCourse";
    if (path.includes("/admin/courses/edit")) return "addCourse"; 
    if (path.includes("/admin/courses/manage")) return "manageCourse";
    if (path.includes("/admin/courses")) return "courses";
    if (path.includes("/admin/students/new")) return "addStudent";
    if (path.includes("/admin/students/edit")) return "addStudent";
    if (path.includes("/admin/students")) return "students";
    return "dashboard";
  }

  // Update the useEffect to load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data from Firestore...");
        
        // Load courses with subcollections for dashboard
        const coursesData = await courseService.getAll();
        
        // Load detailed data for the first few courses (to improve dashboard performance)
        // This ensures we have actual subcollections for the dashboard counts
        const courseDetails = await Promise.all(
          coursesData.slice(0, 5).map(course => courseService.getById(course.id))
        );
        
        // Replace the first few courses with detailed versions
        const enhancedCourses = [...coursesData];
        courseDetails.forEach((detailedCourse, index) => {
          if (detailedCourse) {
            enhancedCourses[index] = detailedCourse;
          }
        });
        
        setCourses(enhancedCourses);
        
        // Load students
        const studentsData = await studentService.getAll();
        setStudents(studentsData);
        
        console.log("Data loaded successfully:", { 
          courses: enhancedCourses.length,
          students: studentsData.length
        });
      } catch (error) {
        console.error("Error loading data from Firestore:", error);
        setSuccessAlert({
          open: true,
          message: `שגיאה בטעינת נתונים: ${error.message}`,
          severity: "error"
        });
      }
    };
    
    loadData();
  }, []);

  // Function to handle saving a new or edited course
  const handleSaveCourse = async (course) => {
    try {
      if (courseToEdit) {
        // Update existing course
        const updatedCourse = await courseService.update(course);
        setCourses((prev) => prev.map((c) => (c.id === course.id ? updatedCourse : c)));
        setCourseToEdit(null);
        
        // Show success message
        setSuccessAlert({
          open: true,
          message: `הקורס "${course.name}" עודכן בהצלחה!`,
          severity: "success",
        });
      } else {
        // Add new course
        const newCourse = await courseService.add(course);
        setCourses((prev) => [...prev, newCourse]);
        
        // Show success message
        setSuccessAlert({
          open: true,
          message: `הקורס "${course.name}" נוסף בהצלחה!`,
          severity: "success",
        });
      }
      
      // Navigate to courses list
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error saving course:", error);
      setSuccessAlert({
        open: true,
        message: `שגיאה בשמירת הקורס: ${error.message}`,
        severity: "error"
      });
    }
  };

  // Add these student management functions
  const handleSaveStudent = async (student) => {
    try {
      if (studentToEdit) {
        // Update existing student
        const updatedStudent = await studentService.update(student);
        setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
        setStudentToEdit(null);
        
        // Show success message
        setSuccessAlert({
          open: true,
          message: `הסטודנט "${student.firstName} ${student.lastName}" עודכן בהצלחה!`,
          severity: "success"
        });
      } else {
        // Add new student
        const newStudent = await studentService.add(student);
        setStudents((prev) => [...prev, newStudent]);
        
        // Show success message
        setSuccessAlert({
          open: true,
          message: `הסטודנט "${student.firstName} ${student.lastName}" נוסף בהצלחה!`,
          severity: "success"
        });
      }
      
      // Navigate to students list
      navigate("/admin/students");
    } catch (error) {
      console.error("Error saving student:", error);
      setSuccessAlert({
        open: true,
        message: `שגיאה בשמירת הסטודנט: ${error.message}`,
        severity: "error"
      });
    }
  };

  // Handle closing the success alert
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlert({ ...successAlert, open: false });
  };

  // Function to start editing a course
  const handleEditCourse = (course) => {
    // Make sure we're setting a complete course object with all fields
    setCourseToEdit(course);
    navigate(`/admin/courses/edit/${course.id}`);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    navigate(`/admin/students/edit/${student.id}`);
  };

  // Function to manage a course
  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    navigate(`/admin/courses/manage/${course.id}`);
  };

  // Function to delete a course
  const handleDeleteCourse = async (courseId) => {
    try {
      // Find course and its enrolled students before deleting
      const courseToDelete = courses.find((course) => course.id === courseId);
      const courseName = courseToDelete ? courseToDelete.name : "הקורס";
      const enrolledStudentIds = courseToDelete?.studentIds || [];
      
      // First remove the course from all enrolled students
      const studentUpdatePromises = enrolledStudentIds.map(studentId => 
        studentService.removeFromCourse(studentId, courseId)
      );
      
      // Wait for all student updates to complete
      await Promise.all(studentUpdatePromises);
      
      // Then delete the course
      await courseService.delete(courseId);
      
      // Update courses in local state
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      
      // Update students in local state to reflect removed course
      setStudents(prev => prev.map(student => {
        if (student.enrolledCourses && student.enrolledCourses.includes(courseId)) {
          return {
            ...student,
            enrolledCourses: student.enrolledCourses.filter(id => id !== courseId)
          };
        }
        return student;
      }));
      
      // Show success message
      setSuccessAlert({
        open: true,
        message: `${courseName} נמחק בהצלחה!`,
        severity: "info"
      });
    } catch (error) {
      // Error handling...
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      // Find student before deleting
      const studentToDelete = students.find((student) => student.id === studentId);
      const studentName = studentToDelete
        ? `${studentToDelete.firstName} ${studentToDelete.lastName}`
        : "הסטודנט";
      
      // Get enrolled courses to update them
      const enrolledCourseIds = studentToDelete?.enrolledCourses || [];
      
      // First, remove student from all enrolled courses
      const courseUpdatePromises = enrolledCourseIds.map(courseId => 
        courseService.removeStudent(courseId, studentId)
      );
      
      // Wait for all course updates to complete
      await Promise.all(courseUpdatePromises);
      
      // Then delete the student
      await studentService.delete(studentId);
      
      // Update local state - both students and courses
      setStudents(prev => prev.filter(student => student.id !== studentId));
      
      // Update courses in local state to reflect removed student
      setCourses(prev => prev.map(course => {
        if (course.studentIds && course.studentIds.includes(studentId)) {
          return {
            ...course,
            studentIds: course.studentIds.filter(id => id !== studentId)
          };
        }
        return course;
      }));
      
      // Show success message
      setSuccessAlert({
        open: true,
        message: `${studentName} נמחק בהצלחה!`,
        severity: "info"
      });
    } catch (error) {
      // Error handling...
    }
  };

  // Handle navigation changes - now uses React Router
  const handleNavigate = (pageId) => {
    switch (pageId) {
      case "dashboard":
        navigate("/admin");
        break;
      case "courses":
        navigate("/admin/courses");
        break;
      case "addCourse":
        setCourseToEdit(null);
        navigate("/admin/courses/new");
        break;
      case "students":
        navigate("/admin/students");
        break;
      case "addStudent":
        setStudentToEdit(null);
        navigate("/admin/students/new");
        break;
      default:
        navigate("/admin");
    }
  };

  // Function to handle course updates
  const handleCourseUpdate = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  // Update handleStudentsUpdate to correctly merge enrolledCourses
  const handleStudentsUpdate = (updatedStudents) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        const updatedStudent = updatedStudents.find(s => s.id === student.id);
        if (updatedStudent) {
          // Create a new Student instance with the updated enrolledCourses
          return new Student({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            birthDate: student.birthDate,
            enrolledCourses: updatedStudent.enrolledCourses || []
          });
        }
        return student;
      });
    });
  };

  // Get course by ID helper function
  const getCourseById = (id) => {
    return courses.find(course => course.id === id) || null;
  };

  // Get student by ID helper function
  const getStudentById = (id) => {
    return students.find(student => student.id === id) || null;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 9 }}>
        <Typography variant="h4" sx={{ m: 0 }}>
          פורטל מנהל
        </Typography>

        <Box
          sx={{
            display: "flex",
            opacity: 0.8,
            bgcolor: "#fff9c4", // Light yellow background
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
            overflow: "hidden",
            flexGrow: 1,
            position: "relative",
            borderLeft: "4px solid #f57c00", // Darker orange accent on the right edge
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 1,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InfoIcon sx={{ color: "#f57c00", mr: 1 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#f57c00" }}
              >
                שימו לב - הודעה חשובה!
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              נותרו לך 48 שעות להשלמת הזנת ציונים סופיים ו-72 שעות להשיב על כל
              ההודעות שטרם נענו בפורטל הקורס. אנא ודא עמידה בזמנים בהתאם להנחיות
              המוסד.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", sm: "250px" },
            flexShrink: 0,
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 2 },
          }}
        >
          <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
        </Box>

        {/* Main content - now uses Routes */}
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<DashboardCards courses={courses} students={students} />} />
            
            {/* Course routes */}
            <Route path="/courses" element={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">רשימת קורסים</Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      setCourseToEdit(null);
                      navigate("/admin/courses/new");
                    }}
                    startIcon={<AddIcon />}
                  >
                    הוסף קורס חדש
                  </Button>
                </Box>
                <CourseTable 
                  courses={courses}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onManage={handleManageCourse}
                  tableProps={{ sx: { tableLayout: "fixed" } }}
                  columnWidths={{
                    id: "10%",
                    name: "30%",
                    instructor: "20%",
                    schedule: "10%",
                    actions: "30%",
                  }}
                />
              </Box>
            } />

            <Route path="/courses/new" element={
              <Box>
                <Typography variant="h5" gutterBottom>הוספת קורס חדש</Typography>
                <CourseForm onSave={handleSaveCourse} courses={courses} />
              </Box>
            } />

            <Route path="/courses/edit/:id" element={
              <Box>
                <Typography variant="h5" gutterBottom>עריכת קורס</Typography>
                {location.pathname.includes('/edit/') && (
                  <CourseForm 
                    onSave={handleSaveCourse} 
                    courseToEdit={getCourseById(location.pathname.split('/').pop())}
                    courses={courses} 
                  />
                )}
              </Box>
            } />

            {/* Replace the ManageCourse route with this */}
            <Route path="/courses/manage/:id" element={
              (() => {
                const courseId = location.pathname.split('/').pop();
                
                return (
                  <CourseManager
                    courseId={courseId}
                    onBack={() => navigate("/admin/courses")}
                    onCourseUpdate={handleCourseUpdate}
                    onStudentsUpdate={handleStudentsUpdate}
                    students={students}
                  />
                );
              })()
            } />

            {/* Student routes */}
            <Route path="/students" element={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">רשימת סטודנטים</Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      setStudentToEdit(null);
                      navigate("/admin/students/new");
                    }}
                    startIcon={<AddIcon />}
                  >
                    הוסף סטודנט חדש
                  </Button>
                </Box>
                <StudentTable
                  students={students}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                  tableProps={{ sx: { tableLayout: "fixed" } }}
                  columnWidths={{
                    id: "10%",
                    firstName: "10%", 
                    lastName: "15%",
                    email: "25%",
                    birthDate: "10%",
                    actions: "20%",
                  }}
                />
              </Box>
            } />

            <Route path="/students/new" element={
              <Box>
                <Typography variant="h5" gutterBottom>הוספת סטודנט חדש</Typography>
                <StudentForm 
                  onSave={handleSaveStudent} 
                  students={students}
                />
              </Box>
            } />

            <Route path="/students/edit/:id" element={
              <Box>
                <Typography variant="h5" gutterBottom>עריכת סטודנט</Typography>
                {location.pathname.includes('/edit/') && (
                  <StudentForm 
                    onSave={handleSaveStudent}
                    studentToEdit={getStudentById(location.pathname.split('/').pop())}
                    students={students}
                  />
                )}
              </Box>
            } />

            {/* Default route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Box>
      </Box>

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
}
