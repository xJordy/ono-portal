import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Add this import
import Sidebar from "../common/shared/Sidebar";
import DashboardCards from "../common/shared/DashboardCards";
import CourseTable from "../common/shared/CourseTable";
import StudentCourseView from "./StudentCourseView";
import StudentAssignmentsTable from "./StudentAssignmentsTable";
import { studentService, courseService } from "../../firebase";
import Loading from "../common/shared/Loading";

// Import icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function StudentPortal() {
  // Get URL parameters
  const { studentId, page, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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
          courseService.getAll(),
        ]);

        setAllStudents(studentsData);
        setAllCourses(coursesData);

        // Set initial student based on URL params or first student
        if (studentId && studentsData.find((s) => s.id === studentId)) {
          setSelectedStudentId(studentId);
        } else if (studentsData.length > 0) {
          const firstStudentId = studentsData[0].id;
          setSelectedStudentId(firstStudentId);
          // Update URL to reflect the selected student
          navigate(`/student/${firstStudentId}/dashboard`, { replace: true });
        }

        // Set initial page based on URL params
        if (
          page &&
          ["dashboard", "courses", "assignments", "viewCourse"].includes(page)
        ) {
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [studentId, page, navigate]);

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
        const student = allStudents.find((s) => s.id === selectedStudentId);
        setSelectedStudent(student);

        if (student) {
          // Filter courses to only those the student is enrolled in
          const enrolledCourses = allCourses.filter(
            (course) =>
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

          // If we have a course ID in URL params and we're viewing a course, set the selected course
          if (courseId && currentPage === "viewCourse") {
            const course = coursesWithData.find((c) => c.id === courseId);
            if (course) {
              setSelectedCourse(course);
            } else {
              // Course not found or student not enrolled, redirect to courses
              navigate(`/student/${selectedStudentId}/courses`, {
                replace: true,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading student data:", error);
        setStudentCourses([]);
      } finally {
        setLoadingStudentData(false);
      }
    };

    loadStudentData();
  }, [
    selectedStudentId,
    allStudents,
    allCourses,
    courseId,
    currentPage,
    navigate,
  ]);

  // Handler for student selection change
  const handleStudentChange = (event) => {
    const newStudentId = event.target.value;
    setSelectedStudentId(newStudentId);
    // Reset selected course when changing students
    setSelectedCourse(null);
    setCurrentPage("dashboard");
    // Update URL with new student and reset to dashboard
    navigate(`/student/${newStudentId}/dashboard`, { replace: true });
  };

  // Handler for navigating between pages
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (pageId !== "viewCourse") {
      setSelectedCourse(null);
      // Update URL with new page
      navigate(`/student/${selectedStudentId}/${pageId}`);
    }
  };

  // Handler for selecting a course to view
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setCurrentPage("viewCourse");
    // Update URL to include course ID
    navigate(`/student/${selectedStudentId}/viewCourse/${course.id}`);
  };

  // Handler for going back from course view
  const handleBackFromCourse = () => {
    setCurrentPage("courses");
    setSelectedCourse(null);
    // Update URL to go back to courses
    navigate(`/student/${selectedStudentId}/courses`);
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
              <StudentAssignmentsTable 
                courses={studentCourses} 
                selectedStudentId={selectedStudentId}
              />
            )}
          </Box>
        );

      case "viewCourse":
        return (
          <StudentCourseView
            course={selectedCourse}
            onBack={handleBackFromCourse}
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
              <MenuItem disabled>אין סטודנטים במערכת</MenuItem>
            ) : (
              allStudents.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.id})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Breadcrumb Navigation */}
        {selectedStudent && (
          <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ←
            </Typography>
            <Typography variant="body2" color="primary.main">
              {currentPage === "dashboard" && "לוח בקרה"}
              {currentPage === "courses" && "הקורסים שלי"}
              {currentPage === "assignments" && "כל המטלות"}
              {currentPage === "viewCourse" &&
                selectedCourse &&
                `צפיה בקורס: ${selectedCourse.name}`}
            </Typography>
          </Box>
        )}
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
        <Box sx={{ flexGrow: 1 }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
