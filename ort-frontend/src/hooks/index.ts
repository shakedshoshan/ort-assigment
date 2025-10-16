/**
 * API Hooks Module
 * 
 * This module exports all the custom hooks for interacting with the backend API.
 * Each hook provides a simple interface for making API calls with built-in
 * loading states, error handling, and data management.
 * 
 * Available hooks:
 * - useStudents: Manage student data (get all students, get student by ID)
 * - useQuestions: Manage question data (get, create, close questions, get answers)
 * - useAnswers: Handle answer operations (get question by code, submit answers, get existing answers)
 */

export * from './useStudents';
export * from './useQuestions';
export * from './useAnswers';
