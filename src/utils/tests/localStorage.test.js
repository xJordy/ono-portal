import { describe, beforeEach, test, expect, vi } from 'vitest';
import { 
  saveCoursesToLocalStorage,
  getCoursesFromLocalStorage,
  clearCoursesFromLocalStorage,
  saveCourseToLocalStorage,
  getCourseFromLocalStorage
} from '../localStorage';

// Create localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

// Replace window.localStorage with our mock
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('localStorage utilities', () => {
  beforeEach(() => {
    // Clear mock data and reset mock function calls before each test
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  test('saveCoursesToLocalStorage should save courses to localStorage', () => {
    // Arrange
    const testCourses = [{ id: '1', name: 'React Course' }];
    
    // Act
    saveCoursesToLocalStorage(testCourses);
    
    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'courses',
      JSON.stringify(testCourses)
    );
  });

  test('getCoursesFromLocalStorage should return courses from localStorage', () => {
    // Arrange
    const testCourses = [{ id: '1', name: 'React Course' }];
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(testCourses));
    
    // Act
    const result = getCoursesFromLocalStorage();
    
    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('courses');
    expect(result).toEqual(testCourses);
  });

  test('getCoursesFromLocalStorage should return empty array when no courses exist', () => {
    // Arrange
    localStorage.getItem.mockReturnValueOnce(null);
    
    // Act
    const result = getCoursesFromLocalStorage();
    
    // Assert
    expect(result).toEqual([]);
  });

  test('clearCoursesFromLocalStorage should remove courses from localStorage', () => {
    // Act
    clearCoursesFromLocalStorage();
    
    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('courses');
  });

  test('saveCourseToLocalStorage should update a course in localStorage', () => {
    // Arrange
    const existingCourses = [
      { id: '1', name: 'React Basics' },
      { id: '2', name: 'Advanced JavaScript' }
    ];
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(existingCourses));
    
    const updatedCourse = { id: '1', name: 'React Advanced' };
    
    // Act
    saveCourseToLocalStorage(updatedCourse);
    
    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'courses',
      JSON.stringify([
        { id: '1', name: 'React Advanced' },
        { id: '2', name: 'Advanced JavaScript' }
      ])
    );
  });

  test('getCourseFromLocalStorage should return specific course by ID', () => {
    // Arrange
    const existingCourses = [
      { id: '1', name: 'React Basics' },
      { id: '2', name: 'Advanced JavaScript' }
    ];
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(existingCourses));
    
    // Act
    const result = getCourseFromLocalStorage('2');
    
    // Assert
    expect(result).toEqual({ id: '2', name: 'Advanced JavaScript' });
  });

  test('getCourseFromLocalStorage should return undefined for non-existent course ID', () => {
    // Arrange
    const existingCourses = [{ id: '1', name: 'React Basics' }];
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(existingCourses));
    
    // Act
    const result = getCourseFromLocalStorage('999');
    
    // Assert
    expect(result).toBeUndefined();
  });
});
