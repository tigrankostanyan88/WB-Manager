// hooks/modules/mutations.ts - Module mutation hooks

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ModuleForm } from './types'
import { MODULES_QUERY_KEY } from './utils'

export function useCreateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ModuleForm) => {
      const res = await api.post('/api/v1/modules', {
        title: data.title,
        duration: data.duration,
        courseId: Number(data.courseId),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ModuleForm }) => {
      const res = await api.patch(`/api/v1/modules/${id}`, {
        title: data.title.trim(),
        duration: data.duration.trim(),
        courseId: data.courseId,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/modules/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useUploadModuleVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ moduleId, videoFile }: { moduleId: string; videoFile: File }) => {
      const formData = new FormData()
      formData.append('module_video', videoFile)
      const res = await api.post(`/api/v1/modules/${moduleId}/video`, formData)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useDeleteModuleVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (fileId: string) => {
      await api.delete(`/api/v1/files/${fileId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}

export function useUpdateVideoTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ fileId, title }: { fileId: string; title: string }) => {
      await api.patch(`/api/v1/files/${fileId}`, { title })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODULES_QUERY_KEY] })
    },
  })
}
