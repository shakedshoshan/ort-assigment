import { useState, useEffect } from 'react';
import { type Student} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_STUDENTS_URL || '';

/**
 * Hook to fetch and manage all students
 * @returns {Object} students data, loading state, error state, and refetch function
 */
export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Student[] = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    refetch: fetchStudents
  };
};

/**
 * Hook to fetch a specific student by ID
 * @param {string} studentId - The ID of the student to fetch
 * @returns {Object} student data, loading state, error state, and refetch function
 */
export const useStudent = (studentId: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async () => {
    if (!studentId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${studentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Student = await response.json();
      setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  return {
    student,
    loading,
    error,
    refetch: fetchStudent
  };
};
