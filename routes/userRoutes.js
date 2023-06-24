const express = require('express')
const userRoute= express.Router()
const {updateUserProfile,getUserProfile,userAuthentication,verifyUserAndOtpSend,verifyOtp,handleUserLogin} = require('../controllers/userController')
const {userAuth} = require('../middlewares/userAuth')
const {checkUserEnrolledCourse} = require('../middlewares/checkCourseEnrolled')
const {updateProgress,getUserCourses,homePageCourses,courseList,courseDetails,isCourseEnrolled,watchCourse} = require('../controllers/courseController')
const {createPayment,verifyPayment,cancelOrder, userPuchaseHistory} = require('../controllers/paymentController')
const {applyCoupon} = require('../controllers/couponController')

//user Authentication
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
userRoute.put('/update/profile',userAuth,updateUserProfile)
userRoute.get('/enrolled-course',userAuth,getUserCourses)
userRoute.get('/purchase-history',userAuth,userPuchaseHistory)


//course details
userRoute.get('/course-details/:courseId',courseDetails)
userRoute.get('/is-course-enrolled/:courseId', userAuth, isCourseEnrolled);
userRoute.get('/course/view/:courseId',userAuth,checkUserEnrolledCourse,watchCourse)

//payment 
userRoute.post('/apply-coupon',applyCoupon)
userRoute.post('/create-checkout-session',userAuth,createPayment)
userRoute.get('/verifyPayment/:orderId', verifyPayment);
userRoute.get('/cancel-payment/:orderId', cancelOrder);


//video progress
userRoute.get('/update-progress',userAuth,updateProgress)
module.exports=userRoute