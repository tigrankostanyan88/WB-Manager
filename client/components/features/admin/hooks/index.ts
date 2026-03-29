// Admin hooks barrel export - merged hooks only
export {
  useEnrollments,
  useEnrollmentsQuery,
  useEnrollmentCoursesQuery,
  useRevokeAccess,
  type Enrollment,
  type Course as EnrollmentCourse,
} from './useEnrollments'

export {
  usePayments,
  usePaymentsQuery,
  usePaymentUsersQuery,
  usePaymentCoursesQuery,
  useCreatePayment,
  useVerifyPayment,
  useUpdatePaymentStatus,
  type Payment,
  type Course as PaymentCourse,
  type PaymentFormData,
} from './usePayments'

export {
  useUsers,
  useUsersQuery,
  usePaymentsQuery as useUserPaymentsQuery,
  useDeleteUser,
  useUpdateUser,
  useToggleUserPaid,
  type Payment as UserPayment,
  type EditUserForm,
} from './useUsers'

export {
  useCourses,
  useCoursesQuery,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  type Course,
  type CourseFile,
  type CourseModuleWithVideos,
  type ExtendedCourse,
  type CourseModule,
  type CourseVideo,
  type CourseForm,
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
  type ModuleItem,
  type ModuleFile,
  type CourseOption,
  type ModuleForm,
  mapModule,
  parseModules,
} from './useModules'
