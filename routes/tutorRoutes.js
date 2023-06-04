const express = require('express')
const tutorRoute= express.Router()
const tutorController = require('../controllers/tutorController')
const courseController = require('../controllers/courseController')
const {tutorAuth} = require('../middlewares/tutorAuth')
tutorRoute.post('/signup',tutorController.handleTutorSignUp)
tutorRoute.post('/signin',tutorController.handleTutorLogin)
tutorRoute.get('/tutorauth',tutorAuth,tutorController.tutorAuth)
tutorRoute.post('/uploadCourse',courseController.uploadCourse)


module.exports=tutorRoute