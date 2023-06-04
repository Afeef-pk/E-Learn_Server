const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
    },
    category: {
        type: String,
        //required: true
    },
    duration: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseURL: {
        type: String,
    },
    imageURL: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model("Course", CourseSchema);