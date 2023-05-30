const express = require('express')
const adminRoute= express.Router()
const adminController = require('../controllers/adminController')


adminRoute.post('/',adminController.handleAdminLogin)
//adminRoute.post('/dashboard',adminController)

module.exports=adminRoute