const catchAsync = require('../utils/catchAsync');
const service = require('../services/review');

module.exports = {
  // CREATE Review
  addReview: catchAsync(async (req, res, next) => {
    const review = await service.addReview(req.body, req.user);

    res.status(201).json({
      status: 'success',
      data: { review }
    });
  }),

  // GET Reviews
  getReviews: catchAsync(async (req, res, next) => {
    const result = await service.getReviews();

    res.json({
      status: 'success',
      fromCache: result.fromCache,
      data: { reviews: result.reviews }
    });
  }),

  // UPDATE Review
  updateReview: catchAsync(async (req, res, next) => {
    const review = await service.updateReview(req.params.id, req.body, req.user);

    res.json({
      status: 'success',
      data: { review }
    });
  }),

  // GET My Review
  getMyReview: catchAsync(async (req, res, next) => {
    const review = await service.getMyReview(req.user.id);

    res.json({
      status: 'success',
      data: { review }
    });
  }),

  // DELETE Review (admin)
  deleteReview: catchAsync(async (req, res, next) => {
    await service.deleteReview(req.params.id);

    res.json({
      status: 'success',
      data: { id: req.params.id }
    });
  })
};
