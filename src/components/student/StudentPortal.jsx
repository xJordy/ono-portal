import { useState, useEffect } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Sidebar from "../common/shared/Sidebar";
import DashboardCards from "../common/shared/DashboardCards";
import CourseTable from "../common/shared/CourseTable";
import StudentCourseView from "./StudentCourseView";
import StudentAssignmentsTable from "./StudentAssignmentsTable";
import { studentService, courseService } from "../../firebase"; // Import Firebase services
import Loading from "../common/shared/Loading";

// Import icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function StudentPortal() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStudentData, setLoadingStudentData] = useState(false);

  // Student navigation items
  const navItems = [
    { id: "dashboard", label: "לוח בקרה", icon: <DashboardIcon /> },
    { id: "courses", label: "הקורסים שלי", icon: <MenuBookIcon /> },
    { id: "assignments", label: "כל המטלות", icon: <AssignmentIcon /> },
  ];

  // Load all students and courses on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load all students and courses in parallel
        const [studentsData, coursesData] = await Promise.all([
          studentService.getAll(),
          courseService.getAll()
        ]);

        setAllStudents(studentsData);
        setAllCourses(coursesData);
        
        // If there are students, automatically select the first one
        if (studentsData.length > 0) {
          setSelectedStudentId(studentsData[0].id);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Update student courses when student selection changes
  useEffect(() => {
    const loadStudentData = async () => {
      if (!selectedStudentId) {
        setSelectedStudent(null);
        setStudentCourses([]);
        return;
      }

      try {
        setLoadingStudentData(true);
        
        // Find the selected student
        const student = allStudents.find(s => s.id === selectedStudentId);
        setSelectedStudent(student);

        if (student) {
          // Filter courses to only those the student is enrolled in
          const enrolledCourses = allCourses.filter(course => 
            course.studentIds && course.studentIds.includes(student.id)
          );
          
          // Load full course data with assignments and messages
          const coursesWithData = await Promise.all(
            enrolledCourses.map(async (course) => {
              try {
                return await courseService.getById(course.id);
              } catch (error) {
                console.error(`Error loading course ${course.id}:`, error);
                return course; // Return basic course data if detailed loading fails
              }
            })
          );

          setStudentCourses(coursesWithData);
        }
      } catch (error) {
        console.error("Error loading student data:", error);
        setStudentCourses([]);
      } finally {
        setLoadingStudentData(false);
      }
    };

    loadStudentData();
  }, [selectedStudentId, allStudents, allCourses]);

  // Handler for student selection change
  const handleStudentChange = (event) => {
    setSelectedStudentId(event.target.value);
    // Reset selected course when changing students
    setSelectedCourse(null);
    setCurrentPage("dashboard"); // Go back to dashboard when changing students
  };

  // Handler for navigating between pages
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (pageId !== "viewCourse") {
      setSelectedCourse(null);
    }
  };

  // Handler for selecting a course to view
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setCurrentPage("viewCourse");
  };

  // Render appropriate content based on current page
  const renderContent = () => {
    if (loadingStudentData) {
      return <Loading message="טוען נתוני סטודנט..." />;
    }

    if (!selectedStudent) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            אנא בחר סטודנט כדי לצפות במידע
          </Typography>
        </Box>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              ברוך הבא, {selectedStudent.firstName} {selectedStudent.lastName}
            </Typography>
            <DashboardCards courses={studentCourses} userRole="student" />
          </Box>
        );
      
      case "courses":
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              הקורסים של {selectedStudent.firstName}
            </Typography>
            {studentCourses.length === 0 ? (
              <Typography color="text.secondary">
                הסטודנט אינו רשום לאף קורס כרגע.
              </Typography>
            ) : (
              <CourseTable
                courses={studentCourses}
                onManage={handleViewCourse}
                actionButtons={{
                  edit: false,
                  delete: false,
                  manage: false,
                  view: true,
                }}
                buttonLabels={{
                  view: "צפה בקורס",
                }}
              />
            )}
          </Box>
        );
      
      case "assignments":
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              המטלות של {selectedStudent.firstName}
            </Typography>
            {studentCourses.length === 0 ? (
              <Typography color="text.secondary">
                אין מטלות להציג כי הסטודנט אינו רשום לאף קורס.
              </Typography>
            ) : (
              <StudentAssignmentsTable courses={studentCourses} />
            )}
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

  if (loading) {
    return <Loading message="טוען נתוני מערכת..." />;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
        <Typography variant="h4" sx={{ m: 0 }}>
          פורטל הסטודנט
        </Typography>
        
        {/* Student Selection Dropdown */}
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="student-select-label">בחר סטודנט</InputLabel>
          <Select
            labelId="student-select-label"
            id="student-select"
            value={selectedStudentId}
            label="בחר סטודנט"
            onChange={handleStudentChange}
            disabled={allStudents.length === 0}
          >
            {allStudents.length === 0 ? (
              <MenuItem disabled>
                אין סטודנטים במערכת
              </MenuItem>
            ) : (
              allStudents.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.id})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
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
          <Sidebar
            onNavigate={handleNavigate}
            currentPage={currentPage}
            navItems={navItems}
            title="פורטל הסטודנט"
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
