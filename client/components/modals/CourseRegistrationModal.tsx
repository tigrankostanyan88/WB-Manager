'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, Loader2, Phone, User as UserIcon, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

interface Course {
  id: number | string
  title: string
}

interface CourseRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CourseRegistrationModal({ isOpen, onClose }: CourseRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    courseId: ''
  })

  // Fetch courses when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCourses()
    }
  }, [isOpen])

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true)
      const res = await api.get('/api/v1/courses')
      const coursesData = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.courses || res.data?.courses || [])
      setCourses(Array.isArray(coursesData) ? coursesData.map((c: any) => ({ id: c.id, title: c.title })) : [])
    } catch (err) {
      console.error('Error fetching courses:', err)
    } finally {
      setCoursesLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const selectedCourse = courses.find(c => String(c.id) === formData.courseId)

      const response = await fetch('/api/v1/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: `${formData.phone}@placeholder.com`,
          phone: formData.phone,
          packageType: selectedCourse?.title || 'Դասընթաց'
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'Գրանցման սխալ')
      }

      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setFormData({ name: '', phone: '', courseId: '' })
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Գրանցման սխալ')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-2 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative px-4 sm:px-8 pt-8 pb-8">
            {/* Success Animation or Logo */}
            <div className="mx-auto w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-6 relative z-10 border-4 border-slate-50">
               {isSuccess ? (
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 10 }}
                 >
                   <CheckCircle className="w-12 h-12 text-emerald-500" />
                 </motion.div>
               ) : (
                 <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                   WB
                 </div>
               )}
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {isSuccess ? 'Գրանցումը հաջողվեց' : 'Գրանցում դասընթացին'}
              </h2>
              <p className="text-slate-500 text-base max-w-[340px] mx-auto leading-relaxed">
                {isSuccess 
                  ? 'Շնորհակալություն, մենք շուտով կապ կհաստատենք ձեզ հետ։' 
                  : 'Լրացրեք տվյալները՝ դասընթացին գրանցվելու համար'}
              </p>
            </div>

            {!isSuccess && (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Course Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Դասընթաց</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        required
                        name="courseId"
                        value={formData.courseId}
                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                        disabled={coursesLoading}
                      >
                        <option value="">{coursesLoading ? 'Բեռնում...' : 'Ընտրեք դասընթացը'}</option>
                        {courses.map((course) => (
                          <option key={course.id} value={String(course.id)}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Անուն Ազգանուն</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        type="text" 
                        placeholder="Արմեն Արմենյան"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Հեռախոս</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        type="tel" 
                        placeholder="+374 99 99 99 99"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium text-center bg-red-50 py-2.5 rounded-xl border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button 
                    disabled={isLoading}
                    className="w-full py-7 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Գրանցվել'
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
