import { db } from "./config";
import { courseService } from "./courseService";
import { studentService } from "./studentService";

export { db, courseService, studentService };

// Export a function to initialize Firestore data
// This replaces your current initializeAppData function
export const initializeFirestore = async () => {
  try {
    // Check if courses collection exists and has documents
    const coursesSnapshot = await courseService.getAll();

    if (coursesSnapshot.length === 0) {
      console.log(
        "No courses found. You might want to initialize with sample data."
      );
      // You could call a function here to create sample data
      // await createSampleData();
    }

    return true;
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    return false;
  }
};
