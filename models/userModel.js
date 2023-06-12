const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName:{
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
    totalPurchased: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)