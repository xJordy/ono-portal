import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ManageCourse from './ManageCourse';
import { courseService } from '../../firebase';

export default function CourseManager({ 
  courseId, 
  onBack, 
  onCourseUpdate, 
  onStudentsUpdate, 
  students 
}) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load course with all its subcollections
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await courseService.getById(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error(`Error loading course ${courseId}:`, error);
        setError(`שגיאה בטעינת נתוני הקורס: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>טוען נתוני קורס...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={onBack} 
          sx={{ mt: 2 }}
        >
          חזרה לרשימת הקורסים
        </Button>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>קורס לא נמצא.</Typography>
        <Button 
          variant="contained" 
          onClick={onBack} 
          sx={{ mt: 2 }}
        >
          חזרה לרשימת הקורסים
        </Button>
      </Box>
    );
  }

  return (
    <ManageCourse
      course={course}
      onBack={onBack}
      onCourseUpdate={onCourseUpdate}
      onStudentsUpdate={onStudentsUpdate}
      students={students}
    />
  );
}