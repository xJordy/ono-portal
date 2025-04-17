import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Typography, 
  Snackbar,
  Alert
} from "@mui/material";
import CourseForm from "./CourseForm";
import CourseTable from "./CourseTable";
import ManageCourse from "./ManageCourse";
import Sidebar from "./Sidebar";
import { Course } from "../../models/Models";
import {
  saveCoursesToLocalStorage,
  getCoursesFromLocalStorage,
} from "../../utils/localStorage";
import DashboardCards from "./DashboardCards";
import InfoIcon from '@mui/icons-material/Info';

export default function AdminPortal() {
  // State to store all courses
  const [courses, setCourses] = useState([]);
  // State to track which course is being edited
  const [courseToEdit, setCourseToEdit] = useState(null);
  // State to track which course is being managed
  const [selectedCourse, setSelectedCourse] = useState(null);
  // State for navigation
  const [currentPage, setCurrentPage] = useState("dashboard");
  // Ref to track initialization
  const isFirstRenderRef = useRef(true);
  // Add state for the success message
  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: '',
    severity: 'success' // Default severity
  });

  // Load courses from localStorage when component mounts
  useEffect(() => {
    const savedCourses = getCoursesFromLocalStorage();
    console.log("Loading courses from localStorage:", savedCourses);

    if (savedCourses && savedCourses.length > 0) {
      const coursesInstances = savedCourses.map((course) => {
        const newCourse = new Course({
          id: course.id,
          name: course.name,
          instructor: course.instructor,
          day: course.day,
          time: course.time,
          descr: course.descr,
        });

        // Restore other properties if they exist
        if (course.assignments) newCourse.assignments = course.assignments;
        if (course.messages) newCourse.messages = course.messages;
        if (course.students) newCourse.students = course.students;

        return newCourse;
      });
      setCourses(coursesInstances);
    }
  }, []);

  // USELESS ?
  // Save courses to localStorage when they change
  useEffect(() => {
    // Skip the first render completely
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    console.log("Saving courses after first render:", courses);
    saveCoursesToLocalStorage(courses);
  }, [courses]);

  // Function to handle saving a new or edited course
  const handleSaveCourse = (course) => {
    if (courseToEdit) {
      // Update existing course
      setCourses((prev) => prev.map((c) => (c.id === course.id ? course : c)));
      setCourseToEdit(null);
      
      // Show success message for update
      setSuccessAlert({
        open: true,
        message: `הקורס "${course.name}" עודכן בהצלחה!`,
        severity: "success"
      });
    } else {
      // Add new course
      setCourses((prev) => [...prev, course]);
      
      // Show success message for new course
      setSuccessAlert({
        open: true,
        message: `הקורס "${course.name}" נוסף בהצלחה!`,
        severity: "success"
      });
    }
    // Navigate to courses list after saving
    setCurrentPage("courses");
  };

  // Handle closing the success alert
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAlert({...successAlert, open: false});
  };

  // Function to start editing a course
  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setCurrentPage("addCourse");
  };

  // Function to manage a course
  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setCurrentPage("manageCourse");
  };

  // Function to delete a course
  const handleDeleteCourse = (courseId) => {
    // First, find the course to get its name before deletion
    const courseToDelete = courses.find(course => course.id === courseId);
    const courseName = courseToDelete ? courseToDelete.name : "הקורס";
    
    // Delete the course
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
    
    // Show deletion success message with info severity
    setSuccessAlert({
      open: true,
      message: `${courseName} נמחק בהצלחה!`,
      severity: "info" // Blue alert for deletions
    });
  };

  // Handle navigation changes
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    // Reset courseToEdit when navigating to add course page
    if (pageId === "addCourse" && currentPage !== "addCourse") {
      setCourseToEdit(null);
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

  // Render the appropriate content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardCards courses={courses} />;
      case "courses":
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              רשימת קורסים
            </Typography>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <CourseTable
                courses={courses}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onManage={handleManageCourse}
                tableProps={{
                  sx: { tableLayout: "fixed" }, // Forces table to respect column widths
                }}
                columnWidths={{
                  id: "10%",
                  name: "30%",
                  instructor: "20%",
                  schedule: "10%",
                  actions: "30%",
                }}
              />
            </Box>
          </Box>
        );
      case "addCourse":
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              {courseToEdit ? "עריכת קורס" : "הוספת קורס חדש"}
            </Typography>
            <CourseForm onSave={handleSaveCourse} courseToEdit={courseToEdit} />
          </Box>
        );
      case "manageCourse":
        return (
          <Box>
            <ManageCourse
              course={selectedCourse}
              onBack={() => setCurrentPage("courses")}
              onCourseUpdate={handleCourseUpdate}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 9 }}>
        <Typography variant="h4" sx={{ m: 0 }}>
          פורטל מנהל
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          opacity: 0.8,
          bgcolor: '#fff9c4', // Light yellow background
          borderRadius: 2,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          flexGrow: 1,
          position: 'relative',
          borderLeft: '4px solid #f57c00', // Darker orange accent on the right edge
          
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            width: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ color: '#f57c00', mr: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                שימו לב - הודעה חשובה!
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
            נותרו לך 48 שעות להשלמת הזנת ציונים סופיים ו-72 שעות להשיב על כל ההודעות שטרם נענו בפורטל הקורס. אנא ודא עמידה בזמנים בהתאם להנחיות המוסד.</Typography>
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

        {/* Main content */}
        <Box sx={{ flexGrow: 1 }}>{renderContent()}</Box>
      </Box>

      <Snackbar
        open={successAlert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={successAlert.severity || "success"} // Use the severity from state
          sx={{ width: '100%' }}
        >
          {successAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
