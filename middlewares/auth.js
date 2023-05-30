const jwt = require("jsonwebtoken")

const userAuth = (req, res,next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.json({status:false})
    }else{
      jwt.verify(token,process.env.JWT_SECERT,(err,decoded)=>{
        if(err){
            console.log(err)
            res.json({status:false,message:"failed to authenticate"})
        }else{
            const userId =decoded.userId
            req.userId = userId
           next()
        }
    })
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  userAuth
}