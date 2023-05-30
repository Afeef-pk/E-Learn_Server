const tutorCollection = require('../models/tutorModel')
const bcrypt = require('bcrypt')
const jwtSecert = process.env.JWT_SECERT
const jwt = require("jsonwebtoken")

const handleTutorSignUp = async (req, res) => {
    try {
        const { name, phone, email, password, profession,otp } = req.body
        const tutor = await tutorCollection.findOne({ email })
        if(tutor){
            res.json({message:"Already Registred"})
        }else if(!otp){
            res.json({sendOtp:true})
        }
        if(otp){
            const encryptedPass = await bcrypt.hash(password, 10)
            tutorCollection.create({
                name,
                email,
                phone,
                password: encryptedPass,
                profession
            })
            res.json({ signed: true })
        } 
    } catch (error) {
        console.log(error.message);
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