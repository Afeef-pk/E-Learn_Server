const express = require('express')
const tutorRoute= express.Router()
const tutorController = require('../controllers/tutorController')

tutorRoute.post('/signup',tutorController.handleTutorSignUp)
tutorRoute.post('/signin',tutorController.handleTutorLogin)

module.exports=tutorRoute