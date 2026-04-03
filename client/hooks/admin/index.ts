'use client'

export {
  useEnrollments,
  useEnrollmentsQuery,
  useEnrollmentCoursesQuery,
  useRevokeAccess,
} from './useEnrollments'

export {
  usePayments,
  usePaymentsQuery,
  usePaymentUsersQuery,
  usePaymentCoursesQuery,
  useCreatePayment,
  useVerifyPayment,
  useUpdatePaymentStatus,
} from './usePayments'

export {
  useUsers,
  useUsersQuery,
  usePaymentsQuery as useUserPaymentsQuery,
  useDeleteUser,
  useUpdateUser,
  useToggleUserPaid,
} from './useUsers'

export {
  useCourses,
  useCoursesQuery,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from './useCourses'

export {
  useModules,
  useModulesQuery,
  useModuleCoursesQuery,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useUploadModuleVideo,
  useDeleteModuleVideo,
  useUpdateVideoTitle,
  mapModule,
  parseModules,
} from './modules/useModules'

// Re-export types from types.ts
