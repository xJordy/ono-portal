import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../common/shared/Sidebar"; // Updated import
import DashboardCards from "../common/shared/DashboardCards"; // Updated import
import CourseTable from "../common/shared/CourseTable"; // Updated import
import StudentCourseView from "./StudentCourseView"; // New component for student view of course
import StudentAssignmentsTable from "./StudentAssignmentsTable"; // New component for assignments
import { getCoursesFromLocalStorage } from "../../utils/localStorage";

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function StudentPortal() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Student navigation items - simpler than admin version
  const navItems = [
    { id: "dashboard", label: "לוח בקרה", icon: <DashboardIcon /> },
    { id: "courses", label: "הקורסים שלי", icon: <MenuBookIcon /> },
    { id: "assignments", label: "כל המטלות", icon: <AssignmentIcon /> },
  ];

  // Load student's courses from localStorage
  useEffect(() => {
    // Get student ID (this would come from auth in a real app)
    const studentId = "1234"; // Replace with actual student ID in real implementation
    
    // Load courses & filter to only courses the student is enrolled in
    const allCourses = getCoursesFromLocalStorage();
    const studentCourses = allCourses.filter(course => 
      course.studentIds && course.studentIds.includes(studentId)
    );
    
    setMyCourses(studentCourses);
  }, []);

  // Handler for navigating between pages
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (pageId !== "viewCourse") {
      setSelectedCourse(null); // Reset selected course when navigating away
    }
  };

  // Handler for selecting a course to view
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setCurrentPage("viewCourse");
  };

  // Render appropriate content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardCards courses={myCourses} userRole="student" />;
      case "courses":
        return (
          <Box>
            <Typography variant="h5" gutterBottom>הקורסים שלי</Typography>
            <CourseTable 
              courses={myCourses} 
              onManage={handleViewCourse}
              actionButtons={{ 
                edit: false, 
                delete: false, 
                manage: false,
                view: true  
              }}
              buttonLabels={{
                view: "צפה בקורס"
              }}
            />
          </Box>
        );
      case "assignments":
        return (
          <Box>
            <Typography variant="h5" gutterBottom>המטלות שלי</Typography>
            <StudentAssignmentsTable courses={myCourses} />
          </Box>
        );
      case "viewCourse":
        return (
          <StudentCourseView
            course={selectedCourse}
            onBack={() => setCurrentPage("courses")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Typography variant="h4" sx={{ m: 0 }}>פורטל הסטודנט</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        {/* Reuse Sidebar but pass student-specific nav items */}
        <Box sx={{ width: { xs: "100%", sm: "250px" }, flexShrink: 0, mb: { xs: 2, sm: 0 }, mr: { xs: 0, sm: 2 } }}>
          <Sidebar 
            onNavigate={handleNavigate} 
            currentPage={currentPage}
            navItems={navItems} // Pass student-specific navigation items
            title="פורטל הסטודנט" // Override title
          />
        </Box>

        {/* Main content area */}
        <Box sx={{ flexGrow: 1 }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}