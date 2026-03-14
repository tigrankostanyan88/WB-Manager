const AppError = require('../utils/appError');
const reviewRepo = require('../repositories/review');

async function addReview(body, user) {
  const existing = await reviewRepo.findByUserId(user.id);
  if (existing) {
    throw new AppError('Դուք արդեն տեղադրել եք կարծիք:', 400);
  }
  const review = await reviewRepo.create({
    user_id: user.id,
    name: body.name || user.name,
    rating: body.rating,
    comment: body.comment,
    type: body.type || null
  });
  return review;
}

async function getReviews() {
  const reviews = await reviewRepo.findAll();
  return { reviews, fromCache: false };
}

async function updateReview(id, body, user) {
  const review = await reviewRepo.findById(id);
  if (!review) {
    throw new AppError('Կարծիքը չի գտնվել:', 404);
  }
  await reviewRepo.update(review, {
    rating: body.rating,
    comment: body.comment
  });
  return review;
}

async function getMyReview(userId) {
  return reviewRepo.findByUserId(userId);
}

async function deleteReview(id) {
  const review = await reviewRepo.findById(id);
  if (!review) {
    throw new AppError('Կարծիքը չի գտնվել:', 404);
  }
  await reviewRepo.destroy(review);
}

module.exports = {
  addReview,
  getReviews,
  updateReview,
  getMyReview,
  deleteReview
};
