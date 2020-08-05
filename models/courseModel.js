const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A course must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A course name must have less or equal then 40 characters'],
        minlength: [10, 'A course name must have more or equal then 10 characters']
    },
    slug: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Course must belong to a user']
    },
    difficulty: {
        type: String,
        required: [true, 'A course must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: null,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A course must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A course must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A course must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

courseSchema.index({
    price: 1,
    ratingsAverage: -1
});
courseSchema.index({
    slug: 1
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});

// QUERY MIDDLEWARE
// courseSchema.pre('find', function(next) {
courseSchema.pre(/^find/, function (next) {
    this.find({
        secretCourse: {
            $ne: true
        }
    });

    this.start = Date.now();
    next();
});

courseSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

// courseSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// courseSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretCourse: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;