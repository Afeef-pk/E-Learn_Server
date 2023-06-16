const express = require('express')
const userRoute= express.Router()
const {updateUserProfile,getUserProfile,userAuthentication,verifyUserAndOtpSend,verifyOtp,handleUserLogin} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth')
const {homePageCourses,courseList,courseDetails,watchCourse} = require('../controllers/courseController')
const {applyCoupon,createPayment,verifyPayment,cancelOrder} = require('../controllers/paymentController')

userRoute.get('/userAuth',userAuth,userAuthentication)

//signup user
userRoute.post('/user/exist',verifyUserAndOtpSend)
userRoute.post('/verify/signup',verifyOtp)

//signin user
userRoute.post('/signin',handleUserLogin)
userRoute.get('/home-course',homePageCourses)
userRoute.get('/course',courseList) 

//user profile
userRoute.get('/profile',userAuth,getUserProfile)
userRoute.post('/update/profile',userAuth,updateUserProfile)

//course details
userRoute.get('/course-details/:courseId',courseDetails)
userRoute.get('/course/view/:courseId',watchCourse)

//payment 
userRoute.post('/apply-coupon',applyCoupon)
userRoute.post('/create-checkout-session',userAuth,createPayment)
userRoute.get('/verifyPayment/:orderId', verifyPayment);
userRoute.get('/cancel-payment/:orderId', cancelOrder);

module.exports=userRoute