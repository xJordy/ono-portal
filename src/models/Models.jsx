// Simple Student model
export class Student {
  constructor(id, firstName, lastName, email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.enrolledCourses = [];
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  enrollInCourse(course) {
    // Store only the course ID instead of the entire course object
    this.enrolledCourseIds = this.enrolledCourseIds || [];
    this.enrolledCourseIds.push(course.id);
  }
}

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
  constructor(id, content, sender, timestamp) {
    this.id = id;
    this.content = content;
    this.sender = sender;
    this.timestamp = timestamp || new Date();
  }
}

// Simple Course model
export class Course {
  constructor(id, name, instructor, day, time, descr) {
    this.id = id;
    this.name = name;
    this.instructor = instructor;
    this.day = day;
    this.time = time;
    this.descr = descr;
    this.assignments = /** @type {Assignment[]} */ ([]);
    this.messages = /** @type {Message[]} */ ([]);
    this.students = /** @type {Student[]} */ ([]);
  }

  // Assignment methods
  addAssignment(assignment) {
    this.assignments.push(assignment);
    return this;
  }

  removeAssignment(assignmentId) {
    this.assignments = this.assignments.filter(a => a.id !== assignmentId);
    return this;
  }

  updateAssignment(assignmentId, updates) {
    const index = this.assignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      this.assignments[index] = { ...this.assignments[index], ...updates };
    }
    return this;
  }

  // Message methods
  addMessage(message) {
    this.messages.push(message);
    return this;
  }
  
  removeMessage(messageId) {
    this.messages = this.messages.filter(m => m.id !== messageId);
    return this;
  }

  // Student methods
  enrollStudent(student) {
    this.students.push(student);
    student.enrollInCourse(this);
    return this;
  }
  
  removeStudent(studentId) {
    this.students = this.students.filter(s => s.id !== studentId);
    return this;
  }
  
  updateStudent(studentId, updates) {
    const index = this.students.findIndex(s => s.id === studentId);
    if (index !== -1) {
      this.students[index] = { ...this.students[index], ...updates };
    }
    return this;
  }
}
