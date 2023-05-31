const express = require('express')
const adminRoute= express.Router()
const adminController = require('../controllers/adminController')
const {adminAuth} = require('../middlewares/adminAuth')

adminRoute.post('/',adminController.handleAdminLogin)
adminRoute.get('/auth',adminAuth)
//adminRoute.post('/dashboard',adminController)

module.exports=adminRoute