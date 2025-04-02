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
    this.enrolledCourses.push(course);
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

  addAssignment(assignment) {
    this.assignments.push(assignment);
  }

  addMessage(message) {
    this.messages.push(message);
  }

  enrollStudent(student) {
    this.students.push(student);
    student.enrollInCourse(this);
  }
}