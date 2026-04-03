'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { buildVideoUrl } from '@/lib/videoUtils'
import type { Course } from '@/components/features/admin/types'
import type { ExtendedCourse } from './courseTypes'

const COURSES_QUERY_KEY = 'courses'

export function useCoursesQuery() {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get('/api/v1/courses')
      // Handle different API response structures
      const coursesData = response.data?.data || response.data?.courses || response.data || []
      return (Array.isArray(coursesData) ? coursesData : []) as Course[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseData: FormData) => {
      const response = await api.post('/api/v1/courses', courseData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await api.patch(`/api/v1/courses/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/courses/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] })
    },
  })
}

export function getCourseFirstVideoUrl(course: ExtendedCourse): string | null {
  if (!course.modules || course.modules.length === 0) return null

  const firstModule = course.modules[0]
  if (!firstModule.files || firstModule.files.length === 0) return null

  const videoFile = firstModule.files.find((f) => f.name_used === 'module_video')
  if (!videoFile) return null

  return buildVideoUrl(videoFile.name, videoFile.ext)
}
