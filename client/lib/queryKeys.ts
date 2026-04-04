/**
 * React Query Keys - Centralized query key management
 * Following best practices: https://tkdodo.eu/blog/effective-react-query-keys
 */

export const queryKeys = {
  // Dashboard/Overview
  overview: ['overview'] as const,
  
  // Users
  users: ['users'] as const,
  user: (id: string | number) => ['users', id] as const,
  suspendedUsers: ['users', 'suspended'] as const,
  recentStudents: ['users', 'recent'] as const,
  
  // Courses
  courses: ['courses'] as const,
  course: (id: string | number) => ['courses', id] as const,
  
  // Modules
  modules: ['modules'] as const,
  module: (id: string | number) => ['modules', id] as const,
  moduleVideos: (moduleId: string | number) => ['modules', moduleId, 'videos'] as const,
  
  // Reviews/Comments
  reviews: ['reviews'] as const,
  
  // Instructor
  instructor: ['instructor'] as const,
  
  // Payments
  payments: ['payments'] as const,
  
  // FAQ
  faq: ['faq'] as const,
  
  // Hero Content
  heroContent: ['hero-content'] as const,
  
  // Settings
  settings: ['settings'] as const,
  
  // Contact Messages
  contactMessages: ['contact-messages'] as const,
  
  // Course Registrations
  courseRegistrations: ['course-registrations'] as const,
  
  // Enrollments
  enrollments: ['enrollments'] as const,
  enrollmentsByCourse: (courseId: string | number) => ['enrollments', 'course', courseId] as const,
  
  // Bank Cards
  bankCards: ['bank-cards'] as const,
} as const

// Helper to invalidate multiple related queries
export const invalidationPatterns = {
  allUsers: () => [['users'], ['users', 'suspended'], ['users', 'recent']] as const,
  allCourses: () => [['courses'], ['enrollments']] as const,
  allEnrollments: () => [['enrollments'], ['course-registrations']] as const,
}
