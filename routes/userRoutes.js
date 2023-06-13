const express = require('express')
const userRoute= express.Router()
const {updateUserProfile,getUserProfile,userAuthentication,verifyUserAndOtpSend,verifyOtp,handleUserLogin} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth')
const {homePageCourses,courseList,courseDetails,watchCourse} = require('../controllers/courseController')

userRoute.get('/userAuth',userAuth,userAuthentication)
userRoute.post('/user/exist',verifyUserAndOtpSend)
userRoute.post('/verify/signup',verifyOtp)
userRoute.post('/signin',handleUserLogin)
userRoute.get('/home-course',homePageCourses)
userRoute.get('/course',courseList)
userRoute.get('/profile',userAuth,getUserProfile)
userRoute.post('/update/profile',userAuth,updateUserProfile)
userRoute.get('/course-details/:courseId',courseDetails)
userRoute.get('/course/view/:courseId',watchCourse)




module.exports=userRoute