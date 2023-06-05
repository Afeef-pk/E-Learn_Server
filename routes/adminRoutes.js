const express = require('express')
const adminRoute = express.Router()
const { handleAdminLogin, dashboard, usersList, updateUserStatus, tutorsList, updateTutorStatus, tutorViewAndApprove, getCourse, courseViewAndApprove,courseManage } = require('../controllers/adminController')
const { adminAuth } = require('../middlewares/adminAuth')

adminRoute.post('/', handleAdminLogin)
adminRoute.get('/auth', adminAuth)
adminRoute.get('/dashboard', dashboard)
adminRoute.get('/users', usersList)
adminRoute.patch('/user/status', updateUserStatus)
adminRoute.get('/tutors', tutorsList)
adminRoute.patch('/tutor/status', updateTutorStatus)
adminRoute.post('/tutor/view', tutorViewAndApprove)
adminRoute.get('/courses', getCourse)
adminRoute.post('/course/view', courseViewAndApprove)
adminRoute.post('/course/manage', courseManage)


module.exports = adminRoute