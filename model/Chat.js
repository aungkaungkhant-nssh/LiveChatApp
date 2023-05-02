const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        required:true,
        default:"sender"
    },
    isGroupChat:{
        type:Boolean,
        required:true,
        default:false
    },
    users:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
})

const Chat = mongoose.model("Chat",chatSchema);



exports.Chat  = Chat;