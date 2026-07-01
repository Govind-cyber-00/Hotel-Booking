// import User from "../models/user.js";


// //Middleware to check is user is authenticated

// export const protect = async(req,res,next) =>{
    
//     const { userId } = req.auth();
//     if (!userId) {
//         res.json({success :false, message: "not authentication"})
        
//     }
//     else{
//         const user = await User.findById(userId);
        
//         req.user = user;
//         next()
//     }
// }

import User from "../models/user.js";

export const protect = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.json({ success: false, message: "not authentication" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Protect middleware error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}