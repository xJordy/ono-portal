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