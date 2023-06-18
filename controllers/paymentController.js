const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const orderSchema = require('../models/orderModel')
const userCollection = require('../models/userModel')
const courseCollection = require('../models/courseModel')
const couponSchema = require('../models/couponModel')

const applyCoupon = async (req, res, next) => {
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

}

const createPayment = async (req, res, next) => {
    try {
        const userId = req.decoded.userId
        const { courseId, address, pincode, couponCode } = req.body
        const user = await userCollection.findById(userId);
        const course = await courseCollection.findById(courseId);
        let total = course.price
        const coupon = await couponSchema.findOne({ couponCode })
        if (coupon) {
            total = Math.ceil(total-(total/coupon.discount))
        }
        if (course) {
            const newOrder = new orderSchema({
                total,
                course: courseId,
                user: userId,
                teacher: course.teacher,
                address: { line1: address, pincode },
                purchaseDate: Date.now(),
            })
            newOrder.save().then(async (order) => {
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: {
                                    name: course.name,
                                    images: [course.imageURL],
                                    description: course.about
                                },
                                unit_amount: total * 100,
                            },
                            quantity: 1,
                        }
                    ],
                    mode: 'payment',
                    customer_email: user.email,
                    success_url: `${process.env.SERVER_URL}/verifyPayment/${order._id}`,
                    cancel_url: `${process.env.SERVER_URL}/cancel-payment/${order._id}`,
                })
                return res.status(200).json({ url: session.url })
            })
        } else {
            res.redirect(`${process.env.CLIENT_URL}/course-payment/${courseId}`);
        }
    } catch (error) {
        next(error);
    }
}

const verifyPayment = async (req, res, next) => {
    try {
        const orderId = req.params.orderId
        const order = await orderSchema.findById(orderId);
        if (order) {
            orderSchema.findByIdAndUpdate(orderId, {
                $set: {
                    status: true
                }
            }).then((response) => {
                res.redirect(`${process.env.CLIENT_URL}/order-success`);
            }).catch((err) => {
                console.log(err);
            })
        } else {
            res.redirect(`${process.env.CLIENT_URL}/cancel-payment/${order.courseId}`);
        }
    } catch (err) {
        next(err);
    }
}

const cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId
        const order = await orderSchema.findById(orderId)
        orderSchema.findByIdAndDelete(orderId).then((response) => {
            res.redirect(`${process.env.CLIENT_URL}/course-details/${order.course}`);
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { applyCoupon, createPayment, verifyPayment, cancelOrder }