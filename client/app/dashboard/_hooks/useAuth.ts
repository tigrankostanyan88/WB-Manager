import { useAuth as useGlobalAuth } from '@/lib/auth';

export default function useAuth() {
  const { user, isLoaded } = useGlobalAuth()
  
  const isAuthLoading = !isLoaded
  const allowed = user?.role === 'admin'

  return { isAuthLoading, allowed }
}

