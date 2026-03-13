const router = require('express').Router();

const ctrls = require('../controllers');

router.post(
  '/',
  ctrls.auth.protect,
  ctrls.auth.restrictTo('admin'),
  ctrls.courses.addCourse
);

router.get('/', ctrls.courses.getCourses);
router.get('/:id', ctrls.courses.getCourse);

router.patch(
  '/:id',
  ctrls.auth.protect,
  ctrls.auth.restrictTo('admin'),
  ctrls.courses.updateCourse
);

router.delete(
  '/:id',
  ctrls.auth.protect,
  ctrls.auth.restrictTo('admin'),
  ctrls.courses.deleteCourse
);

module.exports = router;
