import User from "../models/user.js";


//Middleware to check is user is authenticated

export const protect = async(req,res,next) =>{
    console.log("req.auth:", req.auth);
    const {userId} = req.auth;
    if (!userId) {
        res.json({success :false, message: "not authentication"})
        
    }
    else{
        const user = await User.findById(userId);
        req.user = user;
        next()
    }
}