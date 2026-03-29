// Profile feature components
export { default as ProfileSidebar } from './ProfileSidebar'
export { default as ProBanner } from './ProBanner'
export { default as Toast } from './Toast'

// Modals
export { default as AvatarCropModal } from './modals/AvatarCropModal'
export { default as CommentModal } from './modals/CommentModal'
export { default as PasswordModal } from './modals/PasswordModal'
export { default as PaymentModal } from './modals/PaymentModal'
export { default as TransactionModal } from './modals/TransactionModal'

// Tabs
export { default as ProfileTab } from './tabs/ProfileTab'
export { default as CoursesTab } from './tabs/CoursesTab'
export { default as PaymentsTab } from './tabs/PaymentsTab'
export { default as PersonalDataTab } from './tabs/PersonalDataTab'
export { default as CommentsTab } from './tabs/CommentsTab'
export { default as SettingsTab } from './tabs/SettingsTab'

// Hooks
export { useProfileData, type ProfileUser } from './hooks/useProfileData'
export { useProfileSettings } from './hooks/useProfileSettings'
export { useReviews } from './hooks/useReviews'
