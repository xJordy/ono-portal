export const saveCoursesToLocalStorage = (courses) => {
  localStorage.setItem('courses', JSON.stringify(courses));
};

export const getCoursesFromLocalStorage = () => {
  const coursesJSON = localStorage.getItem('courses');
  return coursesJSON ? JSON.parse(coursesJSON) : [];
};

export const clearCoursesFromLocalStorage = () => {
  localStorage.removeItem('courses');
};

export const saveCourseToLocalStorage = (course) => {
  const courses = getCoursesFromLocalStorage();
  const updatedCourses = courses.map(c => c.id === course.id ? course : c);
  saveCoursesToLocalStorage(updatedCourses);
};

export const getCourseFromLocalStorage = (courseId) => {
  const courses = getCoursesFromLocalStorage();
  return courses.find(course => course.id === courseId);
};

// Student localStorage functions
export const saveStudentsToLocalStorage = (students) => {
  localStorage.setItem('students', JSON.stringify(students));
};

export const getStudentsFromLocalStorage = () => {
  const studentsJSON = localStorage.getItem('students');
  return studentsJSON ? JSON.parse(studentsJSON) : [];
};

export const clearStudentsFromLocalStorage = () => {
  localStorage.removeItem('students');
};