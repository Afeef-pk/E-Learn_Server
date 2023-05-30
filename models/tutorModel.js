const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tutorSchema = Schema({
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
    profession:{
        type:String
    },
    image:{
        type:String
    }
})

module.exports = mongoose.model('tutor',tutorSchema)