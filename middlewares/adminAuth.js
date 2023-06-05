const jwt = require('jsonwebtoken');
const adminCollections = require('../models/adminModel')

module.exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ status: false })
    } else {
      jwt.verify(token, process.env.JWT_SECERT, async (err, decoded) => {
        if (err) {
          console.log(err)
          res.status(401).json({ status: false, message: "failed to authenticate" })
        } else {
          const admin = await adminCollections.findOne({ _id: decoded.adminId })
          if (decoded.exp * 1000 > Date.now() && admin) {
              return res.status(200).json({ status: true })
          } else {
              return res.status(401).json({ status: false, message: "Session expired!, Please Signin." })
          }
        }
      })
    }
  } catch (error) {
    next(error)
  }
}