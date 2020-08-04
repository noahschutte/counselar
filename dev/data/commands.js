const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../../models/userModel');

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

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        console.log("users: ", users)
        await User.create(users, {
            validateBeforeSave: false
        })
        console.log('users imported')
    } catch (err) {
        console.log('error:', err)
    }
    console.log('exiting process...')
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log("error: ", err);
    }
    console.log('exiting process...')
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}