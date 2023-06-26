const Message = require('../models/messageModel');

module.exports.createMessage = async (req, res) => {
    try {
        const { text, group } = req.body;
        const newMessage = new Message({
            group,
            sender: req.userId,
            type: "text",
            text
        })
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);

    } catch (err) {
        res.status(404).json({ status: false, message: err.message });
    }
}
