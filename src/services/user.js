const { USERS_ALL_KEY, USERS_TTL } = require('../constants/cache');
const cache = require('../utils/cache');
const AppError = require('../utils/appError');
const Files = require('../controllers/File');
const repo = require('../repositories/user');
const Validator = require('../utils/validation');

async function getAll({ excludeRoles = [] } = {}) {
  const cacheKey = USERS_ALL_KEY;
  const cached = await cache.get(cacheKey);
  if (cached) return { users: cached, fromCache: true };
  
  // Repository handles the Op.notIn logic
  const users = await repo.findAllExcludingRoles(excludeRoles);
  await cache.set(cacheKey, users, USERS_TTL);
  return { users, fromCache: false };
}

async function listPaged(page = 1, limit = 20, search = '', role = 'all', excludeId = null) {
  // Repository handles all Op operators (Op.ne, Op.or, Op.like)
  const { count, rows } = await repo.findPaged({ page, limit, search, role, excludeId });
  return { users: rows, total: count };
}

async function getUserById(id) {
  const user = await repo.findById(id);
  if (!user) throw new AppError('Օգտատերը չի գտնվել:', 404);
  return user;
}

async function countByRole(role) {
  return repo.count({ where: { role } });
}

async function updateUser(id, body, files) {
  const user = await repo.findById(id);
  if (!user) throw new AppError('Օգտատերը չի գտնվել:', 404);

  // Check email uniqueness using repository
  if (body.email && body.email !== user.email) {
    const existingUser = await repo.findByEmail(body.email);
    if (existingUser) {
      throw new AppError('Այս էլ․ հասցեն արդեն գրանցված է համակարգում։', 400);
    }
  }

  // If setting isPaid to true, set expiration to 30 days from now
   if (body.isPaid === true || body.isPaid === 'true') {
       user.isPaid = true;
       user.paymentExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
   } else if (body.isPaid === false || body.isPaid === 'false') {
      user.isPaid = false;
      user.paymentExpiresAt = null;
  }
  
  for (let key in body) {
      if (key !== 'isPaid') { 
          user[key] = body[key];
      }
  }

  // Handle course_ids array - add or remove course IDs
  // Support both snake_case (course_ids) and camelCase (courseIds) from frontend
  const courseIdsFromBody = body.course_ids !== undefined ? body.course_ids : body.courseIds;
  
  if (courseIdsFromBody !== undefined) {
      let currentCourseIds = [];
      if (user.course_ids && Array.isArray(user.course_ids)) {
          currentCourseIds = [...user.course_ids];
      }
      
      // If course_id to add
      if (body.add_course_id) {
          const courseId = parseInt(body.add_course_id, 10);
          if (!currentCourseIds.includes(courseId)) {
              currentCourseIds.push(courseId);
          }
          user.course_ids = currentCourseIds;
      }
      
      // If course_id to remove
      if (body.remove_course_id) {
          const courseId = parseInt(body.remove_course_id, 10);
          user.course_ids = currentCourseIds.filter(id => id !== courseId);
      }
      
      // If full course_ids array provided (from either course_ids or courseIds)
      if (courseIdsFromBody && Array.isArray(courseIdsFromBody)) {
          user.course_ids = courseIdsFromBody.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
      }
  }

  await repo.save(user);
  
  const filePayload = files?.user_img || files?.image || files?.avatar;
  if (filePayload && filePayload.name && filePayload.mimetype) {
    const modelForFiles = {
      id: user.id,
      files: Array.isArray(user.files) ? user.files : [],
      constructor: { name: 'users' }
    };
    const img = await new Files(modelForFiles, filePayload).replace('user_img');
    if (img.status !== 'success') {
      const msg = typeof img.message === 'object' ? Object.values(img.message).join(' ') : img.message;
      throw new AppError(msg, 400);
    }
    await user.createFile(img.table);
  }
  
  await cache.del(USERS_ALL_KEY);
  return repo.findById(user.id);
}

async function updateMe(currentUserId, body, files) {
  const user = await repo.findById(currentUserId);
  if (!user) throw new AppError('Օգտատերը չի գտնվել:', 404);

  // Validate input
  const validator = new Validator(body);
  if (body.email) validator.email('email');
  if (body.phone) validator.phone('phone');
  validator.validate();

  // Restrict fields that user can update
  const allowedFields = ['name', 'email', 'phone', 'address', 'bio'];
  const filteredBody = {};
  
  Object.keys(body).forEach(el => {
    if (allowedFields.includes(el)) filteredBody[el] = body[el];
  });

  // Check email uniqueness using repository
  if (filteredBody.email && filteredBody.email !== user.email) {
    const existingUser = await repo.findByEmail(filteredBody.email);
    if (existingUser) throw new AppError('Այս էլ․ հասցեն արդեն գրանցված է համակարգում։', 400);
  }

  for (let key in filteredBody) user[key] = filteredBody[key];
  await repo.save(user);
  
  const filePayload = files?.user_img || files?.image || files?.avatar;
  if (filePayload && filePayload.name && filePayload.mimetype) {
    const modelForFiles = {
      id: user.id,
      files: Array.isArray(user.files) ? user.files : [],
      constructor: { name: 'users' }
    };

    console.log(modelForFiles, 'MODEL USER');
    const img = await new Files(modelForFiles, filePayload).replace('user_img');
    if (img.status !== 'success') {
      const msg = typeof img.message === 'object' ? Object.values(img.message).join(' ') : img.message;
      throw new AppError(msg, 400);
    }
    await user.createFile(img.table);
  }
  
  return repo.findById(user.id);
}

async function deleteUser(id) {
  const user = await repo.findById(id);
  if (!user) throw new AppError('Օգտատերը չի գտնվել:', 404);
  user.deleted = true;
  await repo.save(user);
  await cache.del(USERS_ALL_KEY);
  return true;
}

async function deleteAvatar(currentUserId) {
  const user = await repo.findById(currentUserId);
  if (!user) throw new AppError('Օգտատերը չի գտնվել:', 404);
  const file = await repo.findAvatarFileForUser(user.id);
  if (!file) throw new AppError('Նկարը չի գտնվել:', 404);
  await repo.destroyFileById(file.id);
  await cache.del(USERS_ALL_KEY);
  return user;
}

async function resetGroups(userId) {
  const user = await repo.findById(userId);
  if (!user) throw new AppError('Օգտատերը չի գտնվել:', 404);
  user.groupResults = null;
  await repo.save(user);
  await cache.del(USERS_ALL_KEY);
  return user;
}

module.exports = {
  getAll,
  listPaged,
  getUserById,
  countByRole,
  updateUser,
  updateMe,
  deleteUser,
  deleteAvatar,
  resetGroups
};
