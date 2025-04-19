import { Assignment, Course, Message, Student } from "../models/Models";
import { 
  getCoursesFromLocalStorage, 
  getStudentsFromLocalStorage, 
  saveCoursesToLocalStorage, 
  saveStudentsToLocalStorage 
} from "./localStorage";

// Main function to initialize data if localStorage is empty
export const initializeAppData = () => {
  const existingCourses = getCoursesFromLocalStorage();
  const existingStudents = getStudentsFromLocalStorage();

  // Only initialize if both are empty
  if (existingCourses.length === 0 && existingStudents.length === 0) {
    console.log("Initializing app with mock data...");
    
    // Generate mock data
    const { students, courses } = generateMockData();
    
    // Save to localStorage
    saveStudentsToLocalStorage(students);
    saveCoursesToLocalStorage(courses);
    
    console.log("Mock data initialized successfully!");
    return { students, courses };
  } else {
    console.log("Existing data found in localStorage, skipping initialization");
    return { students: existingStudents, courses: existingCourses };
  }
};

// Helper function to generate mock data
const generateMockData = () => {
  // Generate students first
  const students = generateMockStudents();
  
  // Then generate courses with references to students
  const courses = generateMockCourses(students);
  
  // Update students with course enrollments
  updateStudentEnrollments(students, courses);
  
  return { students, courses };
};

// Generate 10 mock students
const generateMockStudents = () => {
  // Sample data for realistic Hebrew names
  const firstNames = [
    "יוסף", "משה", "דוד", "אברהם", "יעקב", 
    "נועה", "שירה", "מיכל", "רותם", "תמר"
  ];
  
  const lastNames = [
    "כהן", "לוי", "מזרחי", "פרץ", "אברהמי",
    "דהן", "ביטון", "אוחיון", "אזולאי", "גבאי"
  ];
  
  const students = [];
  
  // Create 10 students with unique IDs
  for (let i = 0; i < 10; i++) {
    // Generate ID similar to Israeli ID format (9 digits)
    const id = (10000000 + Math.floor(Math.random() * 90000000)).toString();
    
    // Pick random names
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Generate birthdate (18-30 years ago)
    const today = new Date();
    const year = today.getFullYear() - Math.floor(Math.random() * 12) - 18;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const birthDate = new Date(year, month, day);
    
    // Create email from name
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    // Create student
    students.push(new Student({
      id,
      firstName,
      lastName,
      email,
      birthDate,
      enrolledCourses: [] // Will be populated later
    }));
  }
  
  return students;
};

