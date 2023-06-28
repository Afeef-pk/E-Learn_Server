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

module.exports.sendImage = async (req, res,next) => {
    try {
        const image = req.body.image
        if (image) {
            const newMessage = new Message({
                group: req.body.group,
                sender: req.decoded.userId,
                type: "file",
                text: req.body.text,
                image
            })
            const savedMessage = await newMessage.save();
            res.status(200).json({ group: savedMessage.group, sender: { _id: savedMessage.sender },text:savedMessage.text, type: savedMessage.type, image: savedMessage.image });
        } else {
            throw new Error("Image is not provided")
        }

    } catch (err) {
        next(err)
    }
}
