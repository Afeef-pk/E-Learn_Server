const jwt = require("jsonwebtoken")

module.exports.userAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ status: false })
    } else {
      jwt.verify(token, process.env.JWT_SECERT, (err, decoded) => {
        if (err) {
          res.status(401).json({ status: false, message: "Session expired please login" })
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
