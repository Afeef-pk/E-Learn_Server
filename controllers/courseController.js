const courseModel = require('../models/courseModel')

const uploadCourse = async (req, res, next) => {
    try {
        const { name, about, duration, language, price, description, category, imageURL } = req.body
        const coure = courseModel.create({
            name,
            about,
            duration,
            language,
            price,
            description,
            category,
            imageURL
        })
    } catch (error) {
        next(error)
    }
}

module.exports= {
    uploadCourse
}