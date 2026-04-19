'use client'

import { motion } from 'framer-motion'
import { ProfileStats } from './ProfileStats'
import { ProfileCourses } from './ProfileCourses'
import { ProfilePayments } from './ProfilePayments'
import type { ProfileTabProps } from './utils'

export function ProfileTab({
  stats,
  isLoadingData,
  myCourses,
  myPayments,
  onViewAllCourses
}: ProfileTabProps) {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 min-w-0 w-full"
    >
      <ProfileStats 
        stats={stats} 
        coursesCount={myCourses.length} 
        isLoading={isLoadingData} 
      />

      <ProfileCourses 
        courses={myCourses} 
        isLoading={isLoadingData} 
        onViewAll={onViewAllCourses} 
      />

      <ProfilePayments 
        payments={myPayments} 
        isLoading={isLoadingData} 
      />
    </motion.div>
  )
}
