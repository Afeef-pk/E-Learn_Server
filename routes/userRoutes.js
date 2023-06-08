const express = require('express')
const userRoute= express.Router()
const {userAuthentication,verifyUserAndOtpSend,verifyOtp,handleUserLogin} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth')
const {homePageCourses,courseList,courseView} = require('../controllers/courseController')

userRoute.get('/userAuth',userAuth,userAuthentication)
userRoute.post('/user/exist',verifyUserAndOtpSend)
userRoute.post('/verify/signup',verifyOtp)
userRoute.post('/signin',handleUserLogin)
userRoute.get('/home-course',homePageCourses)
userRoute.get('/course',courseList)
userRoute.get('/course-details/:courseId',courseView)



module.exports=userRoute