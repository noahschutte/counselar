const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../../models/userModel');
const Course = require('./../../models/courseModel');
const Review = require('./../../models/reviewModel');

dotenv.config({
    path: './config.env'
});

let DB
if (process.env.NODE_ENV === 'production') {
    DB = process.env.DATABASE
} else {
    DB = process.env.DATABASE_LOCAL
}
DB.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/courses.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await User.create(users, {
            validateBeforeSave: false
        })
        console.log('users imported')
        await Course.create(courses, {
            validateBeforeSave: false
        })
        console.log('courses imported')
        await Review.create(reviews, {
            validateBeforeSave: false
        })
        console.log('reviews imported')
    } catch (err) {
        console.log('error:', err)
    }
    console.log('exiting process...')
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async Model => {
    if (Model) {
        try {
            await Model.deleteMany();
            console.log(`Collection successfully deleted`);
        } catch (err) {
            console.log("error: ", err);
        }
        console.log('exiting process...')
        process.exit();
    }
    try {
        await User.deleteMany();
        await Course.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log("error: ", err);
    }
    console.log('exiting process...')
    process.exit();
};

const modelArg = process.argv[3]
let model
if (modelArg === 'User') {
    model = User
} else if (modelArg === 'Course') {
    model = Course
}

if (process.argv[2] === '--import') {
    importData(model);
} else if (process.argv[2] === '--delete') {
    deleteData(model);
}