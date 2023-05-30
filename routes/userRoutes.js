const express = require('express')
const userRoute= express.Router()
const userController = require('../controllers/userController')
const {userAuth} = require('../middlewares/auth')

userRoute.post('/userAuth',userAuth,userController.userAuth)
userRoute.post('/user/exist',userController.verifyUserAndOtpSend)
userRoute.post('/verify/signup',userController.verifyOtp)
userRoute.post('/signin',userController.handleUserLogin)


module.exports=userRoute