const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        uniqued:true,
        required:true
    },
    pic:{
        type:String,
        required:true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

//@passwordHash
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
    next()
})
//@passwordMatch
userSchema.methods.matchPassword =async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}

//@generateToken
userSchema.methods.generateToken = async function(){
    return  await jwt.sign({_id:this._id},process.env.JWT_KEY);
}

const User = mongoose.model("User",userSchema);

function userValidate(user){
        const Schema =Joi.object({
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(8).max(15)
        })
        return Schema.validate(user)
}

exports.User= User;
exports.validate=userValidate;