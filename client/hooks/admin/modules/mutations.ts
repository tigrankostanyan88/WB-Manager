// hooks/modules/mutations.ts - Module mutation hooks

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { ModuleForm } from './types'

export function useCreateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ModuleForm) => {
      const res = await api.post('/api/v1/modules', {
        title: data.title,
        description: data.description,
        courseId: Number(data.courseId),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ModuleForm }) => {
      const res = await api.patch(`/api/v1/modules/${id}`, {
        title: data.title.trim(),
        description: data.description?.trim(),
        courseId: data.courseId,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.modules })
    },
  })
}
