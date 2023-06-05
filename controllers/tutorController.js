const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const tutorCollection = require('../models/tutorModel')
const jwtSecert = process.env.JWT_SECERT

const handleTutorSignUp = async (req, res, next) => {
    try {
        const { name, phone, email, password,about, otp } = req.body.tutorData
        const tutor = await tutorCollection.findOne({ email })
        if (tutor) {
           return res.status(200).json({ status: false, message: "Already Registred" })
        } else if (otp) {
            const encryptedPass = await bcrypt.hash(password, 10)
            tutorCollection.create({
                name,
                email,
                phone,
                password: encryptedPass,
                about,
                certificate:req.body.imageUrl
            })
            return res.status(200).json({ signed: true })
        } else {
            return res.status(200).json({ status: true })
        }
    } catch (error) {
        next(error)
    }
}

const handleTutorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        let tutor = await tutorCollection.findOne({ email })
        if (tutor) {
            if(!tutor.status) return res.status(200).json({ message: "You have no permission" })
            const passwordMatch = await bcrypt.compare(password, tutor.password)
            if (passwordMatch) {
                let token = jwt.sign({
                    tutorId: tutor._id,
                    tutorName: tutor.name
                }, jwtSecert, {
                    expiresIn: "1d",
                })
               return res.status(200).json({
                    message: "Signin Successful...",
                    token
                })
            } else {
                return res.status(200).json({ message: "invalid email or password" })
            }
        } else {
            return res.status(200).json({ message: "invalid email or password" })
        }
    } catch (error) {
        next(error)
    }
}

const tutorAuth = async (req, res, next) => {
    try {
        const decoded = req.decoded
        const tutor = await tutorCollection.findOne({ _id: decoded.userId, status: true })
        if(decoded.exp * 1000 > Date.now()&&tutor){
           return res.status(200).json({ status: true})
        }else{
            return res.status(401).json({ status: false,message:"Session expired!, Please Signin."})
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleTutorSignUp,
    handleTutorLogin,
    tutorAuth
}