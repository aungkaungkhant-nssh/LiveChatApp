const jwt = require("jsonwebtoken");
const{ User} = require("../model/User");
const isAuth =async (req,res,next)=>{
    let authorization  = req.headers.authorization;
    if(!authorization) return res.status(401).json({message:"UnAuthorized"});   
    if(authorization.split(' ')[0].includes("Bearer")){
        try{
            let token = authorization.split(' ')[1];
            const decoded =  jwt.verify(token,process.env.JWT_KEY);
            let user = await User.findById(decoded._id).select("-password");
            req.user = user;
            next()
        }catch(err){

            res.status(401).json({message:"Invalid Token"})
        }

    }
}

exports.isAuth = isAuth;