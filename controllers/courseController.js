const courseModel = require('../models/courseModel')
const categoryModal = require('../models/categoryModel')

const uploadCourse = async (req, res, next) => {
    try {
        const { name, about, duration, language, price, description, category } = req.body.courseData
        const imageURL = req.body.imageURL
        const courseURL = req.body.courseURL
        const coure = courseModel.create({
            name,
            about,
            duration,
            language,
            price,
            description,
            category,
            imageURL,
            courseURL,
            teacher: req.decoded.tutorId,
            category
        })
        res.status(200).json({ status: true })
    } catch (error) {
        next(error)
    }
}
const homePageCourses = async (req, res, next) => {
    try {
        await courseModel.find({ status: true }, { isApproved: 0, status: 0, }).populate({
            path: 'teacher',
            select: '-_id name'
        }).lean().sort({ createdAt: -1 }).limit(4).then((response) => {
            return res.status(200).json({ courseData: response })
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (error) {
        next(error)
    }
}

const courseList = async (req, res, next) => {
    try {
        const courseData = await courseModel.find({ status: true }, { isApproved: 0, status: 0, }).populate({
            path: 'teacher',
            select: '-_id name about'
        }).lean().sort({ createdAt: -1 })
        await categoryModal.find().limit(4).then((response) => {
            res.status(200).json({ courseData, categoryData: response })
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (error) {
        next(error)
    }
}

const courseView = async (req, res, next) => {
    try {
        await courseModel.findOne({ _id: req.params.courseId }, { isApproved: 0, status: 0, createdAt: 0 }).populate({
            path: 'teacher',
            select: '-_id name about'
        }).lean().then((response) => {
            res.status(200).json({ status: true, courseDetails: response });
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    uploadCourse,
    homePageCourses,
    courseList,
    courseView
}