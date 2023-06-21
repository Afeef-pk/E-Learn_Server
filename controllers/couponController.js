const couponSchema = require('../models/couponModel')

module.exports = {
    applyCoupon: async (req, res, next) => {
        try {
            const couponCode = req.body.couponCode
            const coupon = await couponSchema.findOne({ couponCode })
            if (coupon) {
                res.status(200).json({ discount: coupon.discount, message: "Succesfully applied coupon" })
            } else {
                res.status(200).json({ discount: false, message: "Invalid coupon code" })
            }
        } catch (error) {
            next(error)
        }
    },
    getCouponsData: async (req, res, next) => {
        try {
            couponSchema.find().then((response) => {
                res.status(200).json({ coupons: response })
            })
        } catch (error) {
            next(error)
        }
    }
}