// Generate 10 mock courses with assignments and messages
const generateMockCourses = (students) => {
  // Sample data for realistic Hebrew course names
  const courseNames = [
    "מבוא למדעי המחשב",
    "אלגוריתמים ומבני נתונים",
    "תכנות מונחה עצמים",
    "בסיסי נתונים",
    "מערכות הפעלה",
    "רשתות תקשורת",
    "פיתוח אפליקציות ווב",
    "אבטחת מידע וסייבר",
    "למידת מכונה",
    "בינה מלאכותית"
  ];
  
  const instructors = [
    "ד״ר רון לוי",
    "פרופ׳ מיכאל כהן",
    "ד״ר שרה גולן",
    "פרופ׳ רחל אדלר",
    "ד״ר יובל ברק"
  ];
  
  const days = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳"];
  const times = ["08:30", "10:30", "12:30", "14:30", "16:30", "18:30"];
  const descriptions = [
    "קורס זה מתמקד ביסודות התחום ומעניק בסיס איתן להמשך הלימודים.",
    "קורס מתקדם המשלב תיאוריה ותרגול מעשי בקבוצות קטנות.",
    "הקורס יעניק כלים מעשיים ותיאורטיים להתמודדות עם אתגרים בתחום.",
    "בקורס זה נלמד שיטות חדשות ונתרגל באמצעות פרויקט מעשי.",
    "קורס חובה המשלב הרצאות פרונטליות ותרגול מעשי במעבדות."
  ];
  
  const courses = [];
  
  // Create 10 courses
  for (let i = 0; i < 10; i++) {
    const courseId = (1000 + i).toString();
    
    // Create course with basic info
    const course = new Course({
      id: courseId,
      name: courseNames[i % courseNames.length],
      instructor: instructors[i % instructors.length],
      day: days[i % days.length],
      time: times[i % times.length],
      descr: descriptions[i % descriptions.length],
      assignments: [], // Will be filled
      messages: [], // Will be filled
      studentIds: [] // Will be filled
    });
    
    // Add 2-4 assignments to each course
    const numAssignments = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numAssignments; j++) {
      const assignmentId = `${courseId}-A${j + 1}`;
      const title = `מטלה ${j + 1} - ${course.name}`;
      
      // Due date in the next 1-30 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      const descriptions = [
        "יש להגיש את המטלה עד לתאריך הנקוב. אנא הקפידו על הנחיות ההגשה.",
        "המטלה כוללת חלק תיאורטי וחלק מעשי. יש להגיש את שניהם יחד.",
        "עבודה בזוגות מותרת. אנא ציינו את שמות שני המגישים.",
        "יש להגיש את המטלה בקובץ PDF דרך מערכת ההגשות באתר הקורס."
      ];
      
      const assignment = new Assignment(
        assignmentId,
        title,
        descriptions[j % descriptions.length],
        dueDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      );
      
      course.assignments.push(assignment);
    }
    
    // Add 2-5 messages to each course
    const numMessages = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < numMessages; j++) {
      const messageId = `${courseId}-M${j + 1}`;
      
      const titles = [
        "הודעה חשובה לגבי השיעור הבא",
        "שינוי בתאריך הגשת המטלה",
        "חומרי עזר נוספים",
        "שעות קבלה השבוע",
        "תזכורת לקראת המבחן"
      ];
      
      const contents = [
        "סטודנטים יקרים, אני רוצה להזכיר שהשיעור הבא יתקיים כרגיל. אנא הגיעו מוכנים עם החומר הנדרש.",
        "בעקבות בקשות רבות, תאריך ההגשה של המטלה האחרונה נדחה בשבוע. התאריך החדש מופיע במערכת.",
        "העליתי למודל חומרי עזר נוספים שיעזרו לכם בפרויקט הסופי. מומלץ לעיין בהם בהקדם.",
        "שעות הקבלה השבוע יתקיימו ביום רביעי בין 14:00-16:00 במשרדי שבבניין המחלקה.",
        "תזכורת שהמבחן הסופי מתקרב. אנא וודאו שאתם מכירים את כל החומר הנלמד. בהצלחה!"
      ];
      
      // Date within past 30 days
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      
      const message = new Message(
        messageId,
        titles[j % titles.length],
        contents[j % contents.length],
        j === 0 ? "מנהל המערכת" : course.instructor,
        timestamp
      );
      
      course.messages.push(message);
    }
    
    courses.push(course);
  }
  
  // Assign students to courses (each student to 2-5 random courses)
  students.forEach(student => {
    const numEnrollments = Math.floor(Math.random() * 4) + 2;
    const enrolledCourseIndices = new Set();
    
    // Choose random courses
    while (enrolledCourseIndices.size < numEnrollments && enrolledCourseIndices.size < courses.length) {
      const courseIndex = Math.floor(Math.random() * courses.length);
      enrolledCourseIndices.add(courseIndex);
    }
    
    // Enroll student in selected courses
    enrolledCourseIndices.forEach(index => {
      const course = courses[index];
      if (!course.studentIds.includes(student.id)) {
        course.studentIds.push(student.id);
      }
    });
  });
  
  return courses;
};

// Update students with course enrollments 
const updateStudentEnrollments = (students, courses) => {
  // Clear all enrollments first
  students.forEach(student => {
    student.enrolledCourses = [];
  });
  
  // Loop through courses and update student enrollments
  courses.forEach(course => {
    course.studentIds.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (student && !student.enrolledCourses.includes(course.id)) {
        student.enrolledCourses.push(course.id);
      }
    });
  });
};