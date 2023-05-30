const jwt = require("jsonwebtoken")

const userAuth = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.json({status:false})
    }else{
      console.log(token);
      jwt.verify(token,process.env.JWT_SECERT,(err,decoded)=>{
        if(err){
            console.log('hhh'+err)
            res.json({status:false,message:"failed to authenticate"})
        }else{
            const userId =decoded.userId
            console.log(userId);
            res.json({status:true})
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