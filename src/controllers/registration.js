const catchAsync = require('../utils/catchAsync');
const service = require('../services/registration');

module.exports = {
  createRegistration: catchAsync(async (req, res, next) => {
    const register = await service.createRegistration(req.body);

    res.status(201).json({
      status: 'success',
      register,
      time: `${Date.now() - req.time} ms`
    });
  }),

  getRegistration: catchAsync(async (req, res, next) => {
    const registrations = await service.getRegistration();

    res.status(200).json({
      status: 'success',
      time: `${Date.now() - req.time} ms`,
      registrations
    });
  }),

  updateRegistration: catchAsync(async (req, res, next) => {
    const registration = await service.updateRegistration(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      time: `${Date.now() - req.time} ms`,
      registration
    });
  }),

  deleteRegistration: catchAsync(async (req, res, next) => {
    await service.deleteRegistration(req.params.id);

    res.status(200).json({
      message: 'Գրանցումը հաջողությամբ ջնջվեց։'
    });
  })
};
