const catchAsync = require('../utils/catchAsync');
const service = require('../services/settings');

module.exports = {
  // GET SETTINGS
  getSettings: catchAsync(async (req, res, next) => {
    const result = await service.getSettings(req.time);

    res.status(200).json({
      status: 'success',
      time: result.time,
      settings: result.settings
    });
  }),

  // UPDATE/CREATE SETTINGS
  updateSettings: catchAsync(async (req, res, next) => {
    const result = await service.updateSettings(req.body, req.files, req.time);

    res.status(result.wasCreated ? 201 : 200).json({
      status: 'success',
      time: result.time,
      message: result.wasCreated ? 'Կարգավորումները ստեղծվեցին։' : 'Կարգավորումները թարմացվեցին։',
      settings: result.settings
    });
  })
};
