const express = require('express')
const tutorRoute= express.Router()
const {handleTutorSignUp,handleTutorLogin,tutorAuthVerify,getTutorCourses} = require('../controllers/tutorController')
const {uploadCourse,deleteCourse} = require('../controllers/courseController')
const {tutorAuth} = require('../middlewares/tutorAuth')

tutorRoute.post('/signup',handleTutorSignUp)
tutorRoute.post('/signin',handleTutorLogin)
tutorRoute.get('/tutorauth',tutorAuth,tutorAuthVerify)
tutorRoute.post('/upload/course',tutorAuth,uploadCourse)
tutorRoute.get('/all-course/',tutorAuth,getTutorCourses)
tutorRoute.delete('/delete/:courseId',deleteCourse)

module.exports=tutorRoute