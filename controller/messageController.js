const { Message } = require("../model/Message");
const {Chat}= require("../model/Chat");

// @desc    fetchChat
// @route   GET /api/message
// @access  protected
exports.fetchMessage = async(req,res,next)=>{
    try{
        let messages= await Message.find({chat:req.params.id})
                    .populate("sender","name pic email")
                    .populate({path:"chat",populate:{path:"users",select:"name pic email"}});
                    
        res.status(200).json({message:"Fetch Message Success",data:messages});
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

// @desc    fetchChat
// @route   POST /api/message
// @access  protected
exports.sendMessage = async(req,res,next)=>{
    const {content,chatId} = req.body;
    if(!content || !chatId) return res.status(400).json({message:"Please fill the field"});
    try{
        let messages = await Message.create({sender:req.user._id,content,chat:chatId});
         messages =await  messages.populate("sender","name pic email");
         messages =await messages.populate({path:"chat",populate:{path:"users",select:"name pic email"}})
         let chat= await Chat.findByIdAndUpdate(chatId,{latestMessage:messages._id});
        chat = await Chat.findById(chat._id).populate("users","-password").populate({path:"latestMessage",populate:{path:"sender",select:"name email pic"}});
        res.status(201).json({message:"Send Messaege Success",data:{messages,chat}})
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}