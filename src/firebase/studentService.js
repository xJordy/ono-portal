import { db } from './config';
import { Student } from '../models/Models';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  setDoc, query, where
} from 'firebase/firestore';

const COLLECTION_NAME = 'students';

export const studentService = {
  // Get all students
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return new Student({
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthDate: data.birthDate?.toDate(), // Convert Firestore timestamp to JS Date
          enrolledCourses: data.enrolledCourses || []
        });
      });
    } catch (error) {
      console.error('Error getting students:', error);
      throw error;
    }
  },
  
  // Get a student by ID
  getById: async (studentId) => {
    try {
      const studentDoc = await getDoc(doc(db, COLLECTION_NAME, studentId));
      
      if (!studentDoc.exists()) {
        throw new Error(`Student with ID ${studentId} not found`);
      }
      
      const data = studentDoc.data();
      
      // Get enrollments subcollection
      const enrollmentsSnapshot = await getDocs(
        collection(db, COLLECTION_NAME, studentId, 'enrollments')
      );
      
      // Extract enrolled course IDs
      const enrolledCourses = enrollmentsSnapshot.docs
        .map(doc => doc.id)
        .filter(id => id !== 'placeholder'); // Skip placeholders
      
      return new Student({
        id: studentDoc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birthDate: data.birthDate?.toDate(),
        enrolledCourses
      });
    } catch (error) {
      console.error(`Error getting student ${studentId}:`, error);
      throw error;
    }
  },
  
  // Add a new student
  add: async (student) => {
    try {
      const studentData = {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        birthDate: student.birthDate, // Will be automatically converted to Firestore timestamp
        enrolledCourses: [] // Start with no enrolled courses
      };
      
      // Use student's ID if provided (for Israeli ID numbers)
      if (student.id) {
        await setDoc(doc(db, COLLECTION_NAME, student.id), studentData);
        
        // Initialize enrollments subcollection with placeholder
        const enrollmentsRef = doc(db, COLLECTION_NAME, student.id, 'enrollments', 'placeholder');
        await setDoc(enrollmentsRef, { _placeholder: true });
        
        return new Student({
          ...student,
          enrolledCourses: []
        });
      } else {
        // Let Firestore generate an ID
        const docRef = await addDoc(collection(db, COLLECTION_NAME), studentData);
        
        // Initialize enrollments subcollection with placeholder
        const enrollmentsRef = doc(db, COLLECTION_NAME, docRef.id, 'enrollments', 'placeholder');
        await setDoc(enrollmentsRef, { _placeholder: true });
        
        return new Student({
          ...student,
          id: docRef.id,
          enrolledCourses: []
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },
  
  // Update a student
  update: async (student) => {
    try {
      const studentRef = doc(db, COLLECTION_NAME, student.id);
      
      await updateDoc(studentRef, {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        birthDate: student.birthDate
      });
      
      return student;
    } catch (error) {
      console.error(`Error updating student ${student.id}:`, error);
      throw error;
    }
  },
  
  // Delete a student
  delete: async (studentId) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, studentId));
      
      // In a real production app, you'd use Cloud Functions
      // to remove this student from all courses they're enrolled in
      
      return true;
    } catch (error) {
      console.error(`Error deleting student ${studentId}:`, error);
      throw error;
    }
  },
  
  // Enroll student in a course
  enrollInCourse: async (studentId, courseId) => {
    try {
      // Add course to student's enrollments subcollection
      await setDoc(
        doc(db, COLLECTION_NAME, studentId, 'enrollments', courseId),
        { enrolled: true }
      );
      
      // Update the enrolledCourses array in the student document
      const studentRef = doc(db, COLLECTION_NAME, studentId);
      const studentDoc = await getDoc(studentRef);
      
      if (studentDoc.exists()) {
        const enrolledCourses = studentDoc.data().enrolledCourses || [];
        if (!enrolledCourses.includes(courseId)) {
          await updateDoc(studentRef, {
            enrolledCourses: [...enrolledCourses, courseId]
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Remove student from course
  removeFromCourse: async (studentId, courseId) => {
    try {
      // Remove course from student's enrollments subcollection
      await deleteDoc(
        doc(db, COLLECTION_NAME, studentId, 'enrollments', courseId)
      );
      
      // Update the enrolledCourses array in the student document
      const studentRef = doc(db, COLLECTION_NAME, studentId);
      const studentDoc = await getDoc(studentRef);
      
      if (studentDoc.exists()) {
        const enrolledCourses = studentDoc.data().enrolledCourses || [];
        await updateDoc(studentRef, {
          enrolledCourses: enrolledCourses.filter(id => id !== courseId)
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error removing student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  }
};