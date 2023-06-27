const Message = require('../models/messageModel');

module.exports.createMessage = async (req, res,next) => {
    try {
        const { userId } = req.decoded
        const { text, group } = req.body;
        const newMessage = new Message({
            group,
            sender: userId,
            type: "text",
            text
        })
        const savedMessage = await newMessage.save();
        res.status(200).json({});
    } catch (err) {
       next(err)
    }
}

module.exports.getMessages = async (req, res,next) => {
    try {
        const groupId = req.params.groupId
        if(groupId !== "undefined") {
           await Message.find({ group: req.params.groupId }).populate('sender').then((messages)=>{
                res.status(200).json({messages});
            })
        }else{
            console.log('no group id');
        }
    } catch (err) {
        next(err)
    }
}
