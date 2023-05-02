const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const compression = require("compression");

const cors = require("cors");
require('dotenv').config();

app.use(cors());


const userRoute = require('./routes/userRoute');
const chatRoute = require("./routes/chatRoute");
const messageRoute = require('./routes/messageRoute');
const { Server } = require("socket.io");

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user',userRoute);
app.use('/api/chat',chatRoute);
app.use('/api/message',messageRoute);

const port = process.env.PORT || 8000
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cme43aq.mongodb.net/${process.env.DB_DEFAULT_DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
   let server =  app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
    const io = new Server(server,{cors:{origin:"*"}});
    io.on("connection",(socket)=>{
        socket.on("setup",(user)=>{
           socket.join(user._id);
        })
        socket.on("joinchat",(chatId)=>{
            socket.join(chatId)
        })
        socket.on("sendMessage",(data)=>{
            const chat   = data.messages.chat;
            chat.users.map((user)=>(
                socket.in(user._id).emit("messageRecieved",data)
            ))
           
        })
        socket.on("startTyping",(data)=>{
           const users = data.users;
           users.map((user)=>(
            socket.in(user._id).emit("startTyping",data)
           ))
        })
        socket.on("stopTyping",(data)=>{
            const users = data.users;
            users.map((user)=>{
              socket.in(user._id).emit("stopTyping",data);  
            })
        })
    })
})
.catch((err)=>{
    console.log(err)
})
