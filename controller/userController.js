const {validate,User} = require('../model/User');
const {Chat} = require('../model/Chat');
const _ = require("lodash");
const Joi = require("joi");

// @desc    useRegister
// @route   POST /api/user
exports.userRegister = async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    try{
        const {name,email,password} =req.body;
        const user = await User.create({name,email,password});
        let token = await user.generateToken();
        res.status(201).json({
                message:"Regsiter Successfully",
                data:{..._.pick(user, ['_id','name', 'email','pic','isAdmin']),
                token}
            })
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
  
}
// @desc    useLogin
// @route   POST /api/user
exports.userLogin = async(req,res)=>{
    const {error} = loginValidate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    try{
        const {email,password} =req.body;
        let user = await User.findOne({email});
        if(user && await user.matchPassword(password)){
            let token =await  user.generateToken();
            res.status(200).json({message:"Login Success",
                data:{..._.pick(user, ['_id','name', 'email','pic','isAdmin']),
                token}
            })
        }else{
            res.status(400).json({message:"You Email Or Password Invalid"})
        }
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}
// @desc    findUser
// @route   GET /api/user
// @access  protected
exports.findUser = async(req,res)=>{
    const searchUser =req.query.search ? {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ]
    }:{};
    try{
        let user= await User.find(searchUser,"-password").find({_id:{$ne:req.user._id}});
        let searchWithChatName = req.query.search ? {chatName:{$regex:req.query.search,$options:"i"}} : {};
        let chats =  await Chat.find(searchWithChatName).find({chatName:{$ne:"sender"},users:{$in:req.user._id}}).populate("groupAdmin","-password");
        if(user.length <=0 && chats.length<=0) return res.status(404).json({message:"Search Not Found"})
        res.status(200).json({data:[...user,...chats]});
    }catch(err){

        res.status(500).json({message:"Something went wrong"})
    }
    

}
// @desc    updateProfilePicture
// @route   PUT /api/user/update_profile_picture
// @access  protected
exports.updateProfilePicture = async(req,res)=>{
    try{
        let user = await User.findByIdAndUpdate(req.user._id,{pic:req.body.pic});
        user = await User.findById(user._id,"-password");
        res.status(200).json({data:user})
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

function loginValidate(user){
    const Schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(8).max(15).required()
    })
    return Schema.validate(user)
}