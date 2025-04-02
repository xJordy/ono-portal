import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button 
} from '@mui/material';

const CourseTable = ({ courses, onEdit, onDelete, onManage }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>קוד קורס</TableCell>
            <TableCell>שם הקורס</TableCell>
            <TableCell>מרצה</TableCell>
            <TableCell>יום ושעה</TableCell>
            <TableCell>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                אין קורסים עדיין. הוסף את הקורס הראשון בתפריט בצד ימין!
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.day} {course.time}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small" 
                    onClick={() => onManage(course)}
                  >
                    ניהול
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => onEdit(course)}
                    sx={{ ml: 1 }}
                  >
                    עריכה
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={() => onDelete(course.id)}
                    sx={{ ml: 1 }}
                  >
                    מחיקה
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseTable;