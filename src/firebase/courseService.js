import { db } from './config';
import { Course, Assignment, Message } from '../models/Models';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  setDoc, writeBatch, query, where, serverTimestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'courses';

// Generate a unique 4-digit ID for new courses
const generateUniqueId = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const existingIds = snapshot.docs.map(doc => doc.id);
    
    let id;
    do {
      // Generate a 4-digit ID between 1000-9999
      id = Math.floor(1000 + Math.random() * 9000).toString();
    } while (existingIds.includes(id));
    
    return id;
  } catch (error) {
    console.error("Error generating unique ID:", error);
    throw error;
  }
};

export const courseService = {
  // Get all courses (basic info only, no subcollections)
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return new Course({
          id: doc.id,
          name: data.name,
          instructor: data.instructor,
          day: data.day,
          time: data.time,
          descr: data.descr,
          studentIds: data.studentIds || [],
          // Initialize empty arrays for subcollections that will be loaded separately
          assignments: [],
          messages: []
        });
      });
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  },
  
  // Get a single course with all subcollections (assignments, messages, students)
  getById: async (courseId) => {
    try {
      const courseDocRef = doc(db, COLLECTION_NAME, courseId);
      const courseDoc = await getDoc(courseDocRef);
      
      if (!courseDoc.exists()) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      
      const courseData = courseDoc.data();
      
      // Get assignments subcollection
      const assignmentsSnapshot = await getDocs(
        collection(db, COLLECTION_NAME, courseId, 'assignments')
      );
      
      // Get messages subcollection
      const messagesSnapshot = await getDocs(
        collection(db, COLLECTION_NAME, courseId, 'messages')
      );
      
      // Convert to Assignment objects
      const assignments = assignmentsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Skip placeholder documents if they exist
        if (data._placeholder) return null;
        
        return new Assignment(
          doc.id,
          data.title,
          data.description,
          data.dueDate
        );
      }).filter(Boolean); // Remove null entries
      
      // Convert to Message objects
      const messages = messagesSnapshot.docs.map(doc => {
        const data = doc.data();
        // Skip placeholder documents if they exist
        if (data._placeholder) return null;
        
        return new Message(
          doc.id,
          data.title,
          data.content,
          data.sender,
          data.timestamp?.toDate() || new Date()
        );
      }).filter(Boolean); // Remove null entries
      
      // Return as Course model instance
      return new Course({
        id: courseDoc.id,
        name: courseData.name,
        instructor: courseData.instructor,
        day: courseData.day,
        time: courseData.time,
        descr: courseData.descr,
        assignments,
        messages,
        studentIds: courseData.studentIds || []
      });
    } catch (error) {
      console.error(`Error getting course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Add a new course with empty subcollections
  add: async (course) => {
    try {
      // Generate a custom 4-digit ID if not provided
      const customId = course.id || await generateUniqueId();
      
      // Create course document
      await setDoc(doc(db, COLLECTION_NAME, customId), {
        name: course.name,
        instructor: course.instructor,
        day: course.day,
        time: course.time,
        descr: course.descr,
        studentIds: [] // Start with no students
      });
      
      // Initialize empty subcollections with placeholder docs
      // This ensures they appear in Firestore console
      const batch = writeBatch(db);
      
      // Create placeholder for assignments subcollection
      const assignmentsRef = doc(db, COLLECTION_NAME, customId, 'assignments', 'placeholder');
      batch.set(assignmentsRef, { _placeholder: true });
      
      // Create placeholder for messages subcollection
      const messagesRef = doc(db, COLLECTION_NAME, customId, 'messages', 'placeholder');
      batch.set(messagesRef, { _placeholder: true });
      
      // Create placeholder for enrollments subcollection
      const enrollmentsRef = doc(db, COLLECTION_NAME, customId, 'enrollments', 'placeholder');
      batch.set(enrollmentsRef, { _placeholder: true });
      
      // Commit batch to initialize subcollections
      await batch.commit();
      
      console.log(`Course created with ID: ${customId}`);
      
      // Return the course with the assigned ID
      return new Course({
        ...course,
        id: customId,
        assignments: [],
        messages: [],
        studentIds: []
      });
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },
  
  // Update a course (main document only)
  update: async (course) => {
    try {
      const courseRef = doc(db, COLLECTION_NAME, course.id);
      
      // Only update main course fields, not subcollections
      await updateDoc(courseRef, {
        name: course.name,
        instructor: course.instructor,
        day: course.day,
        time: course.time,
        descr: course.descr
      });
      
      return course;
    } catch (error) {
      console.error(`Error updating course ${course.id}:`, error);
      throw error;
    }
  },
  
  // Delete a course and its subcollections
  delete: async (courseId) => {
    try {
      // Delete the main course document
      await deleteDoc(doc(db, COLLECTION_NAME, courseId));
      
      // NOTE: In a real production app, you'd use Cloud Functions 
      // to recursively delete subcollections
      // Here we're just deleting the main document for simplicity
      
      return true;
    } catch (error) {
      console.error(`Error deleting course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Assignment operations
  addAssignment: async (courseId, assignment) => {
    try {
      const assignmentData = {
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate
      };
      
      const docRef = await addDoc(
        collection(db, COLLECTION_NAME, courseId, 'assignments'),
        assignmentData
      );
      
      // Return the assignment with its new ID
      return new Assignment(
        docRef.id,
        assignment.title,
        assignment.description,
        assignment.dueDate
      );
    } catch (error) {
      console.error(`Error adding assignment to course ${courseId}:`, error);
      throw error;
    }
  },
  
  updateAssignment: async (courseId, assignment) => {
    try {
      const assignmentRef = doc(
        db, 
        COLLECTION_NAME, 
        courseId, 
        'assignments', 
        assignment.id
      );
      
      await updateDoc(assignmentRef, {
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate
      });
      
      return assignment;
    } catch (error) {
      console.error(`Error updating assignment ${assignment.id}:`, error);
      throw error;
    }
  },
  
  deleteAssignment: async (courseId, assignmentId) => {
    try {
      await deleteDoc(
        doc(db, COLLECTION_NAME, courseId, 'assignments', assignmentId)
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting assignment ${assignmentId}:`, error);
      throw error;
    }
  },
  
  // Message operations
  addMessage: async (courseId, message) => {
    try {
      const messageData = {
        title: message.title,
        content: message.content,
        sender: message.sender,
        timestamp: new Date() // Current date/time
      };
      
      const docRef = await addDoc(
        collection(db, COLLECTION_NAME, courseId, 'messages'),
        messageData
      );
      
      // Return the message with its new ID
      return new Message(
        docRef.id,
        message.title,
        message.content,
        message.sender,
        messageData.timestamp
      );
    } catch (error) {
      console.error(`Error adding message to course ${courseId}:`, error);
      throw error;
    }
  },
  
  deleteMessage: async (courseId, messageId) => {
    try {
      await deleteDoc(
        doc(db, COLLECTION_NAME, courseId, 'messages', messageId)
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting message ${messageId}:`, error);
      throw error;
    }
  },
  
  // Student enrollment operations
  enrollStudent: async (courseId, studentId) => {
    try {
      // Create enrollment document in course's enrollments subcollection
      await setDoc(
        doc(db, COLLECTION_NAME, courseId, 'enrollments', studentId),
        { enrolled: true }
      );
      
      // Update the studentIds array in the course document
      const courseRef = doc(db, COLLECTION_NAME, courseId);
      const courseDoc = await getDoc(courseRef);
      
      if (courseDoc.exists()) {
        const studentIds = courseDoc.data().studentIds || [];
        if (!studentIds.includes(studentId)) {
          await updateDoc(courseRef, {
            studentIds: [...studentIds, studentId]
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
      throw error;
    }
  },
  
  removeStudent: async (courseId, studentId) => {
    try {
      // Remove from enrollments subcollection
      await deleteDoc(
        doc(db, COLLECTION_NAME, courseId, 'enrollments', studentId)
      );
      
      // Also remove from studentIds array in the course document
      const courseRef = doc(db, COLLECTION_NAME, courseId);
      const courseDoc = await getDoc(courseRef);
      
      if (courseDoc.exists()) {
        const studentIds = courseDoc.data().studentIds || [];
        await updateDoc(courseRef, {
          studentIds: studentIds.filter(id => id !== studentId)
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error removing student ${studentId} from course ${courseId}:`, error);
      throw error;
    }
  }
};