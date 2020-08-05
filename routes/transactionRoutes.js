const express = require('express');
const transactionController = require('./../controllers/transactionController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:courseId', transactionController.getCheckoutSession);

router.use(authController.restrictToOwner)

router
    .route('/')
    .get(transactionController.getAllTransactions)
    .post(transactionController.createTransaction);

router
    .route('/:id')
    .get(transactionController.getTransaction)
    .patch(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction);

module.exports = router;