const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    password:{
        type:String
    },
    image:{
        type:String
    }
})

module.exports = mongoose.model('user',userSchema)