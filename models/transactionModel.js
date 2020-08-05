const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'Transaction must belong to a Course!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Transaction must belong to a User!']
    },
    price: {
        type: Number,
        require: [true, 'Transaction must have a price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

transactionSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'course',
        select: 'name'
    });
    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;