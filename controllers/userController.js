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
                    return res.status(200).json({ otpSend: true })
                })
        } else {
            return res.status(200).json({ otpSend: false })
        }
    } catch (error) {
        next(error)
    }
}

const verifyOtp = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password, intersted } = req.body.userData
        client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: '+91' + phone, code: req.body.code })
            .then((verification) => {
                if (verification.status === "approved") {
                    (async () => {
                        const encryptedPasword = await bcrypt.hash(password, 10)
                        userCollection
                            .create({
                                firstName,
                                lastName,
                                email,
                                phone,
                                password: encryptedPasword
                            })
                            .then((data) => {
                                return res.status(200).json({ verified: true })
                            })
                    })()
                } else {
                    return res.status(200).json({ verified: false })
                }
            })
    } catch (error) {
        next(error)
    }
}

const handleUserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        let user = await userCollection.findOne({ email })
        if (user) {
            if (!user.status) return res.json({ message: "You have no permission" })
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) {
                let token = jwt.sign({
                    userId: user._id,
                    userName: user.name
                }, jwtSecert, {
                    expiresIn: "1d",
                })
                return res.status(200).json({
                    message: "Signin Successful...",
                    token
                })
            } else {
                res.status(200).json({ message: "invalid email or password" })
            }
        } else {
            res.status(200).json({ message: "invalid email or password" })
        }
    } catch (error) {
        next(error)
    }
}

const userAuth = async (req, res, next) => {
    try {
        const decoded = req.decoded
        const user = await userCollection.findOne({ _id: decoded.userId, status: true })
        if (decoded.exp * 1000 > Date.now() && user) {
            return res.status(200).json({ status: true })
        } else {
            return res.status(200).json({ status: false, message: "Session expired!, Please Signin." })
        }
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