const jwt = require("jsonwebtoken")

module.exports.userAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.json({ status: false })
    } else {
      jwt.verify(token, process.env.JWT_SECERT, (err, decoded) => {
        if (err) {
          console.log(err)
          res.json({ status: false, message: "failed to authenticate" })
        } else {
          req.decoded = decoded
          next()
        }
      })
    }
  } catch (error) {
    next(error);
  }
}
