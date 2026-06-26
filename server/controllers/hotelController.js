import Hotel from "../models/Hotel.js";
import User from "../models/user.js";

export const registerHotel = async (req,res) =>{
    try {
        const {name,address,contact,city} = req.body;
        const owner = req.user._id

        // check if User already Registered

        const hotel = await Hotel.findOne({owner})
        if (hotel) {
            return res.json({success:false,message : "Hotel Already Registered"})
            await Hotel.create({name,address,contact,city,owner});
            await User.findByIdAndUpdate(owner, {role:"Hotel Onwer"})

            res.json({sucess: true,message: "Hotel Registered Successfully"});
        }
    } catch (error) {
        res.json({sucess: false,message: error.message});
    }
}