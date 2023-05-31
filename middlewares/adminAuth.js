const jwt = require('jsonwebtoken');
const adminCollections = require('../models/adminModel')

module.exports.adminAuth = async(req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
          res.json({status:false})
        }else{
          jwt.verify(token,process.env.JWT_SECERT,async(err,decoded)=>{
            if(err){
                console.log(err)
                res.json({status:false,message:"failed to authenticate"})
            }else{
                const adminId =decoded.userId
                const admin = await adminCollections.findOne({adminId})
                res.json({status:true,admin})
            }
        })
        }
      } catch (error) {
        console.log('cath');
        console.log(error.message);
      }
}