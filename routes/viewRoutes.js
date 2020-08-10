const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/course/:slug', authController.isLoggedIn, viewController.getCourse);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

router.get('/my-courses', authController.protect, viewController.getMyCourses);

router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

module.exports = router;