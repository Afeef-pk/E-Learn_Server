const adminCollection = require('../models/adminModel')
const bcrypt = require("bcrypt")
const jwtSecert = process.env.JWT_SECERT
const jwt = require("jsonwebtoken")
const userCollection = require('../models/userModel')
const tutorCollection = require('../models/tutorModel')
const courseCollection = require('../models/courseModel')
const Category = require('../models/categoryModel')

const handleAdminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const admin = await adminCollection.findOne({ email })
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password)
            if (isMatch) {
                let token = jwt.sign({
                    adminId: admin._id,
                    adminName: admin.name
                }, jwtSecert, {
                    expiresIn: "1d",
                })
                return res.status(200).json({
                    message: "Login Successful",
                    token
                })
            } else {
                return res.status(200).json({
                    message: "Invalid Credentials"
                })
            }
        } else {
            return res.status(200).json({
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        next(error)
    }
}

const dashboard = async (req, res, next) => {
    try {
        const userCount = await userCollection.count()
        const tutorCount = await tutorCollection.count()
        const courseCount = await courseCollection.count()
        res.status(200).json({ userCount, tutorCount, courseCount })
    } catch (error) {
        next(error)
    }
}

const usersList = async (req, res, next) => {
    try {
        const users = await userCollection.find({}, { password: 0 })
        res.status(200).json({ users })
    } catch (error) {
        next(error)
    }
}

const updateUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.query
        const user = await userCollection.findById(userId)
        const status = !user.status
        await userCollection.findByIdAndUpdate({ _id: userId }, { status })
        res.status(200).json({ message: "Status updated!" })
    } catch (error) {
        next(error)
    }
}

const tutorsList = async (req, res, next) => {
    try {
        const approvedTutors = await tutorCollection.find({ isApproved: true }, { password: 0 });
        const unapprovedTutors = await tutorCollection.find({ isApproved: false }, { password: 0 });
        const tutors = unapprovedTutors.concat(approvedTutors);
        res.status(200).json({ tutors });
    } catch (error) {
        next(error)
    }
}

const updateTutorStatus = async (req, res, next) => {
    try {
        const { tutorId } = req.query
        const tutor = await tutorCollection.findById(tutorId)
        const status = !tutor.status
        await tutorCollection.findByIdAndUpdate({ _id: tutorId }, { status })
        res.status(200).json({ message: "Status updated!" })
    } catch (error) {
        next(error)
    }
}

const tutorViewAndApprove = async (req, res, next) => {
    try {
        const { tutorId, status, tutorView } = req.body
        if (tutorId && tutorView) {
            const tutor = await tutorCollection.findById(tutorId)
            return res.status(200).json({ tutor })
        }
        if (!tutorView) {
            await tutorCollection.findByIdAndUpdate({ _id: tutorId }, { isApproved: status, status })
            return res.status(200).json({ message: "Successfully Approved" })
        }
    } catch (error) {
        next(error)
    }
}

const getCourse = async (req, res, next) => {
    try {
        const course = await courseCollection.find()
        res.status(200).json({ course })
    } catch (error) {
        next(error)
    }
}

const courseManage = async (req, res, next) => {
    try {
        const courseId = req.body.courseId
        const course = await courseCollection.findById(courseId)
        const newStatus = !course.status
        await courseCollection.findByIdAndUpdate({ _id: courseId }, { status: newStatus }).then(() => {
            return res.status(200).json({ message: "Status updated" })
        }).catch(()=>{
            return res.status(501).json({ message: "failed to update" })
        })
    } catch (error) {
        next(error)
    }
}

const courseViewAndApprove = async (req, res, next) => {
    try {
        const { courseId, status } = req.body
        if (courseId && !status) {
            const course = await courseCollection.findById(courseId).populate('category')
            return res.status(200).json({ course })
        }
        if (status) {
            await courseCollection.findByIdAndUpdate({ _id: courseId }, { isApproved: status, status })
            res.status(200).json({ status: true })
        }
    } catch (error) {
        next(error)
    }
}

const addCategory = async (req, res, next) => {
    try {
        if (req.body.categoryName) {
            const name = req.body.categoryName
            Category.create({
                name
            })
        }
        const categories = await Category.find()
        res.status(200).json({ message: "Category Added", categories })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    handleAdminLogin,
    dashboard,
    usersList,
    updateUserStatus,
    tutorsList,
    updateTutorStatus,
    tutorViewAndApprove,
    getCourse,
    courseManage,
    courseViewAndApprove,
    addCategory
}