const express = require('express')
const userRoute= express.Router()
const {homePageCourses,userAuthentication,verifyUserAndOtpSend,verifyOtp,handleUserLogin} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth')


userRoute.get('/userAuth',userAuth,userAuthentication)
userRoute.post('/user/exist',verifyUserAndOtpSend)
userRoute.post('/verify/signup',verifyOtp)
userRoute.post('/signin',handleUserLogin)
userRoute.get('/home',homePageCourses)
module.exports=userRoute