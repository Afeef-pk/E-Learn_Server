const express = require('express')
const adminRoute = express.Router()
const { addCategory, handleAdminLogin, dashboard, usersList, updateUserStatus, tutorsList, updateTutorStatus, tutorViewAndApprove, getCourse, courseViewAndApprove, courseManage, getTransctions, adminAuthentication } = require('../controllers/adminController')
const { adminAuth } = require('../middlewares/adminAuth')
const { getCouponsData, createCoupon, deleteCourse } = require('../controllers/couponController')

adminRoute.post('/', handleAdminLogin)
adminRoute.use(adminAuth)
adminRoute.get('/auth', adminAuthentication)
adminRoute.get('/dashboard', dashboard)
adminRoute.get('/users', usersList)
adminRoute.patch('/user/status', updateUserStatus)
adminRoute.get('/tutors', tutorsList)
adminRoute.patch('/tutor/status', updateTutorStatus)
adminRoute.post('/tutor/view', tutorViewAndApprove)
adminRoute.get('/courses', getCourse)
adminRoute.post('/course/view', courseViewAndApprove)
adminRoute.post('/course/manage', courseManage)
adminRoute.post('/category', addCategory)
adminRoute.get('/coupons', getCouponsData)
adminRoute.get('/transctions', getTransctions)
adminRoute.post('/coupons', createCoupon)
adminRoute.delete('/coupon/delete/:couponId', deleteCourse)

module.exports = adminRoute