const { Chat } = require("../model/Chat");

// @desc    accessChat
// @route   POST /api/chat
// @access  protected
exports.accessChat = async(req,res,next)=>{
    const {id} = req.body;
    const authUserId = req.user._id;
    try{
        let chat = await Chat.find({
                $or:[
                    {
                        $and:[
                            {users:{$elemMatch:{$eq:id}}},
                            {users:{$elemMatch:{$eq:req.user._id}}},
                            {isGroupChat:false}
                        ]
                    },
                    {
                        _id:id
                    }
                ]
            }
           
        ).populate("users","-password").populate({path:"latestMessage",populate:{path:"sender",select:"name email pic"}});
        
        if(chat.length){
            res.status(200).json({message:"Creat Chat",data:chat[0]});
        }else{
            let createChat = await Chat.create({users:[authUserId,id]});
            createChat =await Chat.findById(createChat._id).populate("users","-password").populate({path:"latestMessage",populate:{path:"sender",select:"name email pic"}});
            res.status(201).json({message:"Create Chat",data:createChat})
        }
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
   
}

// @desc    createGroup
// @route   POST /api/chat/create
// @access  protected
exports.createGroup = async (req,res,next)=>{
     let chatName= req.body.chatName;
     let users =  req.body.users;
     if(!chatName || !users)return res.status(400).json({message:"Please fill the field"});
     if(users.length<2) return res.status(400).json({message:"More than 2 users are required to form group chat"});
     users.push(req.user)
     try{
   
        let chat= await Chat.create({
                    chatName,
                    isGroupChat:true,
                    groupAdmin:req.user,
                    users})

        let fullChat = await Chat.findById(chat._id).populate("users","-password");
        res.status(200).json({message:"Create Group Chat Success",data:fullChat})
     }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong"});
     }
}


// @desc    addToGroup
// @route   POST /api/chat/add
// @access  protected

exports.addToGroup = async (req,res)=>{
    const {chatId,userId} =req.body;
    if(!chatId || !userId) return;
    try{
        let addToGroupChat = await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}});
        if(!addToGroupChat) return res.status(404).json({message:"Chat Not found"});
        addToGroupChat = await Chat.findById(addToGroupChat._id).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).json({message:"Add To Group Success",data:addToGroupChat})
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

// @desc    removeFromGroup
// @route   POST /api/chat/remove
// @access  protected

exports.removeFromGroup = async(req,res)=>{
    const {chatId,userId} = req.body;
    if(!chatId || !userId) return;
    
    try{
        let removedFromChat = await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}});
        if(!removedFromChat) return res.status(404).json({message:"Chat Not Found"});
        removedFromChat = await Chat.findById(removedFromChat._id).populate("users","-password").populate("groupAdmin","-password");

        /* total users is 2 then group is delete */
        if(removedFromChat.users.length <= 2){
            console.log("work")
            await Chat.findByIdAndDelete(chatId);
        }
        /* Admin is leave from group and add random groupAdmin */
        if(userId ==req.user._id){ 
            await Chat.findByIdAndUpdate(chatId,{groupAdmin:removedFromChat.users[0]._id})
        }
        res.status(200).json({message:"Remove from group success",data:removedFromChat});
    }catch(err){
        console.log(err)
        res.status(500).send({message:"Something went wrong"});
    }
    
}

