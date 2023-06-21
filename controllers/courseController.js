const courseModel = require('../models/courseModel')
const categoryModal = require('../models/categoryModel')
const tutorCollection = require('../models/tutorModel')
const orderCollection = require('../models/orderModel')

const uploadCourse = async (req, res, next) => {
    try {
        const tutorId = req.decoded.tutorId
        const { name, about, duration, language, price, description, category, course } = req.body.courseData
        const imageURL = req.body.imageURL
        const coure = courseModel.create({
            name,
            about,
            duration,
            language,
            price,
            description,
            category,
            imageURL,
            teacher: tutorId,
            category,
            course
        }).then(async () => {
            await tutorCollection.findByIdAndUpdate(tutorId, { $inc: { totalCourses: 1 } });
            res.status(200).json({ status: true })
        })
            .catch(err => res.status(500).json({ message: "failed to upload course" }))
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
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 3
        const skip = (page - 1) * size
        const searchQuery = req.query.searchQuery
        const category = req.query.category
        const query = {
            status: true,
        };
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
            ];
        }
        if (category) {
            query.category = category
        }
        const categoryData = await categoryModal.find().limit(4)
        const total = await courseModel.countDocuments(query)
        await courseModel.find(query, { isApproved: 0, status: 0, }).populate({
            path: 'teacher',
            select: '-_id name about'
        }).lean().sort({ createdAt: -1 }).skip(skip).limit(size).then((response) => {
            res.status(200).json({ courseData: response, categoryData, total, page, size })
        }).catch((err) => {
            res.status(500).json({ status: false, message: "something went wrong " });
        })
    } catch (error) {
        next(error)
    }
}

const courseDetails = async (req, res, next) => {
    try {
        await courseModel.findOne({ _id: req.params.courseId }, { isApproved: 0, status: 0, createdAt: 0, 'course.lessons.videoUrl': 0, 'course.lessons._id': 0 }).populate({
            path: 'teacher',
            select: '-_id name about'
        }).lean().then((response) => {
            res.status(200).json({ courseDetails: response });
        }).catch((err) => {
            res.status(500).json({ message: "something went wrong " });
        })
    } catch (error) {
        next(error)
    }
}

const isCourseEnrolled = (req,res,next) => {
    try {
        const userId = req.decoded.userId
        orderCollection.findOne({ user:userId, course: req.params.courseId,status:true }).then((response) => {
            if (response) {
                res.status(200).json({ enrolled: true, message: "Course already  exist" });
            } else {
                res.status(200).json({ enrolled: false, message: "Course not  exist" });
            }
        }).catch(()=>{
            res.status(200).json({ enrolled: false, message: "Course not  exist" });
        })
    } catch (error) {
        next(error)
    }
}

const watchCourse = async (req, res, next) => {
    try {
        const courseId = req.params.courseId
        await courseModel.findOne({ _id: courseId }, { isApproved: 0, status: 0, createdAt: 0, 'course.lessons._id': 0 }).populate({
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

const deleteCourse = (req, res, next) => {
    try {
        const courseId = req.params.courseId
        courseModel.deleteOne({ _id: courseId }).then(() => {
            res.status(200).json({ sucess: true, message: "course deleted" })
        }).catch(() => {
            res.status(501).json({ sucess: false, message: "failed to delete" })
        })
    } catch (error) {
        next(error)
    }
}

const getUserCourses = async (req, res, next) => {
    try {
        const userId = req.decoded.userId
        orderCollection.find({ user: userId, status: true }, { course: 1, _id: 0 })
            .populate({ path: 'teacher', select: '-_id name' })
            .populate({ path: 'course', select: '_id name imageURL' })
            .lean()
            .then((response) => {
                res.status(200).json({ userCourses: response })
            })
            .catch((error) => {
                res.status(501).json({ message: "server error" })
            })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadCourse,
    homePageCourses,
    courseList,
    courseDetails,
    watchCourse,
    deleteCourse,
    getUserCourses,
    isCourseEnrolled
}