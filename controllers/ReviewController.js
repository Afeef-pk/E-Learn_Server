const courseModel = require('../models/courseModel')
const reviewModel = require('../models/reviewModel')
module.exports = {
    reviewCourse: async (req, res, next) => {
        try {
            console.log(req.body);
            const { courseId, rating, review } = req.body;
            const userId = req.userId;
            const reviewed = await reviewModel.create({
                reviewedBy: userId,
                course: courseId,
                rating,
                review
            })
            courseModel.findByIdAndUpdate({ _id:courseId }, { $addToSet: { reviews: reviewed._id } }).then(() => res.status(201).json({ message: "Thank for your Review" }))
        } catch (error) {
            next(error);
        }
    }
}