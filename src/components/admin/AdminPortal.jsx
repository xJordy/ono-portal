import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import CourseForm from './CourseForm';
import CourseTable from './CourseTable';
import Sidebar from './Sidebar';
import { Course } from '../../models/Models';
import { saveCoursesToLocalStorage, getCoursesFromLocalStorage } from '../../utils/localStorage';

export default function AdminPortal() {
  // State to store all courses
  const [courses, setCourses] = useState([]);
  // State to track which course is being edited
  const [courseToEdit, setCourseToEdit] = useState(null);
  // State for navigation
  const [currentPage, setCurrentPage] = useState('dashboard');
  // Ref to track initialization
  const isFirstRenderRef = useRef(true);

  // Load courses from localStorage when component mounts
  useEffect(() => {
    const savedCourses = getCoursesFromLocalStorage();
    console.log('Loading courses from localStorage:', savedCourses);

    if (savedCourses && savedCourses.length > 0) {
      const coursesInstances = savedCourses.map(course => {
        const newCourse = new Course(course.id, course.name, course.instructor);

        // Restore other properties if they exist
        if (course.assignments) newCourse.assignments = course.assignments;
        if (course.messages) newCourse.messages = course.messages;
        if (course.students) newCourse.students = course.students;

        return newCourse;
      });
      setCourses(coursesInstances);
    }
  }, []);

  // Save courses to localStorage when they change
  useEffect(() => {
    // Skip the first render completely
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    console.log('Saving courses after first render:', courses);
    saveCoursesToLocalStorage(courses);
  }, [courses]);

  // Function to handle saving a new or edited course
  const handleSaveCourse = (course) => {
    if (courseToEdit) {
      // Update existing course
      setCourses(prev => 
        prev.map(c => c.id === course.id ? course : c)
      );
      setCourseToEdit(null);
    } else {
      // Add new course
      setCourses(prev => [...prev, course]);
    }
    // Navigate to courses list after saving
    setCurrentPage('courses');
  };

  // Function to start editing a course
  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setCurrentPage('addCourse');
  };

  // Function to delete a course
  const handleDeleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  // Handle navigation changes
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    // Reset courseToEdit when navigating to add course page
    if (pageId === 'addCourse' && currentPage !== 'addCourse') {
      setCourseToEdit(null);
    }
  };

  // Render the appropriate content based on current page
  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              לוח בקרה
            </Typography>
            <Typography>
              ברוך הבא למערכת ניהול הקורסים. השתמש בתפריט כדי לנווט.
            </Typography>
          </Box>
        );
      case 'courses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              רשימת קורסים
            </Typography>
            <CourseTable 
              courses={courses} 
              onEdit={handleEditCourse} 
              onDelete={handleDeleteCourse} 
            />
          </Box>
        );
      case 'addCourse':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              {courseToEdit ? 'עריכת קורס' : 'הוספת קורס חדש'}
            </Typography>
            <CourseForm 
              onSave={handleSaveCourse} 
              courseToEdit={courseToEdit} 
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="false" sx={{ mt: 4, mx: -25 }}>
      <Typography variant="h4" gutterBottom>
        פורטל מנהל
      </Typography>
      
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid>
          <Sidebar 
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
        </Grid>
        
        {/* Main content */}
        <Grid>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  );
}
