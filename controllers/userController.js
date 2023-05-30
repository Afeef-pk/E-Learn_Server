const userCollection = require('../models/userModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.SERVICE_SID
const client = require('twilio')(accountSid, authToken);
const jwtSecert = process.env.JWT_SECERT


const verifyUserAndOtpSend = async (req, res, next) => {
    try {
        const phone = req.body.phone
        let user = await userCollection.findOne({ phone })
        if (!user) {
            client.verify.v2.services(process.env.SERVICE_SID)
                .verifications
                .create({ to: '+91' + phone, channel: "sms" })
                .then((verification) => {
                    console.log(verification.status)
                    res.json({ otpSend: true })
                })
        } else {
            res.json({ otpSend: false })
        }
    } catch (error) {
        next(error)
    }
}

const verifyOtp = async (req, res, next) => {
    try {
        const { name, email, phone, password, intersted } = req.body.userData
        client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: '+91' + phone, code: req.body.code })
            .then((verification) => {
                if (verification.status === "approved") {
                    console.log(verification.status);
                    (async () => {
                        const encryptedPasword = await bcrypt.hash(password, 10)
                        userCollection
                            .create({
                                name,
                                email,
                                phone,
                                password: encryptedPasword,
                                intersted
                            })
                            .then((data) => {
                                res.json({ verified: true })
                            })
                    })()
                } else {
                    res.json({ verified: false })
                }
            })
    } catch (error) {
        next(error)
    }
}

const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await userCollection.findOne({ email })
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) {
                let token = jwt.sign({
                    userId: user._id,
                    userName: user.name
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
        next(error)
    }
}

const userAuth = async (req, res, next) => {
    try {
        const userId = req.userId
        const user = await userCollection.findById(userId)
        res.json({status:true,user})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleUserLogin,
    verifyUserAndOtpSend,
    verifyOtp,
    userAuth
}