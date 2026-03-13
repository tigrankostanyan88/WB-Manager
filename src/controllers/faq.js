const catchAsync = require('../utils/catchAsync');
const faqService = require('../services/faq');

module.exports = {
  getFaqs: catchAsync(async (req, res, next) => {
    const { faqs, fromCache } = await faqService.getAll();

    res.status(200).json({
      status: 'success',
      fromCache,
      time: `${Date.now() - req.time} ms`,
      faqs
    });
  }),

  addFaq: catchAsync(async (req, res, next) => {
    const item = await faqService.create(req.body);

    res.status(201).json({
      status: 'success',
      item,
      time: `${Date.now() - req.time} ms`
    });
  }),

  updateFaq: catchAsync(async (req, res, next) => {
    const item = await faqService.update(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      item,
      time: `${Date.now() - req.time} ms`
    });
  }),

  deleteFaq: catchAsync(async (req, res, next) => {
    await faqService.remove(req.params.id);

    res.status(204).json({
      status: 'success'
    });
  })
};
