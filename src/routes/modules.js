const router = require('express').Router();
const ctrls = require('../controllers');

router.post(
    '/',
    ctrls.auth.protect,
    ctrls.auth.restrictTo('admin'),
    ctrls.modules.addModule
);

router.get(
    '/',
    ctrls.modules.getModules
);

router.get('/:id', ctrls.modules.getModule);

router.patch(
    '/:id',
    ctrls.auth.protect,
    ctrls.auth.restrictTo('admin'),
    ctrls.modules.updateModule
);

router.delete(
    '/:id',
    ctrls.auth.protect,
    ctrls.auth.restrictTo('admin'),
    ctrls.modules.deleteModule
);

router.post(
    '/:id/video',
    ctrls.auth.protect,
    ctrls.auth.restrictTo('admin'),
    ctrls.modules.uploadVideo
);

router.patch(
    '/:id/video',
    ctrls.auth.protect,
    ctrls.auth.restrictTo('admin'),
    ctrls.modules.uploadVideo
);

router.put(
    '/:id/reorder-videos',
    ctrls.auth.protect,
    ctrls.auth.restrictTo('admin'),
    ctrls.modules.reorderVideos
);

module.exports = router;
