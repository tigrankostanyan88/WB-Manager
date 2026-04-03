// hooks/modules/types.ts - Module-related type definitions

import type { DashboardTabId } from '@/components/features/admin/types'

// Module type definitions (defined locally to avoid circular imports)
export interface ModuleItem {
  id: string | number
  title: string
  description?: string
  courseId?: string | number
  course_id?: string | number
  order?: number
  createdAt?: string
  updatedAt?: string
  duration?: string
  files?: ModuleFile[]
}

export interface ModuleFile {
  id: string
  name: string
  ext: string
  title?: string
  name_used?: string
  table_name?: string
}

export interface CourseOption {
  id: string | number
  title: string
}

export interface ModuleFormData {
  title: string
  description: string
  courseId: string
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
