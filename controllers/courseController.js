const courseModel = require('../models/courseModel')

const uploadCourse = async (req, res, next) => {
    try {
        const { name, about, duration, language, price, description, category} = req.body.courseData
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
            courseURL
        })
        res.status(200).json({status: true})
    } catch (error) {
        next(error)
    }
}

module.exports= {
    uploadCourse
}