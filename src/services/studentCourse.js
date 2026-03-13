const AppError = require('../utils/Error');
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

    return repo.create({
      user_id: userId,
      course_id: courseId,
      status: 'active',
      price_paid: pricePaid || course.price,
      payment_method: paymentMethod || 'manual',
      notes: notes || null
    });
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

    const enrollments = await repo.findAllByUser(userId);

    return {
      enrollments,
      count: enrollments.length
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
