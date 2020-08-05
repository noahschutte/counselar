// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the course
    const course = await Course.findById(req.params.courseId);
    // console.log(course);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/my-courses/?course=${
        //   req.params.courseId
        // }&user=${req.user.id}&price=${course.price}`,
        success_url: `${req.protocol}://${req.get('host')}/my-courses?alert=transaction`,
        cancel_url: `${req.protocol}://${req.get('host')}/course/${course.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.courseId,
        line_items: [{
            name: `${course.name} Course`,
            description: course.summary,
            images: [
                `${req.protocol}://${req.get('host')}/img/courses/${course.imageCover}`
            ],
            amount: course.price * 100,
            currency: 'usd',
            quantity: 1
        }]
    });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

const createTransactionCheckout = async session => {
    const course = session.client_reference_id;
    const user = (await User.findOne({
        email: session.customer_email
    })).id;
    const price = session.display_items[0].amount / 100;
    await Transaction.create({
        course,
        user,
        price
    });
};

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed')
        createTransactionCheckout(event.data.object);

    res.status(200).json({
        received: true
    });
};

exports.createTransaction = factory.createOne(Transaction);
exports.getTransaction = factory.getOne(Transaction);
exports.getAllTransactions = factory.getAll(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);