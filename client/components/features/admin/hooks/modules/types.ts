// hooks/modules/types.ts - Module-related type definitions

import type { DashboardTabId } from '../../types'

export interface ModuleFile {
  id: string
  name: string
  ext: string
  title?: string
  name_used?: string
  table_name?: string
}

export interface ModuleItem {
  id: string
  title: string
  duration: string
  courseId: string
  files?: ModuleFile[]
}

export interface CourseOption {
  id: string
  title: string
}

export interface ModuleForm {
  title: string
  courseId: string
  description: string
}

export interface UseModulesParams {
  activeTab: DashboardTabId
  showToast: (message: string, type?: 'success' | 'error') => void
}
