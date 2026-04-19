'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export interface CourseRegistration {
  id: number
  course_id: number
  name: string
  phone: string
  createdAt: string
  updatedAt: string
  viewed?: boolean
  course?: {
    id: number
    title: string
  }
}

const QUERY_KEY = ['course-registrations']

async function fetchRegistrations(): Promise<CourseRegistration[]> {
  const res = await api.get('/api/v1/register-course')
  const data = res.data?.data || []
  return Array.isArray(data) ? data : []
}

export function useCourseRegistrations({ activeTab, allowed }: { activeTab: string; allowed: boolean }) {
  const queryClient = useQueryClient()

  // Query for fetching registrations
  const { 
    data: registrations = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchRegistrations,
    enabled: allowed,
    staleTime: 30 * 1000, // 30 seconds
  })

  // Mutation for deleting
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/register-course/${id}`)
      return id
    },
    onSuccess: (deletedId) => {
      // Optimistically update cache
      queryClient.setQueryData(QUERY_KEY, (old: CourseRegistration[] = []) => 
        old.filter(r => r.id !== deletedId)
      )
    },
    onError: (error) => {
      console.error('Failed to delete registration:', error)
    }
  })

  // Mutation for marking as viewed
  const markAsViewedMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/api/v1/register-course/${id}/viewed`)
      return id
    },
    onSuccess: (viewedId) => {
      // Optimistically update cache
      queryClient.setQueryData(QUERY_KEY, (old: CourseRegistration[] = []) => 
        old.map(r => r.id === viewedId ? { ...r, viewed: true } : r)
      )
    },
    onError: (error) => {
      console.error('Failed to mark as viewed:', error)
    }
  })

  const unviewedCount = registrations.filter(r => !r.viewed).length

  return {
    registrations,
    isLoading,
    isDeleting: deleteMutation.isPending ? deleteMutation.variables : null,
    deleteRegistration: deleteMutation.mutateAsync,
    markAsViewed: markAsViewedMutation.mutateAsync,
    refresh: refetch,
    unviewedCount
  }
}
