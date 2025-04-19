// Simple Assignment model
export class Assignment {
  constructor(id, title, description, dueDate) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
  }
}

// Simple Message model
export class Message {
  constructor(id, title, content, sender, timestamp) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.sender = sender;
    this.timestamp = timestamp || new Date();
  }
}

// Simple Student model
export class Student {
  constructor({ id, firstName, lastName, email, birthDate, enrolledCourses = [] }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthDate = birthDate;
    this.enrolledCourses = enrolledCourses; // Array of course IDs
  }

  enrollInCourse(course) {
    // Fix: Use enrolledCourses instead of enrolledCourseIds
    if (!this.enrolledCourses.includes(course.id)) {
      this.enrolledCourses.push(course.id);
    }
  }
}

// Simple Course model
export class Course {
  constructor({
    id,
    name,
    instructor,
    day,
    time,
    descr,
    assignments = [],
    messages = [],
    students = [],
  }) {
    this.id = id;
    this.name = name;
    this.instructor = instructor;
    this.day = day;
    this.time = time;
    this.descr = descr;
    this.assignments = assignments;
    this.messages = messages;
    this.students = students;
  }

  // Immutable Assignment Methods
  addAssignment(assignment) {
    return new Course({
      ...this,
      assignments: [...this.assignments, assignment],
    });
  }

  removeAssignment(assignmentId) {
    return new Course({
      ...this,
      assignments: this.assignments.filter((a) => a.id !== assignmentId),
    });
  }

  updateAssignment(assignmentId, updates) {
    const updatedAssignments = this.assignments.map((assignment) =>
      assignment.id === assignmentId
        ? new Assignment(
            assignment.id,
            updates.title !== undefined ? updates.title : assignment.title,
            updates.description !== undefined
              ? updates.description
              : assignment.description,
            updates.dueDate !== undefined ? updates.dueDate : assignment.dueDate
          )
        : assignment
    );
    return new Course({
      ...this,
      assignments: updatedAssignments,
    });
  }

  // Message methods
  addMessage(message) {
    return new Course({
      ...this,
      messages: [...this.messages, message],
    });
  }

  removeMessage(messageId) {
    return new Course({
      ...this,
      messages: this.messages.filter((m) => m.id !== messageId),
    });
  }

  // Student methods
  enrollStudent(student) {
    // Check if student is already enrolled
    if (!this.students.some(s => s.id === student.id)) {
      // Add the student to the course's student list
      this.students.push(student);
      
      // Re-enable this line to update the student's enrolledCourses list
      student.enrollInCourse(this);
    }
    return this;
  }

  removeStudent(studentId) {
    this.students = this.students.filter((s) => s.id !== studentId);
    return this;
  }

  updateStudent(studentId, updates) {
    const index = this.students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      this.students[index] = { ...this.students[index], ...updates };
    }
    return this;
  }
}
