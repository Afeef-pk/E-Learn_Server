const adminCollection = require('../models/adminModel')
const bcrypt = require("bcrypt")
const jwtSecert = process.env.JWT_SECERT
const jwt = require("jsonwebtoken")

const handleAdminLogin = async (req, res,next) => {
    try {
        const { email, password } = req.body
        const admin = await adminCollection.findOne({ email })
        if(admin) {
            const isMatch = await bcrypt.compare(password, admin.password)
            if(isMatch) {
                let token = jwt.sign({
                    adminId: admin._id,
                    adminName: admin.name
                }, jwtSecert, {
                    expiresIn: "1d",
                })
                res.status(200).json({
                    message: "Login Successful",
                    token
                })
            } else {
                res.status(200).json({
                    message: "Invalid Credentials"
                })
            }
        }else{
            res.status(200).json({
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        next(error)
    }
}


module.exports = {
    handleAdminLogin
}