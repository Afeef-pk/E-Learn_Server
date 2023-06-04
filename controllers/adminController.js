const adminCollection = require('../models/adminModel')
const bcrypt = require("bcrypt")
const jwtSecert = process.env.JWT_SECERT
const jwt = require("jsonwebtoken")
const userCollection = require('../models/userModel')
const tutorCollection = require('../models/tutorModel')

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
                res.status(200).json({
                    message: "Login Successful",
                    token
                })
            } else {
                res.status(200).json({
                    message: "Invalid Credentials"
                })
            }
        } else {
            res.status(200).json({
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
        res.status(200).json({ userCount, tutorCount })
    } catch (error) {
        next(error)
    }
}

const usersList = async (req, res, next) => {
    try {
        const users = await userCollection.find()
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
        const approvedTutors = await tutorCollection.find({ isApproved: true });
        const unapprovedTutors = await tutorCollection.find({ isApproved: false });
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

const getTutorDetails = async (req, res, next) => {
    try {
        console.log(req.query);
        const tutorId = req.query.tutorId
        if (req.query.tutorId && req.query.status===false) {
            console.log('list');
            var tutor = await tutorCollection.findById(tutorId)
            return res.status(200).json({ tutor })
        }
        if(req.query.status){
            console.log('here already');
            const status = !tutor.isApproved
            var tutors = await tutorCollection.findByIdAndUpdate({ tutorId },{isApproved:status})
            return res.status(200).json({ message:"Successfully Approved" })
        }
        
        

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
    getTutorDetails,
}