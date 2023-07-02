const io = require("socket.io")();
const User =require('../models/userModel');

const socketapi = {
    io: io
};

io.on('connection',(socket)=>{
    console.log("A user Connected");

    //join goup
    socket.on('joinGroup', groupId => {
        console.log(`Client joined group ${groupId}`);
        socket.join(groupId);
    });

    //send message
    socket.on('sendMessage',async({userId,groupId,text})=>{
        console.log('send Message');
        let sender = await User.findOne({ _id: userId }, { name: 1, image:1});
        io.to(groupId).emit('receiveMessage', { sender, groupId, text });
    })


    //send image
    socket.on("sendFile", async ({groupId,sender,type,file,text}) => {
        console.log("sendImage");
        let user = await User.findOne({ _id: sender }, { name: 1, image:1 });
        io.to(groupId).emit('receiveMessage', { sender:user, text ,type,file,groupId});
    });

    // Clean up when the client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

})

module.exports = socketapi;