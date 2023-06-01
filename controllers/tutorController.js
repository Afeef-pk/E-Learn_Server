const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const tutorCollection = require('../models/tutorModel')
const jwtSecert = process.env.JWT_SECERT

const handleTutorSignUp = async (req, res, next) => {
    try {
        const { name, phone, email, password, profession, otp } = req.body
        const tutor = await tutorCollection.findOne({ email })
        if (tutor) {
            res.json({ status: false, message: "Already Registred" })
        } else if (req.body.otp) {
            const encryptedPass = await bcrypt.hash(password, 10)
            tutorCollection.create({
                name,
                email,
                phone,
                password: encryptedPass,
                profession
            })
            res.json({ signed: true })
        } else {
            res.json({ status: true })
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
            const passwordMatch = await bcrypt.compare(password, tutor.password)
            if (passwordMatch) {
                let token = jwt.sign({
                    tutorId: tutor._id,
                    tutorName: tutor.name
                }, jwtSecert, {
                    expiresIn: "1d",
                })
                res.json({
                    message: "Signin Successful...",
                    token
                })
            } else {
                res.json({ message: "invalid email or password" })
            }
        } else {
            res.json({ message: "invalid email or password" })
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

module.exports = {
    handleTutorSignUp,
    handleTutorLogin
}