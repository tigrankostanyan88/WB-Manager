const AppError = require('../utils/appError');
const repo = require('../repositories/studentCourse');

module.exports = {
  // Enroll student in course
  enrollStudent: async (body) => {
    const { userId, courseId, pricePaid, paymentMethod, notes } = body;

    if (!userId || !courseId) {
      throw new AppError('Օգտատիրոջ ID և դասընթացի ID պարտադիր են', 400);
    }

    // Check if user exists and is a student
    const user = await repo.findUserById(userId);
    if (!user) throw new AppError('Օգտատերը չի գտնվել', 404);
    if (user.role !== 'student' && user.role !== 'user') {
      throw new AppError('Օգտատերը պետք է լինի ուսանող', 400);
    }

    // Check if course exists
    const course = await repo.findCourseById(courseId);
    if (!course) throw new AppError('Դասընթացը չի գտնվել', 404);

    // Check if already enrolled
    const existing = await repo.findByUserAndCourse(userId, courseId);
    if (existing) {
      throw new AppError('Օգտատերը արդեն գրանցված է այս դասընթացին', 409);
    }

    const enrollment = await repo.create({
      user_id: userId,
      course_id: courseId,
      status: 'active',
      price_paid: pricePaid || course.price,
      payment_method: paymentMethod || 'manual',
      notes: notes || null
    });

    // Also add course_id to user's course_ids array
    let currentCourseIds = [];
    if (user.course_ids && Array.isArray(user.course_ids)) {
      currentCourseIds = [...user.course_ids];
    }
    const numericCourseId = Number(courseId);
    if (!currentCourseIds.includes(numericCourseId)) {
      currentCourseIds.push(numericCourseId);
      user.course_ids = currentCourseIds;
      await user.save();
    }

    return enrollment;
  },

  // Check if student has access to course
  checkAccess: async (courseId, userId) => {
    if (!userId) throw new AppError('Պետք է մուտք գործել', 401);

    const enrollment = await repo.findActiveByUserAndCourse(userId, courseId);

    return {
      hasAccess: !!enrollment,
      enrollment: enrollment || null
    };
  },

  // Get all courses for current student
  getMyCourses: async (userId) => {
    if (!userId) throw new AppError('Պետք է մուտք գործել', 401);

    // Get enrollments from student_courses table
    const enrollments = await repo.findAllByUser(userId);
    
    // Also get user's course_ids from user table
    const user = await repo.findUserById(userId);
    let courseIdsFromUser = [];
    if (user && user.course_ids && Array.isArray(user.course_ids)) {
      courseIdsFromUser = user.course_ids;
    }
    
    // Get courses that are in user's course_ids but not in student_courses
    const enrolledCourseIds = enrollments.map(e => e.course_id);
    const missingCourseIds = courseIdsFromUser.filter(id => !enrolledCourseIds.includes(id));
    
    // Fetch missing courses and add them as virtual enrollments
    const additionalEnrollments = [];
    for (const courseId of missingCourseIds) {
      const course = await repo.findCourseById(courseId);
      if (course) {
        additionalEnrollments.push({
          course_id: courseId,
          user_id: userId,
          status: 'active',
          course: course
        });
      }
    }
    
    // Combine both sources
    const allEnrollments = [...enrollments, ...additionalEnrollments];

    return {
      enrollments: allEnrollments,
      count: allEnrollments.length
    };
  },

  // Get all students for a course
  getCourseStudents: async (courseId) => {
    const enrollments = await repo.findAllByCourse(courseId);

    return {
      enrollments,
      count: enrollments.length
    };
  },

  // Get all enrollments
  getAllEnrollments: async () => {
    const enrollments = await repo.findAll();

    return {
      enrollments,
      count: enrollments.length
    };
  },

  // Revoke access
  revokeAccess: async (body) => {
    const { userId, courseId } = body;

    const enrollment = await repo.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new AppError('Գրանցումը չի գտնվել', 404);
    }

    await repo.update(enrollment, { status: 'expired' });
  }
};
