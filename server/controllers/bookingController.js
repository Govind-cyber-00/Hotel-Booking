// Function to check availabilty of Room

import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


const checkAvailbilty = async({checkInDate,checkOutDate,room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte:checkOutDate},
            checkOutData: {$gte: checkInDate},
        });
       const isAvailable = bookings.length ===0;
        return isAvailable;

    } catch (error) {
        console.error(error.message);
        
    }
}

//API to Check Availabilty of Room
//Post /api/bookings/check-availability

export const checkAvailablityAPI = async (req,res) =>{
    try {
        const {room,checkInDate,checkOutData} = req.body;
        const isAvailable = await checkAvailbilty({checkInDate,checkOutDate,room});
        res.json({sucsess:true,isAvailable})
    } catch (error) {
        res.json({sucsess:false,message:error.message})
    }
}

//API to Create a new Booking
//Post /api/bookings/book

export const createBooking = async (req,res) =>{
    try {
        const {room,checkInDate,checkOutData,guests} = req.body;
        const user = req.user._id;
        // Before Booking Check Availabilty
        const isAvailable = await checkAvailbilty({
            checkInDate,
            checkOutDate,
            room
        });
        if (!isAvailable) {
            return res.json({success:false,message:"Room is not available"})
            
        }
        //Get totalPrice from  Room
        const roomData = await Room.find(room).populate("hotel");
        let totalPrice = roomData.priceperNight;

        //Calculate TotalPrice based on nights
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutData)
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      totalPrice *= nights;
    const  booking = await Booking.create({
        user,
        room,
        hotel: roomData.hotel._id,
        guests: +guests,
        checkInDate,
        checkOutDate,
        totalPrice,
    })
    res.json({success:true, message:"Booking created successfully"})
    } catch (error) {
        console.log(error);
        
        res.json({success:false, message:"Failed to create booking"})
    }
}

//API to get all bookings for a user
//Get/api/bookings/user

export const getUserBookings = async (req,res) =>{
    try {
        const user = req.user._id;
        const bookings = (await Booking.find({user}).populate("room hotel")).toSorted({createdAt: -1})
        res.json({success: true,bookings})
    } catch (error) {
        res.json({success: false,message: "Failed to fetch bookings"})
    }
}

export const getHotelBookings = async (req,res) =>{
    try {
        const hotel = await Hotel.findOne({owner:req.auth.userId});
    if (!hotel) {
        return res.json({sucess:false, message: "No Hotel Found"});
        
    }
    const bookings = (await Booking.find({hotel: hotel._id}).populate("room hotel user")).sort({created: -1});

    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce((acc,booking) =>acc + booking.totalPrice,0)
    res.json({success:true,dashboardData: {totalBookings,totalRevenue,bookings}})

    } 
    catch (error) {
       res.json({success:false, message: "Failed to fetch bookings"}) 
    }
}