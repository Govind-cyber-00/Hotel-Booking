// import User from "../models/user.js";


// //Middleware to check is user is authenticated

// export const protect = async(req,res,next) =>{
//     const {userId} = req.auth;
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

    // 👇 Ye 2 console add karo
    console.log("User ID:", userId);

    const user = await User.findById(userId);

    console.log("Mongo User:", user);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};