'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  User, Mail, Phone, MapPin, Calendar, Award, Star, 
  Briefcase, GraduationCap, Clock, Globe, Edit, Camera,
  ChevronRight, TrendingUp, BookOpen, Shield, Heart,
  MessageSquare, Share2, MoreHorizontal, CheckCircle2,
  Crown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  role: string
  createdAt: string
  bio?: string
  title?: string
  location?: string
  rating?: number
  reviewCount?: number
}

interface Course {
  id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'expired'
  progress: number
  lessonsCompleted: number
  totalLessons: number
  thumbnail?: string
  enrolledAt: string
}

interface Review {
  id: string
  courseId: string
  courseTitle: string
  rating: number
  comment: string
  createdAt: string
}

interface Skill {
  name: string
  level: number
  color: string
}

type TabType = 'security' | 'personal' | 'courses' | 'reviews'

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Skills data
  const skills: Skill[] = [
    { name: 'HTML/CSS', level: 95, color: 'from-orange-500 to-red-500' },
    { name: 'JavaScript', level: 90, color: 'from-yellow-400 to-orange-500' },
    { name: 'React', level: 85, color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js', level: 80, color: 'from-green-500 to-emerald-600' },
    { name: 'UI/UX Design', level: 75, color: 'from-purple-500 to-pink-500' },
  ]

  useEffect(() => {
    fetchUserData()
    fetchCourses()
    fetchReviews()
  }, [])

  const fetchUserData = async () => {
    try {
      const res = await api.get('/api/v1/users/me')
      if (res.status === 200) {
        const userData = res.data.user
        setUser({
          ...userData,
          title: 'Ուսանող',
          location: userData.address || 'Երևան, Հայաստան',
          bio: userData.bio || 'Ուսանող WB Mastery պլատֆորմում',
          rating: 4.8,
          reviewCount: 12
        })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/v1/student-courses/my-courses')
      if (res.status === 200) {
        const transformedCourses = res.data.data.map((enrollment: any) => ({
          id: enrollment.course?.id || enrollment.id,
          title: enrollment.course?.title || 'Անհայտ դասընթաց',
          description: enrollment.course?.description || '',
          status: enrollment.status,
          progress: Math.round(enrollment.progress || 0),
          lessonsCompleted: enrollment.lessons_completed || 0,
          totalLessons: enrollment.course?.lessons_count || 0,
          thumbnail: enrollment.course?.thumbnail,
          enrolledAt: enrollment.enrolled_at
        }))
        setCourses(transformedCourses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/v1/reviews/me')
      if (res.status === 200) {
        setReviews(res.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 rounded-2xl border-4 border-white/30 animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    return null
  }

  const stats = [
    { label: 'Դասընթացներ', value: courses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Ավարտված', value: courses.filter(c => c.status === 'completed').length, icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'Կարծիքներ', value: reviews.length, icon: MessageSquare, color: 'bg-purple-500' },
    { label: 'Միավորներ', value: '1,250', icon: Star, color: 'bg-amber-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50">
      <Header />
      
      {/* Hero Section with Glassmorphism */}
      <div className="relative pt-24 pb-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Profile Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/50 p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-xl shadow-lg text-violet-600 hover:bg-violet-50 transition-all hover:scale-110">
                  <Camera className="w-5 h-5" />
                </button>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{user.name}</h1>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="font-bold text-violet-600">{user.title}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-black text-slate-900">{user.rating}</span>
                      <span className="text-slate-400 text-sm">({user.reviewCount} կարծիք)</span>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/dashboard">
                        <button className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all">
                          Ադմին
                        </button>
                      </Link>
                    )}
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-3 bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-600 rounded-xl transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 mb-6 max-w-2xl">{user.bio}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-slate-50 rounded-2xl p-4 hover:bg-violet-50 transition-colors cursor-pointer group"
                    >
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6"
            >
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-500" />
                Կոնտակտային տվյալներ
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                    <p className="text-sm font-bold text-slate-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Հեռախոս</p>
                    <p className="text-sm font-bold text-slate-900">{user.phone || 'Նշված չէ'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Հասցե</p>
                    <p className="text-sm font-bold text-slate-900">{user.address || 'Նշված չէ'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Գրանցված</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(user.createdAt).toLocaleDateString('hy-AM')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-sm p-2 mb-6">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'security' as TabType, label: 'Անվտանգություն', icon: Shield },
                  { id: 'personal' as TabType, label: 'Անձնական տվյալներ', icon: User },
                  { id: 'courses' as TabType, label: 'Ընթացիկ դասընթաց', icon: BookOpen },
                  { id: 'reviews' as TabType, label: 'Թողնել կարծիք', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Recent Activity */}
                  <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-violet-500" />
                      Վերջին գործունեություն
                    </h3>
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course, i) => (
                        <div key={course.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-violet-50 transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-1">{course.title}</h4>
                            <p className="text-sm text-slate-500 mb-2">{course.description || 'Նոր դասեր են ավելացվել'}</p>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-violet-600">{course.progress}%</span>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">{new Date(course.enrolledAt).toLocaleDateString('hy-AM')}</span>
                        </div>
                      ))}
                      {courses.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-slate-400" />
                          </div>
                          <p className="text-slate-500">Դեռ չկա գործունեություն</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-8"
                >
                  <h3 className="text-xl font-black text-slate-900 mb-6">Իմ մասին</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {user.bio || 'Կարճ նկարագրություն ավելացված չէ'}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">Կրթություն</h4>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">WB Mastery</p>
                          <p className="text-sm text-slate-500">Online Learning Platform</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">Աշխատանք</h4>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Ուսանող</p>
                          <p className="text-sm text-slate-500">Full-time Learner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'courses' && (
                <motion.div
                  key="courses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="h-40 bg-gradient-to-br from-violet-500 to-indigo-600 relative">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-white/30" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              course.status === 'active' ? 'bg-emerald-500 text-white' :
                              course.status === 'completed' ? 'bg-blue-500 text-white' :
                              'bg-slate-500 text-white'
                            }`}>
                              {course.status === 'active' ? 'Ակտիվ' :
                               course.status === 'completed' ? 'Ավարտված' : 'Ավարտված'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-slate-900 mb-2">{course.title}</h4>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400 font-bold">Առաջընթաց</span>
                              <span className="font-bold text-violet-600">{course.progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow-lg">
                      <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">Դեռ չկան դասընթացներ</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-slate-900">{review.courseTitle}</h4>
                            <p className="text-sm text-slate-400">{new Date(review.createdAt).toLocaleDateString('hy-AM')}</p>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  review.rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                      <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">Դեռ չկան կարծիքներ</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <MoreHorizontal className="w-5 h-5" />
          )}
          <span className="font-bold">{toast.message}</span>
        </motion.div>
      )}
    </div>
  )
}
