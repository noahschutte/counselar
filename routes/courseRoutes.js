const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController');
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use('/:courseId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(courseController.aliasTopCourses, courseController.getAllCourses);

router.route('/course-stats').get(courseController.getCourseStats);

router
    .route('/')
    .get(courseController.getAllCourses)
    .post(
        authController.protect,
        courseController.createCourse
    );

router
    .route('/:id')
    .get(courseController.getCourse)
    .patch(
        authController.protect,
        authController.restrictToOwner,
        courseController.uploadCourseImages,
        courseController.resizeCourseImages,
        courseController.updateCourse
    )
    .delete(
        authController.protect,
        authController.restrictToOwner,
        courseController.deleteCourse
    );

module.exports = router;