const express = require('express')
const userRoute= express.Router()
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')

userRoute.post('/userAuth',auth.userAuth)
userRoute.post('/user/exist',userController.verifyUserAndOtpSend)
userRoute.post('/verify/signup',userController.verifyOtp)
userRoute.post('/signin',userController.handleUserLogin)


module.exports=userRoute