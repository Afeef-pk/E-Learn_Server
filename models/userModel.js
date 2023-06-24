const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    totalEnrolled: {
        type: Number,
        default: 0
    },
    loginWithGoogle: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true
    },
    enrolledCourses: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            },
            completed: {
                type: Number,
                default: 0
            }
        }
    ]
},
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)